import React, {useState, useEffect} from 'react';
import PlayerBox from '../components/PlayerBox'
import Deck from '../components/Deck';
import '../css/Table.css'
import { useParams } from 'react-router-dom';
import socket from '../socket';

export default function Table({ props }) {
    const [roundData, setRoundData] = useState(undefined);
    const [isCurrentPlayer, setIsCurrentPlayer] = useState(false);
    const [moves, setMoves] = useState([]);
    const {gameId, userId} = useParams();

    useEffect(() => {
        socket.on('update-round-data', (data) => {
            setRoundData(data.round);
        });

        socket.on('your-turn', (data) => {
            console.log("My turn!");
            setIsCurrentPlayer(true);
            setMoves(data.acceptableMoves);
        });

        return () => {
            socket.off('update-round-data');
            socket.off('your-turn');
        };
    }, []);

    const generatePlayerBoxes = (data) => {
        let smallBlindPlayerId;
        let bigBlindPlayerId;
        let box = 1;

        if (data.players.length >= 2) {
            smallBlindPlayerId = data.players[data.currentSmallBlind].socketId;
            bigBlindPlayerId = data.players[data.currentSmallBlind + 1].socketId;
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
                            isCurrentPlayer={isCurrentPlayer}
                            blind={blindStatus}
                            moves={moves}
                            props={{
                                toggleCurrentPlayer: setIsCurrentPlayer
                            }}
                            gameId={gameId}
                            userId={userId}
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
                    <Deck props={{cards: roundData.communityCards}}/>
                </section>
            </div>
        )
    );
}