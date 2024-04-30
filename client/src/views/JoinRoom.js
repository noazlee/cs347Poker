    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import '../App.css';
    import { socket } from '../socket';

    const JoinRoom = () => {
        const { userId } = useParams();
        const navigate = useNavigate();
        const [gameId, setGameId] = useState('');
        const [players, setPlayers] = useState([]);

        useEffect(() => {
            socket.on('player-joined', (data) => {
                setPlayers(data.player_names);
                if (data.playerId === userId) {
                    navigate(`/game/${gameId}`); 
                }
            });

            return () => {
                socket.off('player-joined');
            };
        }, [userId, gameId, navigate]);

        const handleJoin = (e) => {
            e.preventDefault();
            if (gameId) {
                socket.emit('join-game', { playerId: userId, gameId });
            } else {
                alert('Please enter a valid game ID.');
            }
        };

        return (
            <div className="home-container">
                <form onSubmit={handleJoin}>
                    <input
                        type="text"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        placeholder="Enter Game ID"
                    />
                    <button type="submit">Join Room</button>
                </form>
                {players.length > 0 && (
                    <div>
                        <h3>Players in the room:</h3>
                        <ul>
                            {players.map((player, index) => (
                                <li key={index}>{player}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    export default JoinRoom;
