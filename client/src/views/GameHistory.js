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
        // Fetch the list of games for the dropdown
        const fetchGames = async () => {
            try {
                const response = await axios.get(`/api/games/${userId}`);
                setGames(response.data.games);
                if (response.data.games.length > 0) {
                    setSelectedGameId(response.data.games[0].gameId);
                }
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
                    const response = await axios.get(`/api/games/${userId}/${selectedGameId}`);
                    setRounds(response.data.rounds);
                } catch (error) {
                    console.error('Failed to fetch game details', error);
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
                            <th>Hands</th>
                            <th>Pot Amount</th>
                            <th>Winner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rounds.map((round, index) => (
                            <tr key={index}>
                                <td>{round.index}</td>
                                <td>{round.hands.join(', ')}</td>
                                <td>{round.pot}</td>
                                <td>{round.winner}</td>
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
