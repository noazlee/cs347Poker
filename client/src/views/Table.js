import React, {useState, useEffect} from 'react';
import PlayerBox from '../components/PlayerBox'
import Deck from '../components/Deck';
import '../css/Table.css'
import { useParams } from 'react-router-dom';
import socket from '../socket';

export default function Table({ props }) {
    const [roundData, setRoundData] = useState(undefined);
    const [playerOneCurrent, setPlayerOneCurrent] = useState(false);
    const [moves, setMoves] = useState([]);
    const [communityCards, setCommunityCards] = useState([]);
    const {gameId, userId} = useParams();

    useEffect(() => {
        socket.on('update-round-data', (data) => {
            setRoundData(data.round);
        });

        socket.on('your-turn', (data) => {
            setPlayerOneCurrent(true);
            setMoves(data.acceptableMoves);
        });

        socket.on('shown-cards', (data) => {
            setCommunityCards(data.cards);
        })

        socket.on('round-ended', (data)=>{
            console.log('game ended on client');
            console.log(data.cards);
            setCommunityCards(data.cards);
            if(socket.id===data.winner.socketId){ //ensures this is not sent twice
                socket.emit('round-end-client', {gameId: data.gameId, winner:data.winner, prevIndex: data.prevIndex});
            }
        })

        return () => {
            socket.off('update-round-data');
            socket.off('your-turn');
            socket.off('round-ended');
            socket.off('shown-cards');
        };
    }, []);

    const generatePlayerBoxes = (data) => {
        const currentPlayerId = data.players[data.currentPlayer].userId;
        let smallBlindPlayerId;
        let bigBlindPlayerId;
        let box = 1;

        console.log(`Now playing: Player ${data.currentPlayer}`);

        if (data.players.length >= 2) {
            smallBlindPlayerId = data.players[data.currentSmallBlind].userId;
            bigBlindPlayerId = data.players[(data.currentSmallBlind + 1) % data.players.length].userId;
        } else {
            smallBlindPlayerId = bigBlindPlayerId = undefined;
        }

        return (
            data.players.map((player, index) => {
                let blindStatus = 0;
                if (player.socketId === smallBlindPlayerId) {
                    blindStatus = 1;
                } else if (player.socketId === bigBlindPlayerId) {
                    blindStatus = 2;
                }

                let isPlayerOne;
                if (player.socketId === socket.id) {
                    isPlayerOne = true;
                } else {
                    isPlayerOne = false;
                }

                return (
                    <section key={index} id={isPlayerOne ? 'Player1-Box' : `Box-${box++}`}>
                        <PlayerBox
                            player={player} 
                            playerOne={isPlayerOne}
                            isCurrentPlayer={playerOneCurrent}
                            blind={blindStatus}
                            moves={moves}
                            props={{
                                toggleCurrentPlayer: setPlayerOneCurrent
                            }}
                            gameId={gameId}
                            userId={userId}
                            active={player.userId === currentPlayerId ? true : false}
                        />
                    </section>
                )
        }));
    }

    return (
        roundData === undefined ? (
            <p>Loading...</p>
        ) : (
            <div className='table'>
                {generatePlayerBoxes(roundData)}
                <section id='deck'>
                    <Deck props={{communityCards: communityCards}}/>
                </section>
            </div>
        )
    );
}