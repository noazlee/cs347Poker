import React from 'react';
import socket from '../socket';
import '../css/WinDisplay.css';

export default function WinDisplay({ props }) {
    const startNewRound = () => {
        socket.emit('round-end-client', {gameId: props.gameId, winner: props.winner, prevIndex: props.prevIndex});
    }

    return (
        <div className='winDisplay'>
            <h1>{props.winner.username} Wins!</h1>
            {socket.id === props.winner.socketId ? ( //ensures the emit is not sent twice
                <button onClick={startNewRound}>Start New Round</button>
            ) : (
                <p>Waiting for the winner to start new round...</p>
            )}
        </div>
    );
}