// Created by Noah Lee - GameHistory page which takes data from the games DB for a specific user and puts it on a table.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import '../App.css';
import { buildImgUrl } from '../utils/utils';

const GameHistory = () => {
    const { userId } = useParams();
    const [username, setUsername] = useState('');
    const [games, setGames] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [rounds, setRounds] = useState([]);
    const navigate = useNavigate();

    const [backgroundPosition, setBackgroundPosition] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundPosition(prevPosition => (prevPosition + 1) % 75);
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
        // display: 'flex',
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
        // Fetch the list of games for the dropdown
        const fetchGames = async () => {
            try {
                const response = await axios.get(`/api/games/${userId}`);
                setGames(response.data);
            } catch (error) {
                console.error('Failed to fetch games', error);
            }
        };
        fetchGames();
    }, [userId, selectedGameId]);

    useEffect(() => {
        // Fetch details for the selected game
        if (selectedGameId) {
            const fetchGameDetails = async () => {
                try {
                    console.log('Looking at rounds for', selectedGameId);
                    const response = await axios.get(`/api/games/${userId}/${selectedGameId}`);
                    console.log(response.data.rounds);
                    setRounds(response.data.rounds);
                } catch (error) {
                    console.error('Failed to fetch game details 2', error);
                }
            };
            fetchGameDetails();
        }
    }, [selectedGameId, userId]);

    return (
        <div style={backgroundStyle}>
            <div className="navigation-tab">
                <button onClick={() => navigate(`/home/${userId}`)}>Go Home</button>
            </div>
            <div className="home-container">
                <h1>Game History for {username || 'Loading...'}</h1>
                <select value={selectedGameId} onChange={e => setSelectedGameId(e.target.value)}>
                    {games.map(game => (
                        <option key={game.gameId} value={game.gameId}>
                            {game.gameId} - {new Date(game.date).toLocaleDateString()}
                        </option>
                    ))}
                </select>
                {rounds.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Round Index</th>
                                <th>Community Cards</th>
                                <th>Pot Amount</th>
                                <th>Winner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rounds.map((round, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>
                                        <ul>
                                            {round.communityCards && round.communityCards.map((card, index) => (
                                                <li key={index}>
                                                    {card.value} of {card.suite}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{round.pot}</td>
                                    <td>
                                        <ul>
                                            {round.winners && round.winners.map((player, index) => (
                                                <li key={index}>
                                                    {player.username}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No round details found.</p>
                )}
            </div>
        </div>
    );
};

export default GameHistory;
