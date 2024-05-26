import React, { useState } from 'react';
import '../css/Popup.css';
import socket from '../socket';


export default function Popup ({ isDisplayed, togglePopup, props }) {
    const [raiseAmount, changeRaiseAmount] = useState(1)

    const goAllIn = () => {
        changeRaiseAmount(props.maxChips);
    }

    const handleSubmit = () => {
        let raiseValue = Number(document.getElementById('raiseAmount').value);

        if (raiseValue < 1) { raiseValue = 1 }
        
        if (raiseValue > props.maxChips) { raiseValue = props.maxChips }

        socket.emit('player-action', {
            action: 'raise',
            gameId: props.gameId,
            value: raiseValue
        });
        togglePopup(false);
        props.toggleCurrentPlayer(false);
        props.toggleButtons(true);
    }

    const raise = (e) => {
        const raiseValue = e.target.value;
        if (raiseValue <= props.currentBet) {
            alert("You must raise to an amount greater than your current bet.");
            changeRaiseAmount(props.currentBet + 1);
        } else if (raiseValue > props.maxChips) {
            alert("You cannot raise more chips than you have available.");
            changeRaiseAmount(props.maxChips);
        } else {
            changeRaiseAmount(raiseValue);
        }
    }

    return isDisplayed === true ? (
        <div className='popup'>
            <div id='raiseForm'>
                <h2>Select Amount to Raise</h2>
                <input type='number' name='raiseAmount' id='raiseAmount' min={props.currentBet + 1} max={props.maxChips} value={raiseAmount} onChange={(e) => raise(e)}/>
                <button onClick={goAllIn}>Go All In!</button>
                <button onClick={() => {
                    togglePopup(false);
                    props.toggleButtons(true);
                }}>Cancel</button>
                <button onClick={handleSubmit}>Confirm</button>
            </div>
        </div>
    ) : (
        null
    )
}