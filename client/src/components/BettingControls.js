import React from 'react';
import ChipsDisplay from './ChipsDisplay';
import '../css/BettingControls.css';

export default function BettingControls({ props }) {
    return (
        <div className='bettingControls'>
            <div className='buttonRow'>
                <button id='checkButton' onClick={() => console.log('check')}>Check</button>
                <button id='raiseButton' onClick={() => console.log('raise')}>Raise</button>
                <button id='foldButton' onClick={() => console.log('fold')}>Fold</button>
            </div>
            <ChipsDisplay props={{initialChips: props.initialChips, currentBet: props.currentBet}}/>
        </div>
    );
}