// Displays a player's chips.
// Contributors: Ashok Khare, Carlos Flores

import React from 'react';
import { buildImgUrl } from '../utils/utils';
import '../css/ChipsDisplay.css';

export default function ChipsDisplay({ props }) {
    return (
        <div className='chipsDisplay'>
            <img
                src={buildImgUrl('chip.png')}
                alt='Poker chip'
                width={40}
                height={40}
            />
            <div id='values'>
                <p>Chips: {props.initialChips}</p>
                <p>Bet: {props.currentBet}</p>
            </div>
        </div>
    )
}