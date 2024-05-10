import React, {useState, useEffect} from 'react';
import PlayerBox from '../components/PlayerBox'
import Deck from '../components/Deck';
import { useLocation } from 'react-router-dom';
import '../css/Table.css'
import socket from '../socket';

export default function Table({ props }) {
    const [roundData, setRoundData] = useState({})

    useEffect(() => {
        socket.on('update-round-data', (data) => {
            console.log(`Round data: ${data.round}`);
            setRoundData(data.round);
        });
    }, []);

    const { state } = useLocation();

    const ind = [1, 2, 3, 4, 5, 6, 7, 8]
    const players = state.players;

    return (
        <div className='table'>
            {ind.map((index) => (
                <section key={index} id={`Box-${index}`}>
                    {index <= players.length &&
                        <PlayerBox isPlayerOne={index === 1} player={players[index - 1].userId} chips={players[index - 1].chips} socket={socket}/>
                    }
                </section>
            ))}
            <section id='deck'>
                <Deck />
            </section>
        </div>
    );
}