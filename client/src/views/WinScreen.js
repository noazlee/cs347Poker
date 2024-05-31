// Screen that shows when the game ends.
// Contributors: Ashok Khare

import React, {useState, useEffect} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import { buildImgUrl } from '../utils/utils';
import '../App.css';

export default function WinScreen() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const winData = location.state.winData;
    const playerIsWinner = () => {
        let isWinner = false;
        winData.forEach((winner) => {
            if (winner.userId === userId) { isWinner = true }
        });
        return isWinner;
    }
    const [backgroundPosition, setBackgroundPosition] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundPosition(prevPosition => (prevPosition + 1) % 75); // This will move the background
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

    return (
        <div style={backgroundStyle}>
            <div className='home-container'>
                {winData !== undefined ? (
                    <div>
                        <h1>Game Ended</h1>
                        {playerIsWinner() === true ? (
                            <h1>You Win!</h1>
                        ) : (
                            <h1>You Lose...</h1>
                        )}
                        {winData.length > 0 && (
                            <div>
                                <h2>Winners:</h2>
                                {winData.map((winner) => {
                                    return <p>{winner.username}</p>
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <h1>No Game Data Found</h1>
                )}
                <button className='home-button' onClick={() => navigate(`/home/${userId}`)}>Return to Home</button>
            </div>
        </div>
    );
}