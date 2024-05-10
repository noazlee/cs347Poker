/*
THIS FILE WAS CREATED BY NOAH AND ITS PURPOSE IS TO HANDLE THE LOGIC OF GAME CREATION, 
PLAYERS JOINING, ETC. UP IN THE LOBBY UNTIL THE GAME STARTS.
*/
//gamelogic.js
const router = require('express').Router();
const Game = require('../classes/game-model');
const games = {}; //stores all games

module.exports = () => {
    router.get('/game/history/:userId', async (req, res) => {
        const userId = req.params.userId;
        try {
            const games = await db.collection('games').find({ userId: userId }).toArray();
            res.status(200).json({ games });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching game history' });
        }
    });

    router.get('/game/history/:userId/:gameId', async (req, res) => {
        const userId = req.params.userId;
        const gameId = req.params.gameId;
        try {
            const games = await db.collection('games').find({ userId: userId }).toArray();
            res.status(200).json({ games });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching game history' });
        }
    });
    
    module.exports = router;
};