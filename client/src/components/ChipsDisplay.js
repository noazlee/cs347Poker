import React from 'react';
import { buildImgUrl } from '../utils/utils';
import '../css/ChipsDisplay.css';

export default function ChipsDisplay({ props }) {
    return (
        <div className='chipsDisplay'>
            <img
                src={buildImgUrl('chip.png')}
                alt='Poker chip'
                width={20}
                height={20}
            />
            <div id='values'>
                <p>Chips: {props.initialChips}</p>
                <p>Bet: {props.currentBet}</p>

            </div>
        </div>
    )
}