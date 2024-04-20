import React from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';

const Home = () => {
    const { userId } = useParams();
    
    return (
        <div className="container">
            <h1>Welcome, {userId}</h1>
        </div>
    );
};

export default Home;
