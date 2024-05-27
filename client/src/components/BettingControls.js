import React, { useState } from 'react';
import ChipsDisplay from './ChipsDisplay';
import Popup from './Popup';
import '../css/BettingControls.css';
import socket from '../socket';

export default function BettingControls({ props }) {
    const gameId = props.gameId;
    const [popupDisplayed, toggleDisplayPopup] = useState(false);
    const [buttonRowOn, toggleButtonRow] = useState(true);
    const moves = props.moves;


    const handleRaise = () => {
        toggleDisplayPopup(true);
        toggleButtonRow(false);
    }

    const handleCheck = () => {
        console.log('check');
        props.toggleCurrentPlayer(false);
        socket.emit('player-action', {
            action: 'check',
            gameId:gameId
        });
    }

    const handleFold = () => {
        console.log('fold');
        props.toggleCurrentPlayer(false);
        socket.emit('player-action', {
            action: 'fold',
            gameId:gameId
        });
    }

    const handleCall = () => {
        console.log('call');
        props.toggleCurrentPlayer(false);
        socket.emit('player-action', {
            action: 'call',
            gameId:gameId,
            username:props.username
        });
    }

    return (
        <div className='bettingControls'>
            <Popup isDisplayed={popupDisplayed} togglePopup={toggleDisplayPopup} props={{toggleButtons: toggleButtonRow, gameId: gameId, maxChips: props.initialChips, toggleCurrentPlayer: props.toggleCurrentPlayer, highestBet: props.highestBet, currentBet: props.currentBet}} />
            {(props.isTurn && buttonRowOn) ? (
                <div className='buttonRow'>
                    {moves.includes('Check') && <button id='checkButton' onClick={handleCheck}>Check</button>}
                    {moves.includes('Call') && <button id='callButton' onClick={handleCall}>Call</button>}
                    {moves.includes('Raise') && <button id='raiseButton' onClick={handleRaise}>Raise</button>}
                    {moves.includes('Fold') && <button id='foldButton' onClick={handleFold}>Fold</button>}
                </div>
            ) : (
                null
            )}
            <ChipsDisplay props={{initialChips: props.initialChips, currentBet: props.currentBet}}/>
        </div>
    );
}