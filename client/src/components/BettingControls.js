import React, { useEffect, useState } from 'react';
import ChipsDisplay from './ChipsDisplay';
import Popup from './Popup';
import '../css/BettingControls.css';
import socket from '../socket';

export default function BettingControls({ props }) {
    const [popupDisplayed, toggleDisplayPopup] = useState(false);
    const [moves, setMoves] = useState([]);
    const [isPlayersTurn, setIsPlayersTurn] = useState(false);
    const [buttonRowOn, toggleButtonRow] = useState(true);

    const handleRaise = () => {
        console.log('raise');
        toggleDisplayPopup(true);
        toggleButtonRow(false);
    }

    useEffect(() => {
        socket.on('your-turn', (data) => {
            setMoves(data.acceptableMoves);
            setIsPlayersTurn(true);
        });

        return () => {
            socket.off('your-turn');
        }
    }, []);

    return (
        <div className='bettingControls'>
            <Popup isDisplayed={popupDisplayed} togglePopup={toggleDisplayPopup} props={{toggleButtons: toggleButtonRow}} />
            {isPlayersTurn && buttonRowOn ? (
                <div className='buttonRow'>
                    {moves.includes('check') && <button id='checkButton' onClick={() => console.log('check')}>Check</button>}
                    {moves.includes('call') && <button id='callButton' onClick={() => console.log('call')}>Call</button>}
                    {moves.includes('raise') && <button id='raiseButton' onClick={() => handleRaise()}>Raise</button>}
                    {moves.includes('fold') && <button id='foldButton' onClick={() => console.log('fold')}>Fold</button>}
                </div>
            ) : (
                null
            )}
            <ChipsDisplay props={{initialChips: props.initialChips, currentBet: props.currentBet}}/>
        </div>
    );
}