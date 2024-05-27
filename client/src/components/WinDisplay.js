import React from 'react';
import socket from '../socket';
import '../css/WinDisplay.css';

export default function WinDisplay({ props }) {
    const startNewRound = () => {
        console.log(props.data);
        if(props.isHost){ //ensures this is not sent twice
            console.log('Sending socket emit');
            socket.emit('round-end-client', {gameId: props.data.gameId, winner:props.data.winner, prevIndex: props.data.prevIndex, stillPlaying: props.data.stillPlaying});
        }  
    }

    return (
        <div className='winDisplay'>
            <h1>Round Over</h1>
            <h2>Winners:</h2>
            {props.data.winner.map((winningPlayer, index) => {
                console.log(`Winner: ${winningPlayer.username}`);
                return (<p key={index}>{winningPlayer}</p>)
            })}
            {props.isHost === true ? ( //ensures the emit is not sent twice
                <button onClick={startNewRound}>Start New Round</button>
            ) : (
                <p>Waiting for the host to start new round...</p>
            )}
        </div>
    );
}