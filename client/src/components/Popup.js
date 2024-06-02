// A popup box that allows the user to specify an amount to raise on their turn.
// Contributors: Ashok Khare

import React, { useState } from 'react';
import '../css/Popup.css';
import socket from '../socket';


export default function Popup ({ isDisplayed, togglePopup, props }) {
    const [raiseAmount, changeRaiseAmount] = useState(1)

    const goAllIn = () => {
        changeRaiseAmount(props.maxChips + props.currentBet);
    }

    console.log("Popup Global betting cap: ", props.globalBettingCap);

    const handleSubmit = () => {
        let raiseValue = Number(document.getElementById('raiseAmount').value);

        if (raiseValue < 1) { raiseValue = 1 }
        
        if (raiseValue > props.globalBettingCap) {
            alert('You cannot raise more than the global betting cap');
            return;
        }

        if (raiseValue > props.maxChips + props.currentBet) { 
            alert('You do not have enough chips to raise this amount');
            return;
        }

        if (raiseValue <= props.currentBet) {
            alert('You must raise to an amount greater than your current bet');
            return;
        }

        console.log(props.highestBet);

        if(raiseValue>props.highestBet){
            socket.emit('player-action', {
                action: 'raise',
                gameId: props.gameId,
                value: raiseValue,
                username: props.username
            });
            togglePopup(false);
            props.toggleCurrentPlayer(false);
            props.toggleButtons(true);
        }else{
            alert("Need to bet at more than the current highest bet (If you saw this error when trying to match other player's bet, please use the 'call' button instead"); //This does not allow user to all-in when they have less chips than the highest amount. Needs to fix this in the future.
        }      
    }

    const raise = (e) => {
        changeRaiseAmount(e.target.value);
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