const Player = require('./player');
// const io = require('socket.io-client');

//method connect to game, disconnect from game- take in gameId
//in addAi players(game-model) call join/leave function

//create dumb makemove function and rewrite it in ai1

//round.js players = this.players error


//round.js ggeck if player is makemove() then call make move()

class Ai extends Player {
    static aiCounter = 0;

    constructor(socketId, chips, aiId) {
        const userId = Ai.generateRandomUserId();
        const username = `AI-${++Ai.aiCounter}`;
        super(userId, socketId, username, chips, true); // Calling the parent class constructor
        this.aiId = aiId;
    }

    static generateRandomUserId() {
        return `AI-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    joinFunction(gameId) {
        this.socket.emit('join', { gameId, userId: this.userId });
    }

    leaveFunction(gameId) {
        this.socket.emit('leave', { gameId, userId: this.userId });
    }

    makeMove(acceptableMoves) {
        // Logic for AI decision making
        // Should return an object like { action: 'raise', value: 1000 } or { action: 'call' }
        const decision = someAiLogic(acceptableMoves);
        return decision;
    }
}

module.exports = Ai;