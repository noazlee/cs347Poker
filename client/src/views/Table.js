import React from 'react';
import PlayerBox from '../components/PlayerBox'
import Deck from '../components/Deck';
import '../css/Table.css'

export default function Table({ props }) {
    const players = [1, 2, 3, 4, 5, 6, 7, 8]
    return (
        <div className='table'>
            {players.map((index) => (
                <section id={`Box-${index}`}>
                        <PlayerBox isPlayerOne={index === 1}/>
                </section>
            ))}
            <section id='deck'>
                <Deck />
            </section>
        </div>
    );
}