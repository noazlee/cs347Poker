const Round = require('./round');
const Player = require('./player');
const Ai1 = require('./AI/ai1');
const { connectDb } = require('../db');


const MAXNUMPLAYERS = 2;
const POTAMOUNT = 10000;
const GAMEMODE = "Texas Hold 'Em";
const SMALLBLINDAMOUNT = 200;

const format24Hour = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); 
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    const SS = String(date.getSeconds()).padStart(2, '0');

    const newDate = `${mm}/${dd}/${yyyy} ${HH}:${MM}:${SS}`;
    return newDate;
};

class Game {
    constructor(ioInstance, hostId, username, hostSocketId) {

        const curDate = new Date();

        this.io = ioInstance;
        this.date = format24Hour(curDate);
        this.gameId = Math.random().toString(36).substring(2, 8);
        this.players = [];
        this.maxPlayers = MAXNUMPLAYERS;
        this.hostId = hostId;
        this.hostSocketId = hostSocketId;
        this.startingChips = POTAMOUNT;
        this.gameMode = GAMEMODE;
        this.smallBlindAmount = SMALLBLINDAMOUNT;
        this.rounds = [];
        this.status = 'waiting';
        

        this.addPlayer(hostId, hostSocketId, username, false);
        // this.addAiPlayers(hostId, hostSocketId, username, true);
    }

    addPlayer(userId, socketId, username, isAI){
        if (this.players.some(p => p.userId === userId)) {
            console.log("Player already exists:", userId);
            return false; 
        }

        let newPlayer;
        if (!isAI) {
            newPlayer = new Player(userId, socketId, username, this.startingChips, isAI);
        } else {
            // newPlayer = new AI
            // Call method to add AI socket to gameId
        }
        this.players.push(newPlayer);
    }

    removePlayer(playerId) {
        let playerIndex = undefined;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].userId === playerId) {
                playerIndex = i;
            }
        }
        
        if (playerIndex === undefined) {
            console.error(`Tried to remove player ${playerId}, but could not find it in game`);
        } else {
            this.players.splice(playerIndex, 1);
            if (this.hostId === playerId) {
                let newHostIndex = 0;
                while ((newHostIndex < this.players.length) && (this.players[newHostIndex].isAi === true)) {
                    newHostIndex++;
                }

                if (newHostIndex === this.players.length) { // No more human players left to host
                    this.players = []; // This will cause the game to be deleted
                } else {
                    this.hostId = this.players[newHostIndex].userId;
                }
            }
        }
    }

    removePlayerMidGame(playerId) {
        let playerIndex = undefined;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].userId === playerId) {
                playerIndex = i;
            }
        }

        if (playerIndex === undefined) {
            console.error(`Tried to remove player ${playerId}, but could not find it in game`);
        } else {
            const playerLeft = (this.players.splice(playerIndex, 1))[0];
            if (this.hostId === playerId) {
                let newHostIndex = 0;
                while ((newHostIndex < this.players.length) && (this.players[newHostIndex].isAi === true)) {
                    newHostIndex++;
                }

                if (newHostIndex === this.players.length) { // No more human players left to host
                    this.players = []; // This will cause the game to be deleted
                } else {
                    this.hostId = this.players[newHostIndex].userId;
                    this.currentRound.updateHost(this.hostId);
                }
            }

            if (this.players.length !== 0) { // if at least 1 human player remaining
                playerLeft.leaveGame()
                playerLeft.latestMove = "Left game";
                if (this.players.length === 1) { // if only 1 human player remaining (and no AIs)
                    this.currentRound.endRound();
                } else {
                    if (this.currentRound.currentPlayer === playerIndex) { // if the current player leaves, move to the next player
                        this.currentRound.advanceToNextPlayer();
                        this.currentRound.updatePlayer();
                    }
                }
            }
        }
    }

    addAiPlayer(userId, socketId, username, isAI){
        if (this.players.some(p => p.userId === userId)) {
            console.log("Player already exists:", userId);
            return false; 
        }
        let newPlayer = new Ai1(userId, socketId, username, POTAMOUNT,isAI);
        this.players.push(newPlayer);
    }

    removeAiPlayer(playerId) {
        let playerIndex = undefined;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].userId === playerId) {
                playerIndex = i;
            }
        }
        
        if (playerIndex === undefined) {
            console.error(`tried to remove player ${playerId}, but could not find it in game`);
        } else {
            this.players.splice(playerIndex, 1);
            if (this.hostId === playerId) {
                this.hostId = this.players[0].userId;
            }
        }
    }

    startGame() {
        if (this.players.length < 2) { 
            console.log("Not enough players to start the game.");
            return;
        }
        this.status = 'active';

        this.io.to(this.gameId).emit('game-started', {
            gameId: this.gameId,
            players: this.players.map(player => ({
                username: player.username,
                userId: player.userId,
                chips: player.chips
            })),
        });
        
        this.currentRound = new Round(this.io, this.gameId, 0, this.players, this.smallBlindAmount);
        this.rounds.push(this.currentRound);
        this.currentRound.start();
    }

    startNewRound(prevIndex){
        this.currentRound = new Round(this.io, this.gameId, prevIndex, this.players, this.smallBlindAmount);
        this.rounds.push(this.currentRound);
        this.currentRound.start();
    }

    async updatePlayerChips(){ 
        const db = await connectDb();
        const users = db.collection('users');

        for (const player of this.players) {
            try{
                const user = await users.findOne({ userId: player.userId });
            
                if (user) {
                    const currentChips = parseInt(user.totalChips);
                    console.log(user);
                    console.log(player.chips);
                    const updatedChips = currentChips + player.chips;

                    await users.updateOne(
                        { userId: player.userId },
                        {
                            $set: { totalChips: updatedChips },
                            $currentDate: { lastUpdated: true }
                        }
                    );

                    console.log(`Updated chips for player ${player.userId}: ${updatedChips}`);
                } else {
                    console.log(`User not found for player ${player.userId}`);
                }
            }catch (error) {
                console.error(`Failed to update chips for player ${player.userId}:`, error);
            }
        };
    }

}

module.exports = Game;

