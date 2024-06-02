// A small display that appears on round end, showing the winner and community cards.
// Contributors: Ashok Khare

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

    const winnerUsernames = [];
    const communalCards = [];

    props.data.winner.forEach(winningPlayer => {
        winnerUsernames.push(winningPlayer.username);
    });

    props.communityCards.forEach(card => {
        communalCards.push(`${card.value} of ${card.suite}`);
    });

    return (
        <div className='winDisplay'>
            <h1>Round Over</h1>
            {winnerUsernames.length > 0 && <p>Winners: {winnerUsernames.join(', ')}</p>}
            {communalCards.length > 0 && <p>Community Cards: {communalCards.join(', ')}</p>}
            {props.isHost === true ? ( //ensures the emit is not sent twice
                <button onClick={startNewRound}>Start New Round</button>
            ) : (
                <p>Waiting for the host to start new round...</p>
            )}
        </div>
    );
}