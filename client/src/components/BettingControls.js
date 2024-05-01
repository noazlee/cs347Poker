import React, { useState } from 'react';
import ChipsDisplay from './ChipsDisplay';
import Popup from './Popup';
import '../css/BettingControls.css';

export default function BettingControls({ props }) {
    const [popupDisplayed, toggleDisplayPopup] = useState(false);

    const handleRaise = () => {
        console.log('raise');
        toggleDisplayPopup(true);
    }

    return (
        <div className='bettingControls'>
            <Popup isDisplayed={popupDisplayed} togglePopup={toggleDisplayPopup} />
            <div className='buttonRow'>
                <button id='checkButton' onClick={() => console.log('check')}>Check</button>
                <button id='raiseButton' onClick={() => handleRaise()}>Raise</button>
                <button id='foldButton' onClick={() => console.log('fold')}>Fold</button>
            </div>
            <ChipsDisplay props={{initialChips: props.initialChips, currentBet: props.currentBet}}/>
        </div>
    );
}