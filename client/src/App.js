import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './views/Register';
import Login from './views/Login';
import Home from './views/Home';
import Table from './views/Table';
import GameRoom from './views/GameRoom';
import JoinRoom from './views/JoinRoom';
import GameHistory from './views/GameHistory';
import LeaderBoard from './views/LeaderBoard';
import WinScreen from './views/WinScreen';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register/>} />
                <Route path="/" element={<Login/>} />
                <Route path="/home/:userId" element={<Home/>} />
                <Route path="/game/:gameId/:userId" element={<GameRoom/>} />
                <Route path="/table" element={<Table/>} />
                <Route path="/table/:gameId/:userId" element={<Table/>} />
                <Route path="/game/:gameId" element={<GameRoom/>} />
                <Route path="/join/:userId" element={<JoinRoom/>} />
                <Route path="/leaderboard/:userId" element={<LeaderBoard/>} />
                <Route path="/game-history/:userId" element={<GameHistory/>} />
                <Route path="/win-screen/:userId" element={<WinScreen/>} />
                {/* put all routes here */}
            </Routes>
        </Router>
    );
};

export default App;
