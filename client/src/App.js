import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './views/Register';
import Login from './views/Login';
import Home from './views/Home';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/home/:userId" element={<Home/>} />
                {/* more routes here */}
            </Routes>
        </Router>
    );
};

export default App;
