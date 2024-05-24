// const Player = require('./player');
const io = require('socket.io-client');

//method connect to game, disconnect from game- take in gameId
//in addAi players(game-model) call join/leave function

//create dumb makemove function and rewrite it in ai1

class Ai {
    constructor(userId, socketId, username, chips, isAi, aiId) {
        this.username = username;
        this.userId = this.generateRandomUserId;
        this.socketId = socketId;
        this.chips = chips;
        this.hand = [];
        this.isPlaying = true;
        this.isInRound = true;
        this.currentBet = 0;
        this.isAi = isAi;
        this.latestMove = "";
        this.aiId = aiId;
        this.socket = io.connect('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('Successfully connected!');
        });

        this.socket.on('your-turn', (data) => {
            this.makemove(data.acceptableMoves);
        });
    }

    joinFunction(gameId) {
        this.socket.emit('join', { gameId, userId: this.userId });
    generateRandomUserId(){
        return `AI-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    joinFunction(gameId) {
        this.socket.emit('join', { gameId, userId: this.userId });
    }

    leaveFunction(gameId) {
        this.socket.emit('leave', { gameId, userId: this.userId });
    }

    getCardToHand(card) {
        this.hand.push(card);
    }

    fold() {
        super.fold();
        this.console.log('fold');
        socket.emit('player-action', {
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
        return this.Position();
        return this.Position();
    }
}

module.exports = Ai;