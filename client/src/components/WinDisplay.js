import React from 'react';
import socket from '../socket';
import '../css/WinDisplay.css';

export default function WinDisplay({ props }) {
    const startNewRound = () => {
        socket.emit('round-end-client', {gameId: props.data.gameId, winner: props.data.winner, prevIndex: props.data.prevIndex});
    }

    return (
        <div className='winDisplay'>
            <h1>{props.data.winner.username} Wins!</h1>
            {props.isHost === true ? ( //ensures the emit is not sent twice
                <button onClick={startNewRound}>Start New Round</button>
            ) : (
                <p>Waiting for the host to start new round...</p>
            )}
        </div>
    );
}