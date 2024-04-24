import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import '../App.css';

const acceptedURL  = ['http://10.133.26.36:3001', 'http://localhost:3001']
const socket = io(acceptedURL, { withCredentials: true, transports: ['websocket', 'polling'] });

const JoinRoom = () => {
    const { userId } = useParams();
    const [gameId, setGameId] = useState('');
    const [players, setPlayers] = useState([]);

    const handleJoin = (e) => {
        e.preventDefault();
        socket.emit('join-game', { playerId: userId, gameId });
    };

    useEffect(() => {
        socket.on('player-joined', (data) => {
            setPlayers(data.player_names);
        });

        return () => {
            socket.off('player-joined');
        };
    });

    return (
        <div className="home-container">
            <form onSubmit={handleJoin}>
                <input
                    type="text"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="Username"
                />
                <button type="submit">Join Room</button>
            </form>
            <div>
                <h3>Players in the room:</h3>
                <ul>
                    {players.map((player) => (
                        <li key={player}>{player}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default JoinRoom;
