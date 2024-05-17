const Player = require('../classes/player');
const socket = require('../socket');

class Ai extends Player {
    constructor(userId, socketId, username, chips, isAi, aiId) {
        super(userId, socketId, username, chips, isAi);
        this.aiId = aiId;
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