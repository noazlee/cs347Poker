import React, {useState, useEffect} from 'react';
import PlayerBox from '../components/PlayerBox'
import Deck from '../components/Deck';
// import { useLocation } from 'react-router-dom';
import '../css/Table.css'
import socket from '../socket';
// import Player from '../../../server/classes/player';
import axios from 'axios';

export default function Table({ props }) {
    const [roundData, setRoundData] = useState(undefined)

    useEffect(() => {
        socket.on('update-round-data', (data) => {
            setRoundData(data.round);
        });

        return () => {
            socket.off('update-round-data');
        };
    }, []);

    const generatePlayerBoxes = (data) => {
        const currPlayerId = data.players[data.currentPlayer].socketId;
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
                            isCurrentPlayer={currPlayerId === player.socketId && true}
                            blind={blindStatus}
                        />
                    </section>
                )
        }));
    }

    return (
        <div className='table'>
            {roundData === undefined ? (
                <p>Loading...</p>
            ) : (
                generatePlayerBoxes(roundData)
            )}
            <section id='deck'>
                <Deck />
            </section>
        </div>
    );
}