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
            console.log(data.round.currentPlayer);
        });

        socket.on('your-turn', (data) => {
            console.log("My turn!");
            setPlayerOneCurrent(true);
            setMoves(data.acceptableMoves);
        });

        socket.on('shown-cards', (data) => {
            setCommunityCards(data.cards)
        })

        return () => {
            socket.off('update-round-data');
            socket.off('your-turn');
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
            bigBlindPlayerId = data.players[data.currentSmallBlind + 1].userId;
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