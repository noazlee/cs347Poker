// User interface to change a game's initial settings.
// Created by Ashok 
// Contributor: Wesley, Sho

import React from 'react';
import '../css/GameSettings.css';
import socket from '../socket';

export default function GameSettings({ props }) {

    const reduceMaxPlayers = () => {
        if (props.maxPlayers === 2) {
            alert("Cannot have fewer than 2 players in a game.");
        } else {
            props.setMaxPlayers(props.maxPlayers - 1);
        }
    }

    const raiseMaxPlayers = () => {
        if (props.maxPlayers === 8) {
            alert("Cannot have more than 8 players in a game.")
        } else {
            props.setMaxPlayers(props.maxPlayers + 1);
        }
    }

    const changeBlindAmount = (e) => {
        if (parseInt(e.target.value) <= 0) {
            alert("Small blind amount cannot be zero or less.");
            props.setBlindAmount(1);
        } else {
            props.setBlindAmount(e.target.value);
        }
    }

    const changeStartingChips = (e) => {
        if (parseInt(e.target.value) <= 0) {
            alert("Starting chips value cannot be zero or less.");
            props.setStartingChips(1)
        } else {
            props.setStartingChips(e.target.value);
        }
    }

    const addAi = () => {
        if (props.players.length === props.maxPlayers) {
            alert("Not enough room to add another AI player.");
        } else {
            socket.emit('add-ai', {gameId:props.gameId}); 
            // props.setNumAiPlayers(props.numAiPlayers + 1);
        }
    }
    const removeAi = () => {
        socket.emit('remove-ai', { gameId: props.gameId });
        // props.setNumAiPlayers(props.numAiPlayers - 1);
    }


    return (
        <div className='gameSettings'>
            <h3>Game Settings</h3>
            <section className='setting'>
                <h4>Number of Players</h4>
                <button id='lowerMaxPlayers' onClick={reduceMaxPlayers}>&lt;</button>
                <p>{props.maxPlayers}</p>
                <button id='raiseMaxPlayers' onClick={raiseMaxPlayers}>&gt;</button>
            </section>
            <section className='setting'>
                <h4>Small Blind Amount</h4>
                <input
                    type='number'
                    id='changeBlindAmount'
                    name='changeBlindAmount'
                    min={1}
                    value={props.blindAmount}
                    onChange={(e) => changeBlindAmount(e)}
                />
            </section>
            <section className='setting'>
                <h4>Starting Chips</h4>
                <input
                    type='number'
                    id='changeStartingChips'
                    name='changeStartingChips'
                    min={1}
                    value={props.startingChips}
                    onChange={(e) => changeStartingChips(e)}
                />
            </section>
            <section className='setting'>
                <h4>AI Players</h4>
                {/* <p>{props.numAiPlayers}</p> */}
                <button id='addAi' onClick={addAi}>Add AI</button>
                <button id='removeAi' onClick={removeAi}>Remove AI</button>
            </section>
        </div>
    )
}