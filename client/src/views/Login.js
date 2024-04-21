import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import '../App.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); //clears previous errors
        try {
            const response = await axios.post('/api/login', { username, password });
            const userId = response.data.userId;
            navigate(`/home/${userId}`);
        } catch (error) {
            console.error(error.response.data.message); 
            setError(error.response.data.message);
        }
    };

    return (
        <div className="container">
            
            <div className="form-box">
            <h2>Login</h2>
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Login</button>
                </form>
                <p>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
                {error && <div className="error-box">{error}</div>}
            </div>
            
        </div>
    );
};

export default Login;
