// Register page that users will see if they dont have an account.
// Contributors: Noah Lee

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import '../App.css';
import { buildImgUrl } from '../utils/utils';

const backgroundStyle = {
    backgroundImage:  `url(${buildImgUrl('poker-bg.jpg')})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    height: '100vh', // Make sure the container fills the screen
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/create-user', { username, password });
            const userId = response.data.userId;
            navigate(`/home/${userId}`);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div style={backgroundStyle}>
        <div className="container">
            
            <div className="form-box">
            <div className="title">Pocket ACES</div>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button type="submit">Register</button>
                </form>
                <p>
                    Already have an account? <Link to="/">Login here</Link>
                </p>
                {error && <div className="error-box">{error}</div>}
            </div>
        </div>
        </div>
    );
};

export default Register;
