import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import '../App.css';

const acceptedURL = ['http://10.133.26.36:3001', 'http://localhost:3001'];
const socket = io(acceptedURL, { withCredentials: true, transports: ['websocket', 'polling'] });

const GameRoom = () => {
    const { gameId, userId } = useParams();
    const [username, setUsername] = useState('');
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Fetch user details
        const fetchUser = async () => {
            const response = await axios.get(`/api/users/${userId}`);
            setUsername(response.data.username);
        };

        fetchUser();

        // Setup socket listeners
        socket.emit('join-game', { playerId: userId, gameId });  // Join the game room on component mount

        socket.on('update-players', (data) => {
            setPlayers(data.players);  // Update player list when new players join or leave
        });

        return () => {
            socket.off('update-players');
        };
    }, [gameId, userId]);

    return (
        <div className="game-room">
            <h1>Game ID: {gameId}</h1>
            <h1>Host: {username || 'Loading...'}</h1>
            <h3>Players in the room:</h3>
            <ul>
                {players.map((player, index) => (
                    <li key={index}>{player}</li>
                ))}
            </ul>
        </div>
    );
};

export default GameRoom;
