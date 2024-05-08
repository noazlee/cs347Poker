import React from 'react';
import PlayerBox from '../components/PlayerBox'
import Deck from '../components/Deck';
import { useLocation } from 'react-router-dom';
import '../css/Table.css'

export default function Table({ props }) {
    const { state } = useLocation();

    const ind = [1, 2, 3, 4, 5, 6, 7, 8]
    const players = state.players;

    return (
        <div className='table'>
            {ind.map((index) => (
                <section id={`Box-${index}`}>
                    {index <= players.length &&
                        <PlayerBox isPlayerOne={index === 1} player={players[index - 1].userId} chips={players[index - 1].chips}/>
                    }
                </section>
            ))}
            <section id='deck'>
                <Deck />
            </section>
        </div>
    );
}