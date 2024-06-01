// Created by Sho Tanaka - Leaderboard page for players with most wins and chips
// Contributors: Carlos Flores, Sho Tanaka

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import '../App.css';
import { buildImgUrl } from '../utils/utils';

const LeaderBoard = () => {
    const { userId } = useParams();
    const [users, setUsers] = useState([]);
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
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        position: 'relative',
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users'); // Adjust endpoint as necessary
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };
        fetchUsers();
    }, []);

    // Sort users by gamesWon in descending order
    const sortedUsers = [...users].sort((a, b) => b.gamesWon - a.gamesWon).slice(0,10);

    return (
        <div style={backgroundStyle}>
            <div className="navigation-tab">
                <button onClick={() => navigate(`/home/${userId}`)}>Go Home</button>
            </div>
            <div className="home-container">
                <h1>All Time Leaderboard</h1>
                {sortedUsers.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Games Won</th>
                                <th>Total Chips</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>{user.gamesWon}</td>
                                    <td>{user.totalChips}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No information found for any players</p>
                )}
            </div>
        </div>
    );
};

export default LeaderBoard;