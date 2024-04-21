/*
THIS FILE WAS CREATED BY NOAH AND ITS PURPOSE IS TO CREATE A GAME CLASS THAT CAN BE USED IN ROUTES LIKE GAME-LOGIC 
WHERE TEMPORARY GAME DATA CAN EXIST BEFORE BEING UPLOADED TO THE DB AFTER COMPLETION.
*/

const Player = require('./player');

const MAXNUMPLAYERS = 2;
const POTAMOUNT = 10000;
const SMALLBLINDAMOUNT = 100; 
const GAMEMODE = 'default'; 

class Game {
    constructor(hostId, maxNumPlayers, potAmount) {
        this.gameId = Math.random().toString(36).substring(2, 15);
        this.players = [new Player(hostId, 0, false)];
        this.maxPlayers = MAXNUMPLAYERS;
        this.hostId = hostId;
        this.potAmount = POTAMOUNT;
        this.gameMode = GAMEMODE;
        this.smallBlindAmount = SMALLBLINDAMOUNT;
        this.rounds = [];
        this.status = 'waiting';

        this.initializeAIPlayers();
    }

    initializeAIPlayers(){
        while(this.players.length<this.maxPlayers){
            this.players.push(new Player(`AI-${Math.random().toString(36).substring(2, 9)}`, 0, true));
        }
    }

    addPlayer(playerId) {
        const aiIndex = this.players.findIndex(player => player.isAI);
        if (aiIndex !== -1) {
            this.players[aiIndex] = { playerId: playerId, isAI: false };
        } else {
            // Only add a new player if there's still room
            if (this.players.length < this.maxPlayers) {
                this.players.push({ playerId: playerId, isAI: false });
            }
        }
    }

    removePlayer(playerId){
        this.players = this.players.filter(player => player.playerId !== playerId);
        // Fill the rest of the game with AI players
        if (this.players.length < this.maxPlayers) {
            this.initializeAIPlayers();
        }

    }
}

module.exports = Game;