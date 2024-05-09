import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import l from 'lodash';

import '../App.css';
import socket  from '../socket';

const Home = () => {
    const { userId } = useParams();
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

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
        const handleGameCreated = (data) => {
            console.log('Game Created:', data);
            // Navigate to GameRoom directly after game creation
            navigate(`/game/${data.gameId}/${userId}`);
        };
        socket.on('game-created', handleGameCreated);
        return () => {
            socket.off('game-created', handleGameCreated);
        };
    }, [navigate, userId]);


    const handleCreateGame = l.debounce(() => {
        socket.emit('create-game', { hostId: userId });
    }, 300);

    const handleJoinGame = l.debounce(() => {
        navigate(`/join/${userId}`);
    }, 300);


    return (
        <div className="home-container">
            <h1 className="home-title">Welcome, {username || 'Loading...'}</h1>
            <button className="home-button" onClick={handleCreateGame}>Create New Game</button>
            <button className="home-button" onClick={handleJoinGame}>Join Game</button>
        </div>
    );
};

export default Home;
