// Home page players land on after logging in
// Contributors: Noah Lee

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
            navigate(`/game/${data.gameId}/${userId}`, {state: {hostId: data.hostId}});
        };
        socket.on('game-created', handleGameCreated);
        return () => {
            socket.off('game-created', handleGameCreated);
        };
    }, [navigate, userId]);


    const handleCreateGame = l.debounce(() => {
        socket.emit('create-game', { hostId: userId, username});
    }, 300);

    const handleJoinGame = l.debounce(() => {
        navigate(`/join/${userId}`, {state: {username}});
    }, 300);


    return (
        <div style={backgroundStyle}>
        <div className="home-container">
            <div className="navigation-tab">
                <button onClick={() => navigate(`/leaderboard/${userId}`)}>Leaderboard</button>
                <button onClick={() => navigate(`/game-history/${userId}`)}>Game History</button>
            </div>
            <h1 className="home-title">Welcome, {username || 'Loading...'}</h1>
            <button className="home-button" onClick={handleCreateGame}>Create New Game</button>
            <button className="home-button" onClick={handleJoinGame}>Join Game</button>
        </div>
        </div>
    );
};

export default Home;
