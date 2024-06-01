// Contributors: Noah Lee and Ashok Khare - GameRoom where players wait for a game to start.

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import socket from '../socket';
import { buildImgUrl } from '../utils/utils';
import GameSettings from '../components/GameSettings';

const GameRoom = () => {
    const location = useLocation();
    const { gameId, userId } = useParams();
    const [hostId, setHostId] = useState(location.state.hostId);
    const [username, setUsername] = useState('');
    const [hostname, setHostname] = useState('');
    const [players, setPlayers] = useState([]);
    const [maxPlayers, setMaxPlayers] = useState(8);
    const [blindAmount, setBlindAmount] = useState(400);
    const [startingChips, setStartingChips] = useState(10000);
    const [numAiPlayers, setNumAiPlayers] = useState(0);
    const navigate = useNavigate();

    const [backgroundPosition, setBackgroundPosition] = useState(0);

    // const subtractAi = (playerId) => {
    //     socket.emit('remove-ai', {gameId: gameId, playerId});
    //     setNumAiPlayers(numAiPlayers - 1);
    // }

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundPosition(prevPosition => (prevPosition + 1) % 100); // This will move the background
        }, 100);
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
        const fetchHost = async () => {
            try {
                const response = await axios.get(`/api/users/${hostId}`);
                setHostname(response.data.username);
            } catch (e) {
                console.error('Failed to fetch hostname', e);
            }
        };
        fetchHost();
    }, [hostId]);

    useEffect(() => {
        // Setup socket listeners
        socket.emit('join-game', { playerId: userId, gameId, username});  // Join the game room on component mount

        // Sent from game-sockets.js file. Sent when new player joins the game room (specifically, when new socket connection is made).
        socket.on('update-players', (data) => {
            console.log("updated players");
            setPlayers(data.players);
        });
        return () => {
            socket.off('update-players');

        };
    }, [gameId, userId,username, navigate]);

    const startGame = () => {
        console.info(socket.id, " starting game...");
        socket.emit('start-game', {
            gameId,
            username,
            settings: {
                maxPlayers,
                blindAmount,
                startingChips
            }
        });
    };

    const leaveGame = () => {
        console.info(userId, " leaving game...");
        socket.emit('leave-game', { gameId, playerId: userId });
        navigate(`/home/${userId}`); 
    };

    useEffect(() => {
        // Sent from game-sockets.js file. Sent when a player leaves the game room.
        socket.on('player-left', (data) => {
            console.info(`${data.playerId} left game ${data.gameId}`);
            setHostId(data.newHostId);
            setPlayers(data.players);
        });

        // Sent from game-sockets.js file. Sent when the host starts the game.
        socket.on('game-started', (data) => {
            console.info('game started', data, socket.id);
            navigate(`/table/${data.gameId}/${userId}`, {state: {gameId: data.gameId, players: data.players, hostId: hostId}});
        });
    
        return () => {
            socket.off('game-started');
            socket.off('player-left');
        };
    }, [gameId, userId, hostId, navigate]);

    return (
        <div style={backgroundStyle}>
        <div className='menu'>
        <div className="home-container-2">
            <h1>Game ID: {gameId}</h1>
            <h1>Host: {hostname || 'Loading...'}</h1>
            <h3>Players in the room:</h3>
            <ul>
                {players.map((player, index) => {
                    return (
                        <div>
                            <li key={index}>{player.username}</li>
                            {/* {(userId === hostId && player.isAi) && (
                                <button id='subtractAi' onClick={() => subtractAi(player.userId)}>Remove AI</button>
                            )} */}
                        </div>
                    );
                })}
            </ul>
            {userId === hostId && <GameSettings props={{
                gameId,
                players,
                maxPlayers,
                setMaxPlayers,
                blindAmount,
                setBlindAmount,
                startingChips,
                setStartingChips,
                numAiPlayers, setNumAiPlayers
            }}/>}
            {userId === hostId ? (
                <button className="home-button" onClick={players.length === maxPlayers ? startGame : () => alert("Too few or too many players in the lobby to start the game.")}>Start Game</button>
            ) : (
                <p>Waiting for host to start game...</p>
            )}
            <button className="home-button" onClick={leaveGame}>Leave Game</button>
        </div>
        </div>
        </div>
    );
};

export default GameRoom;
