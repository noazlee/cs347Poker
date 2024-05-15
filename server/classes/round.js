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
        this.communityCards = [];
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
            console.log('emitting deal-cards to ', player.socketId);
            this.io.to(player.socketId).emit('deal-cards', {
                hand: player.hand.map(card => ({
                    suite: card.suite,
                    value: card.value
                }))
            });
        });

        this.pot = 0;
        this.players.forEach(player=>{
            console.info(player);
        })
        this.setBettingOrder();
        this.promptPlayerAction();
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
        console.info("Starting player:",this.startingPlayer, this.players[this.startingPlayer].userId);
        console.info("Current player:",this.currentPlayer, this.players[this.startingPlayer].userId);
    }

    endRound() {
        const winner = this.determineWinner();
        this.io.to(this.game.gameId).emit('round-ended', { winner: winner.userId });
        // this.game.startNewRound(); 
    }

    // go loop through each player
    // take a list of 7 cards from the com cards and their cards
    // check if their hand matches 10 ranks of poker hands
    // use the rank to create a list of the 5 best cards for the hand
    // store the 'strength' value and the cards in an array
    determineWinner(){
        //const comCards = this.communityCards;
        let winner = null;
        let bestHandStrength = 0;
        
        this.players.forEach(player => {
            if (player.isInRound) {
                const playerCards = [];
                for (let i = 0; i < player.hand.length; i++) {
                    playerCards.push(player.hand[i]);
                }
                for (let i = 0; i < this.communityCards.length; i++) {
                    playerCards.push(this.communityCards[i]);
                }

                const playerHand = evaluateHand(playerCards); // Function to evaluate the player's hand
                
                if (!winner || playerHand.rank > bestHandStrength) {
                    bestHandStrength = playerHand.rank;
                    winner = player;
                }
            }            
        });
        return winner
    }
  
}

module.exports = Round;