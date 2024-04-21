const Deck = require('./deck');
const Player = require('./player');
const Round = require('./round');

class Table {
    constructor() {
        this.deck = new Deck();
        this.players = []; 
        this.communityCards = []; 
        this.pot = 0; 
        this.queue = []; // small blind = 1, big blind = 2, resets when a player raises
        this.smallBlindAmount = 10;
        this.listOfRounds = [];
    }

    startNewRound() {
        const round = new Round(this);
        round.start();
        this.currentRound = Round;
    }

}

module.exports = Table;
