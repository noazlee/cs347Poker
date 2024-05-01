import React from 'react';
import Card from './Card';
import '../css/Deck.css';

export default function Deck({ props }) {
    return (
        <div className='deck'>
            <section id='revealedCards'>
                <section id='firstSlot'>
                    <Card isVisible={true} />
                </section>
                <section id='secondSlot'>
                    <Card isVisible={true} />
                </section>
                <section id='thirdSlot'>
                    <Card isVisible={true} />
                </section>
                <section id='fourthSlot'>
                    <Card isVisible={true} />
                </section>
                <section id='fifthSlot'>
                    <Card isVisible={true} />
                </section>
            </section>
            <Card isVisible={false} />
        </div>
    )
}