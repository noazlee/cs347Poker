/*
THIS FILE WAS CREATED BY NOAH AND ITS PURPOSE IS TO CREATE A GAME CLASS THAT CAN BE USED IN ROUTES LIKE GAME-LOGIC 
WHERE TEMPORARY GAME DATA CAN EXIST BEFORE BEING UPLOADED TO THE DB AFTER COMPLETION.
*/

const MAXNUMPLAYERS = 2;
const POTAMOUNT = 10000;
const BIGBLINDAMOUNT = 200; 

class Game {
    constructor(hostId, maxNumPlayers, potAmount) {
        this.gameId = Math.random().toString(36).substring(2, 15);
        this.players = [{playerId:hostId,isAI:false}];
        this.maxPlayers = MAXNUMPLAYERS;
        this.hostId = hostId;
        this.potAmount = POTAMOUNT;
        this.gameMode = 'default';
        this.bigBlindAmount = BIGBLINDAMOUNT;
        this.rounds = [];
        this.status = 'waiting';

        this.initializeAIPlayers();
    }

    initializeAIPlayers(){
        while(this.players.length<this.maxPlayers){
            this.players.push({playerId:`AI-${Math.random().toString(36).substring(2, 9)}`,isAI:true});
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