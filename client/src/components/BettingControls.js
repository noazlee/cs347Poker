import React, { useState } from 'react';
import ChipsDisplay from './ChipsDisplay';
import Popup from './Popup';
import '../css/BettingControls.css';
import socket from '../socket';

export default function BettingControls({ props }) {
    const [popupDisplayed, toggleDisplayPopup] = useState(false);

    const handleRaise = () => {
        toggleDisplayPopup(true);
    }

    const handleCheck = () => {
        console.log('check');
        socket.emit('check', {})
    }

    const handleFold = () => {
        console.log('fold');
        socket.emit('fold', {})
    }

    return (
        <div className='bettingControls'>
            <Popup isDisplayed={popupDisplayed} togglePopup={toggleDisplayPopup} />
            <div className='buttonRow'>
                <button id='checkButton' onClick={handleCheck}>Check</button>
                <button id='raiseButton' onClick={handleRaise}>Raise</button>
                <button id='foldButton' onClick={handleFold}>Fold</button>
            </div>
            <ChipsDisplay props={{initialChips: props.initialChips, currentBet: props.currentBet}}/>
        </div>
    );
}