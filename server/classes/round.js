const Deck = require('./deck');

// round.js
class Round {
    constructor(io, gameId, prevIndex, players, smallBlindAmount) {
        this.io = io;
        this.gameId = gameId;
        this.index = prevIndex+1;
        this.players = players;  
        this.deck = new Deck();
        this.smallBlindAmount = smallBlindAmount;
        this.currentBet = this.smallBlindAmount * 2;
        this.pot = 0;
        this.communityCards = [];
        this.hands = [];
        this.stage = 0; 
        this.startingPlayer = 0;
        this.currentPlayer = 0;
        this.currentSmallBlind = 0;  // Index of the small blind in the players array
        this.playerResponses = new Map(); 
    }

    async start(io) {
        console.log("Starting Round");
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
        console.log('emitting update-round');
        this.io.to(this.gameId).emit('update-round-data', {
            round: {
                gameId: this.gameId,
                index: this.index,
                players: this.players,
                deck: this.deck,
                smallBlindAmount: this.smallBlindAmount,
                currentBet: this.currentBet,
                pot: this.pot,
                communityCards: this.communityCards,
                hands: this.hands,
                stage: this.stage,
                startingPlayer: this.startingPlayer,
                currentPlayer: this.currentPlayer,
                currentSmallBlind: this.currentSmallBlind,
                playerResponses: this.playerResponses
            }
        });

        this.pot = 0;
        this.players.forEach(player=>{
            // console.info(player);
        })
        await this.setBettingOrder();
        console.log('Prompting player action');
        await this.promptPlayerAction();
    }

    dealFlop(){
        let card1 = this.deck.dealOneCard();
        let card2 = this.deck.dealOneCard();
        let card3 = this.deck.dealOneCard();
        this.communityCards.push(card1);
        this.communityCards.push(card2);
        this.communityCards.push(card3);
        this.io.to(this.gameId).emit('shown-cards',{
            type: "Flop",
            cards: this.communityCards
        })
        this.startBettingRound();
    }

    dealTurn(){
        const card = this.deck.dealOneCard();
        this.communityCards.push(card);
        this.io.to(this.gameId).emit('shown-cards',{
            type: "Turn",
            cards: this.communityCards
        })
        this.startBettingRound();
    }

    dealRiver(){
        const card = this.deck.dealOneCard();
        this.communityCards.push(card);
        this.io.to(this.gameId).emit('shown-cards',{
            type: "River",
            cards: this.communityCards
        })
        this.startBettingRound();
    }

    async promptPlayerAction() {
        if (this.currentPlayer >= this.players.length) {
            this.currentPlayer = 0;  // Wrap-around
        }

        const player = this.players[this.currentPlayer];
        console.log(player.userId, "turn"); 
        if (player.isInRound) {
            this.io.to(player.socketId).emit('your-turn', {
                acceptableMoves: ['Check', 'Raise', 'Fold', 'Call']
            });
            return new Promise((resolve) => {
                this.playerResponses.set(player.socketId, resolve);
            });
        } else {
            await this.advanceToNextPlayer();  // Skip if the player is not active
        }
    }

    handlePlayerAction(socket, data) {
        const resolve = this.playerResponses.get(socket.id);
        if (resolve) {
            resolve();
            this.playerResponses.delete(socket.id);
            this.processPlayerAction(socket, data);
        }
    }

    processPlayerAction(socket, data) {
        // Process the action
        console.log(`Action received from ${socket.id}: ${data.action}`);
        const player = this.players[this.currentPlayer];
        switch (data.action) {
            case 'Check':
                // Handle check
                break;
            case 'Raise':
                // Handle raise
                break;
            case 'Fold':
                player.isInRound = false;
                break;
            default:
                break;
        }
    }

    // Moves to the next player
    async advanceToNextPlayer() {
        do {
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        } while (!this.players[this.currentPlayer].isInRound);

        if (this.allPlayersActed()) {
            this.advanceStage();
        } else {
            await this.promptPlayerAction();
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
        console.info("Starting player:",this.startingPlayer, this.players[this.startingPlayer].userId);
        console.info("Current player:",this.currentPlayer, this.players[this.startingPlayer].userId);
    }

    endRound() {
        const winner = this.determineWinner();
        this.io.to(this.game.gameId).emit('round-ended', { winner: winner.userId });
        // this.game.startNewRound(); 
    }
    

}

module.exports = Round;