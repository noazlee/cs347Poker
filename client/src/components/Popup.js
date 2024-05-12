import React, { useState } from 'react';
import '../css/Popup.css';
import socket from '../socket';


export default function Popup ({ isDisplayed, togglePopup, props }) {
    const [raiseAmount, changeRaiseAmount] = useState(0)

    const goAllIn = () => {
        changeRaiseAmount(50);
    }

    const handleSubmit = () => {
        console.log(document.getElementById('raiseAmount').value);
        console.log(raiseAmount);

        socket.emit('raise', {amount: raiseAmount});
        togglePopup(false);
    }

    return isDisplayed === true ? (
        <div className='popup'>
            <div id='raiseForm'>
                <h2>Select Amount to Raise</h2>
                <input type='number' name='raiseAmount' id='raiseAmount' value={raiseAmount} onChange={(e) => changeRaiseAmount(e.target.value)}/>
                <button onClick={goAllIn}>Go All In!</button>
                <button onClick={() => togglePopup(false)}>Cancel</button>
                <button onClick={handleSubmit}>Confirm</button>
            </div>
        </div>
    ) : (
        null
    )
}