import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import '../App.css';

const acceptedURL = ['http://10.133.26.36:3001', 'http://localhost:3001'];
const socket = io(acceptedURL, { withCredentials: true, transports: ['websocket', 'polling'] });

const GameRoom = () => {
    const { gameId, userId } = useParams();
    const [username, setUsername] = useState('');
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    // Fetching the current user's username
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                setUsername(response.data.username);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        // Setup socket listeners
        socket.emit('join-game', { playerId: userId, gameId });  // Join the game room on component mount

        socket.on('update-players', (data) => {
            const fetchAllUsernames = async () => {
                const playerDetails = await Promise.all(data.players.map(id => 
                    axios.get(`/api/users/${id}`).then(res => ({ userId: id, username: res.data.username }))
                ));
                setPlayers(playerDetails);
            };
            fetchAllUsernames();
        });

        socket.on('game-started', (data) => {
            navigate(`/table/${gameId}/${userId}`);
        });

        return () => {
            socket.off('update-players');
        };
    }, [gameId, userId, navigate]);

    const startGame = () => {
        socket.emit('start-game', { gameId });
    };

    return (
        <div className="game-room">
            <h1>Game ID: {gameId}</h1>
            <h1>Host: {username || 'Loading...'}</h1>
            <h3>Players in the room:</h3>
            <ul>
                {players.map((player, index) => (
                    <li key={index}>{player.username}</li>
                ))}
            </ul>
            <button className="home-button" onClick={startGame}>Start Game</button>
        </div>
    );
};

export default GameRoom;
