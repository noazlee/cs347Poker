import React from 'react';
import PlayerBox from '../components/PlayerBox'
import Deck from '../components/Deck';
import '../css/Table.css'

export default function Table({ props }) {
    return (
        <div className='table'>
            <section id='firstBox'>
                <PlayerBox isPlayerOne={false} blind={1} />
            </section>
            <section id='secondBox'>
                <PlayerBox isPlayerOne={false} blind={2} />
            </section>
            <section id='thirdBox'>
                <PlayerBox isPlayerOne={false} />
            </section>
            <section id='fourthBox'>
                <PlayerBox isPlayerOne={false} />
            </section>
            <section id='deck'>
                <Deck />
            </section>
            <section id='fifthBox'>
                <PlayerBox isPlayerOne={false} />
            </section>
            <section id='sixthBox'>
                <PlayerBox isPlayerOne={false} />
            </section>
            <section id="seventhBox">
                <PlayerBox isPlayerOne={true} />
            </section>
            <section id='eighthBox'>
                <PlayerBox isPlayerOne={false} />
            </section>
        </div>
    );
}