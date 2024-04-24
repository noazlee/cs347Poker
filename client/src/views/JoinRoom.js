import React, { useState } from 'react';
import '../App.css';

const Home = () => {
    const [gameId, setGameId] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Joining game:", gameId);
    };

    return (
        <div className="home-container">
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="Username"
                />
                <button type="submit">Join Room</button>
            </form>
        </div>
    );
};

export default Home;
