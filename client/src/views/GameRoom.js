import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../App.css';

const GameRoom = () => {
  const { gameId, userId } = useParams();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUsername(response.data.username);
        setError('');
      } catch (error) {
        console.error('Failed to fetch user', error);
        setError('Failed to fetch user details');
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  return (
    <div>
      <h1>Game ID: {gameId}</h1>
      {loading ? (
        <p>Loading host details...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <h1>Host: {username || 'No username found'}</h1>
      )}
    </div>
  );
};

export default GameRoom;
