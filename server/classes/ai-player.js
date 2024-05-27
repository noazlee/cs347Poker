// const Player = require('./player');
const io = require('socket.io-client');

//method connect to game, disconnect from game- take in gameId
//in addAi players(game-model) call join/leave function

//create dumb makemove function and rewrite it in ai1

//round.js players = this.players error


//round.js ggeck if player is makemove() then call make move()

class Ai {
    static aiCounter = 0;
    
    constructor(socketId, chips, aiId) {
        this.userId = this.generateRandomUserId();
        this.username = `AI-${++Ai.aiCounter}`; 
        this.userId = this.generateRandomUserId;
        this.socketId = socketId;
        this.chips = chips;
        this.hand = [];
        this.isPlaying = true;
        this.isInRound = true;
        this.currentBet = 0;
        this.isAi = true; // Always true for AI players
        this.latestMove = "";
        this.aiId = aiId;
    }

    generateRandomUserId() {
        return `AI-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    joinFunction(gameId) {
        this.socket.emit('join', { gameId, userId: this.userId });
    }

    leaveFunction(gameId) {
        this.socket.emit('leave', { gameId, userId: this.userId });
    }

    addCardToHand(card) {
        this.hand.push(card);
    }

    fold() {
        this.isInRound = false;
        console.log('fold');
        this.socket.emit('player-action', {
            userId: this.userId,
            action: 'fold',
            amount: 0
        });
    }

    raise(amount) {
        const amountToRaise = amount - this.currentBet;
        if (amountToRaise > this.chips) {
            throw new Error('Insufficient chips to raise');
        }
        this.chips -= amountToRaise;
        this.currentBet = amount;
        console.log('raise');
        this.socket.emit('player-action', {
            userId: this.userId,
            action: 'raise',
            amount: amount
        });
    }

    allIn() {
        this.currentBet += this.chips;
        this.chips = 0;
        console.log('all in');
        this.socket.emit('player-action', {
            userId: this.userId,
            action: 'allIn',
            amount: this.currentBet
        });
    }

    check() {
        console.log('check');
        this.socket.emit('player-action', {
            userId: this.userId,
            action: 'check',
            amount: 0
        });
    }

    resetForNewRound() {
        this.hand = [];
        this.currentBet = 0;
        this.isInRound = this.isPlaying;
    }

    leaveGame() {
        this.isPlaying = false;
        this.isInRound = false;
    }

    getChips() {
        return this.chips;
    }

    getPosition() {
        return this.position;
    }

    makemove(acceptableMoves) {
        // Dummy implementation, can be overridden in subclasses
        console.log('AI making a move with acceptable moves:', acceptableMoves);
    }
}

module.exports = Ai;