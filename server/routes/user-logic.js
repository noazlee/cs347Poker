const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const { connectDb } = require('../db');

// Hashing strength factor
const saltRounds = 10;

async function createUser(username, password) {
    const db = await connectDb();

    const existingUser = await db.collection('users').findOne({username:username});
    if(existingUser){
        throw new Error('Username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
        userId: Math.random().toString(36).substring(2, 15),
        username: username,
        passHash: hashedPassword,
        totalChips: 0,
        gamesPlayed: 0,
        gamesWon: 0
    };
    
    await db.collection('users').insertOne(newUser);
    return newUser;
}

router.post('/create-user', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const newUser = await createUser(username, password);
        return res.status(201).json({ message: 'User created', userId: newUser.userId });
    } catch (error) {
        if(error.message==="Username already exists."){
            return res.status(409).json({ message: 'Username already exists.', error: error.message });
        }
        console.error('Failed to create user:', error);
        return res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
});

//LOGIN LOGIC
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = await connectDb();
    try {
        const user = await db.collection('users').findOne({ username });
        if (user && await bcrypt.compare(password, user.passHash)) {
            return res.status(200).json({ message: 'Login successful', userId: user.userId });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const db = await connectDb();
        const users = await db.collection('users').find({}).toArray();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Failed to retrieve users:', error);
        return res.status(500).json({ message: 'Failed to retrieve users' });
    }
});

// Get a user's username from their id
router.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const db = await connectDb();
    const user = await db.collection('users').findOne({ userId: userId });

    if (user) {
        res.status(200).json({ username: user.username });
    } else {
        res.status(404).send('User not found');
    }
});


module.exports = router;
