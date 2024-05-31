// Page where users enter a game code to join the game
// Contributors: Noah Lee, Batmend Batsaikhan

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../App.css';
import socket  from '../socket';
import { buildImgUrl } from '../utils/utils';

const JoinRoom = () => {
const { userId } = useParams();
const navigate = useNavigate();
const [gameId, setGameId] = useState('');
const [players, setPlayers] = useState([]);

const [backgroundPosition, setBackgroundPosition] = useState(0);

const { state } = useLocation();

useEffect(() => {
    const interval = setInterval(() => {
        setBackgroundPosition(prevPosition => (prevPosition + 1) % 75); // This will move the background
    }, 75);
    return () => clearInterval(interval);
}, []);

const backgroundStyle = {
    backgroundImage: `url(${buildImgUrl('poker-bg2.jpg')})`,
    backgroundRepeat: 'repeat-y',
    backgroundPosition: `${backgroundPosition}% 0`,
    backgroundSize: '150% auto',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow:'auto',
    position:'relative',
};

useEffect(() => {
    const handlePlayerJoined = (data) => {
        console.log("Received player-joined data:", data);
        setPlayers(data.player_names);
        if (data.playerId === userId && data.gameId === gameId) {
            console.log("Navigating to game room...");
            navigate(`/game/${gameId}/${userId}`, {state: {hostId: data.hostId}});
        }
    };

    socket.on('player-joined', (data) => {
        handlePlayerJoined(data)
    })

    return () => {
        socket.off('player-joined');
    };
}, [userId, gameId, navigate]);

const handleJoin = (e) => {
    e.preventDefault();
    if (gameId) {
        socket.emit('join-game', { playerId: userId, gameId, username: state.username});
    } else {
        alert('Please enter a valid game ID.');
    }
};

return (
    <div style={backgroundStyle}>
    <div className="home-container">
        <form className="join-form" onSubmit={handleJoin}>
            <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter Game ID"
            />
            <button type="submit">Join Room</button>
        </form>
        {players.length > 0 && (
            <div>
                <h3>Players in the room:</h3>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>{player}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
    </div>
);
};

export default JoinRoom;
