import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import l from 'lodash';

import '../App.css';
import socket  from '../socket';

import { buildImgUrl } from '../utils/utils';


const Home = () => {
    const { userId } = useParams();
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const [backgroundPosition, setBackgroundPosition] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundPosition(prevPosition => (prevPosition + 1) % 100); // This will move the background
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const backgroundStyle = {
        backgroundImage: `url(${buildImgUrl('poker-bg2.jpg')})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${backgroundPosition}% 0`,
        backgroundSize: '150% auto',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };


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
        <div style={backgroundStyle}>
        <div className="home-container">
            <h1 className="home-title">Welcome, {username || 'Loading...'}</h1>
            <button className="home-button" onClick={handleCreateGame}>Create New Game</button>
            <button className="home-button" onClick={handleJoinGame}>Join Game</button>
        </div>
        </div>
    );
};

export default Home;
