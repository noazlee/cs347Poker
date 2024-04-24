import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import '../App.css';
import { socket } from '../socket';

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
            navigate(`/game/${data.gameId}/${data.hostId}`); 
        };

        socket.on('game-created', handleGameCreated);

        return () => {
            socket.off('game-created', handleGameCreated);
        };
    }, [navigate]);

    const handleCreateGame = () => {
        socket.emit('create-game', { hostId: userId });
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Welcome, {username || 'Loading...'}</h1>
            <button className="home-button" onClick={handleCreateGame}>Create New Game</button>
        </div>
    );
};

export default Home;
