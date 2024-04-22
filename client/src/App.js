import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './views/Register';
import Login from './views/Login';
import Home from './views/Home';
import Table from './views/Table';
import GameRoom from './views/GameRoom';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register/>} />
                <Route path="/" element={<Login/>} />
                <Route path="/home/:userId" element={<Home/>} />
                <Route path="/table" element={<Table/>} />
                <Route path="/game/:gameId" element={<GameRoom/>} />
                {/* put all routes here */}
            </Routes>
        </Router>
    );
};

export default App;
