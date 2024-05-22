const Player = require('./player');
const io = require('socket.io-client');

//method connect to game, disconnect from game- take in gameId
//in addAi players(game-model) call join/leave function

//create dumb makemove function and rewrite it in ai1

class Ai extends Player {
    constructor(userId, socketId, username, chips, isAi, aiId) {
        super(userId, socketId, username, chips, isAi);
        this.aiId = aiId;
        this.socket = io.connect('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('Successfully connected!');
        })

        this.socket.on('update-player', (messge) => { });

        this.socket.on('your-turn', (data) => {
                
            // Do something with data.acceptableMoves
            this.makemove();
        });

        this.socket.on('shown-cards', (data) => {
            // Save data.cards to a variable
        });

        this,socket.on('update-round-data', (data) => {
            // Save data.round to a variable
        });
    }
    joinFunction(){
        this.socket.join(gameId)
    }

    leaveFunction(){
        this.socket.leave(gameId)
    }

    getCardToHand(card) {
        super.getCardToHand(card);
    }

    // props.toggleCurrentPlayer(false);

    fold() {
        super.fold();
        this.console.log('fold');
        socket.emit('player-action', {
            userId: this.userId,
            action: 'fold',
            amount: 0
        });
    }

    call(amount) {
        super.call(amount);
        this.console.log('call');
        socket.emit('player-action', {
            userId: this.userId,
            action: 'call',
            amount: amount
        });
    }

    raise(amount) {
        super.raise(amount);
        this.console.log('raise');
        socket.emit('player-action', {
            userId: this.userId,
            action: 'raise',
            amount: amount
        });
    }

    allIn() {
        super.allIn();
        this.console.log('all in');
        socket.emit('player-action', {
            userId: this.userId,
            action: 'allIn',
            amount: this.getChips()
        });
    }

    check() {
        super.check();
        this.console.log('check');
        socket.emit('player-action', {
            userId: this.userId,
            action: 'check',
            amount: 0
        });
    }

    resetForNewRound() {
        super.resetForNewRound();
    }

    leaveGame() {
        super.leaveGame();
    }

    getChips() {
        return super.getChips();
    }

    getPosition() {
        return super.getPosition();
    }
}

module.exports = Ai;