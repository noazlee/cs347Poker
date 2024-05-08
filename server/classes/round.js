const Deck = require('./deck');

// round.js
class Round {
    constructor(io, gameId, players, smallBlindAmount) {
        this.io = io;
        this.gameId = gameId;
        this.players = players;  
        this.deck = new Deck();
        this.smallBlindAmount = smallBlindAmount;
        this.currentBet = this.smallBlindAmount * 2;
        this.pot = 0;
        this.hands = [];
        this.stage = 0; 
        this.startingPlayer = 0;
        this.currentPlayer = 0;
        this.currentSmallBlind = 0;  // Index of the small blind in the players array
    }

    start() {
        this.players.forEach(player => {
            if (player.isPlaying) {
                player.resetForNewRound();
            }
        });

        this.deck.shuffle();
        this.players.filter(player => player.isInRound).forEach(player => {
            player.addCardToHand(this.deck.dealOneCard());
            player.addCardToHand(this.deck.dealOneCard());
        });

        this.pot = 0;
        this.setBettingOrder();
        this.promptPlayerAction();
    }

    dealFlop(){
        let card1 = this.deck.dealOneCard();
        let card2 = this.deck.dealOneCard();
        let card3 = this.deck.dealOneCard();
        let cardsL = [card1,card2,card3]
        this.io.to(this.gameId).emit('shown-cards',{
            type: "Flop",
            cards: cardsL
        })
        this.startBettingRound();
    }

    dealTurn(){
        const card = this.deck.dealOneCard();
        this.io.to(this.gameId).emit('shown-cards',{
            type: "Turn",
            cards: [card]
        })
        this.startBettingRound();
    }

    dealRiver(){
        const card = this.deck.dealOneCard();
        this.io.to(this.gameId).emit('shown-cards',{
            type: "River",
            cards: [card]
        })
        this.startBettingRound();
    }

    promptPlayerAction() {
        if (this.currentPlayer >= this.players.length) {
            this.currentPlayer = 0;  // Wrap-around
        }

        const player = this.players[this.currentPlayer];
        if (player.isInRound) {
            this.io.to(player.socketId).emit('your-turn', {
                acceptableMoves: ['Check', 'Raise', 'Fold', 'Call']
            });
        } else {
            this.advanceToNextPlayer();  // Skip if the player is not active
        }
    }

    handlePlayerAction(socket, data) {
        // Process the action data received
        console.log(`Action received from ${socket.id}: ${data.action}`);

        // Verify it's the correct player's turn
        const player = this.players[this.currentPlayer];
        if (socket.id !== player.socketId) {
            return;  // It's not this player's turn
        }
        
        // Example processing
        switch (data.action) {
            case 'Check':
                // Do nothing, just log it
                break;
            case 'Raise':
                // Update pot and player's bet
                break;
            case 'Fold':
                // Mark player as folded
                player.isInRound = false;
                break;
            default:
                // Unhandled action
                break;
        }

        // Move to the next player or advance the game state
        this.advanceToNextPlayer();
    }

    // Moves to the next player
    advanceToNextPlayer() {
        do {
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        } while (!this.players[this.currentPlayer].isInRound);

        if (this.allPlayersActed()) {
            this.advanceStage();
        } else {
            this.promptPlayerAction();
        }
    }

    // Checks if all players have acted
    allPlayersActed() {
        return this.players.filter(p => p.isInRound).every(p => p.hasActed);
    }

    advanceStage() {
        // Logic to move to the next stage of the game (flop, turn, river)
        this.stage++;
        switch (this.stage) {
            case 1:
                this.dealFlop();
                break;
            case 2:
                this.dealTurn();
                break;
            case 3:
                this.dealRiver();
                break;
            case 4:
                this.endRound();
                break;
            default:
                console.error('Unexpected game stage');
                break;
        }
    }

    setBettingOrder(){
        if (this.stage==0) { //if first stage
            this.startingPlayer = (this.currentSmallBlind + 2) % this.players.length; 
            this.currentPlayer = this.startingPlayer;
        } else {
            this.startingPlayer = (this.currentSmallBlind + 1) % this.players.length;  
            this.currentPlayer = this.startingPlayer;
        }
    }

    endRound() {
        const winner = this.determineWinner();
        this.io.to(this.game.gameId).emit('round-ended', { winner: winner.userId });
        // this.game.startNewRound(); 
    }
    

}

module.exports = Round;