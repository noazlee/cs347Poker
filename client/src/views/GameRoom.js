import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import socket from '../socket';
import { buildImgUrl } from '../utils/utils';

const GameRoom = () => {
    const { gameId, userId } = useParams();
    const [username, setUsername] = useState('');
    const [players, setPlayers] = useState([]);
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
            console.log("updated players");
            const fetchAllUsernames = async () => {
                const playerDetails = await Promise.all(data.players.map(id => 
                    axios.get(`/api/users/${id}`).then(res => ({ userId: id, username: res.data.username }))
                ));
                setPlayers(playerDetails);
            };
            fetchAllUsernames();
        });
        return () => {
            socket.off('update-players');

        };
    }, [gameId, userId, navigate]);

    const startGame = () => {
        console.info(socket.id, " starting game...");
        socket.emit('start-game', { gameId });
    };

    const leaveGame = () => {
        console.info(socket.id, " leaving game...");
        // socket.emit('leave-game', { gameId, userId }); add later
        navigate(`/home/${userId}`); 
    };

    useEffect(() => {
        socket.on('game-started', (data) => {
            console.info('game started', data, socket.id);
            navigate(`/table/${data.gameId}/${userId}`, {state: {gameId: data.gameId, players: data.players}});
        });
    
        return () => {
            socket.off('game-started');
        };
    }, [gameId, userId, navigate]);

    return (
        <div style={backgroundStyle}>
        <div className="home-container">
            <h1>Game ID: {gameId}</h1>
            <h1>Host: {username || 'Loading...'}</h1>
            <h3>Players in the room:</h3>
            <ul>
                {players.map((player, index) => (
                    <li key={index}>{player.username}</li>
                ))}
            </ul>
            <button className="home-button" onClick={startGame}>Start Game</button>
            <button className="home-button" onClick={leaveGame}>Leave Game</button>
        </div>
        </div>
    );
};

export default GameRoom;
