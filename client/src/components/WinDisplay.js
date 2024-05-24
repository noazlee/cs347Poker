import React from 'react';
import socket from '../socket';
import '../css/WinDisplay.css';

export default function WinDisplay({ props }) {
    const startNewRound = () => {
        socket.emit('round-end-client', {gameId: props.data.gameId, winner: props.data.winner, prevIndex: props.data.prevIndex});
        props.data.winner.forEach(winnerP=>{
            if(socket.id===winnerP.socketId){ //ensures this is not sent twice
                console.log('Sending socket emit');
                socket.emit('round-end-client', {gameId: props.data.gameId, winner:winnerP, prevIndex: props.data.prevIndex, stillPlaying: props.data.stillPlaying});
            }  
        })
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