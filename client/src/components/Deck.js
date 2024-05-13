import React from 'react';
import Card from './Card';
import '../css/Deck.css';

export default function Deck({ props }) {
    return (
        <div className='deck'>
            <section id='revealedCards'>
                {props.communityCards && props.communityCards.map((card, index) => {
                    return <Card key={index} isVisible={true} suit={card.suite} value={card.value} />
                })}
            </section>
            <Card isVisible={false} />
        </div>
    )
}