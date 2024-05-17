const Deck = require('./deck');
const pokerHandEvaluator = require('./poker-hand-evaluator');
const Winner = require('./winner');

// round.js
class Round {

    constructor(io, gameId, prevIndex, players, smallBlindAmount) {
        this.io = io;
        this.gameId = gameId;
        this.index = prevIndex+1;
        this.players = players;  
        this.deck = new Deck();
        this.smallBlindAmount = smallBlindAmount;
        this.highestBet = smallBlindAmount * 2;
        this.pot = 0;
        this.communityCards = [];
        this.hands = [];
        this.stage = 0; 
        this.startingPlayer = (prevIndex+1)%this.players.length;
        this.anchor = null; // used when someone raises
        this.currentPlayer = 0;
        this.currentSmallBlind = (prevIndex+1)%this.players.length;  // Index of the small blind in the players array
        this.playerResponses = new Map(); 
        this.winner = new Winner(players); // Initialize Winner object with the players array (sho)
    }

    async start() {
        this.players.forEach(player => {
            if (player.isPlaying) {
                player.resetForNewRound();
            }
        });

        console.log(this.currentSmallBlind);

        this.deck.shuffle();
        this.players.filter(player => player.isInRound).forEach(player => {
            player.addCardToHand(this.deck.dealOneCard());
            player.addCardToHand(this.deck.dealOneCard());
        });

        this.pot = 0;
        
        await this.setBettingOrder();

        this.players[this.currentSmallBlind].currentBet = this.smallBlindAmount;
        this.pot+=this.players[this.currentSmallBlind].currentBet;
        this.players[this.currentSmallBlind].chips -= this.smallBlindAmount;
        this.players[(this.currentSmallBlind+1)%this.players.length].currentBet = this.smallBlindAmount * 2; //big blind
        this.pot+= this.players[(this.currentSmallBlind+1)%this.players.length].currentBet 
        this.players[(this.currentSmallBlind+1)%this.players.length].chips -= this.smallBlindAmount * 2;

        this.players.forEach(player=>{
            console.info(player);
        })

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
        this.getRoundState();
        this.promptPlayerAction();
    }

    dealTurn(){
        const card = this.deck.dealOneCard();
        this.communityCards.push(card);
        this.io.to(this.gameId).emit('shown-cards',{
            type: "Turn",
            cards: this.communityCards
        })
        this.promptPlayerAction();
    }

    dealRiver(){
        const card = this.deck.dealOneCard();
        this.communityCards.push(card);
        this.io.to(this.gameId).emit('shown-cards',{
            type: "River",
            cards: this.communityCards
        })
        this.promptPlayerAction();
    }

    async promptPlayerAction() {
        if (this.currentPlayer >= this.players.length) {
            this.currentPlayer = 0;  // Wrap-around
        }

        const player = this.players[this.currentPlayer];
        console.log(player.userId, "turn"); 
        var acceptableMoves;
        console.log(player.currentBet);
        console.log(this.highestBet);
        if(player.currentBet<this.highestBet){
            acceptableMoves = ['Raise', 'Fold', 'Call'];
        }else{
            acceptableMoves = ['Raise', 'Fold', 'Check'];
        }

        if (player.isInRound) {
            this.io.to(player.socketId).emit('your-turn', { // Waits for signal from client and calls function game sockets.
                acceptableMoves: acceptableMoves
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
        console.log('in player action', data.action);
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
            case 'check':
                player.latestMove = "Check";
                this.advanceToNextPlayer();
                this.updatePlayer();
                break;
            case 'call':
                player.latestMove = "Call";
                player.call(this.highestBet);
                console.log(this.getRoundState());
                this.advanceToNextPlayer();
                this.updatePlayer();
                break;
            case 'raise':
                player.latestMove = "Raise";
                this.highestBet = data.value;
                this.anchor = this.positionInQueue(player);
                console.log('raise anchor: ',this.anchor);
                player.raise(data.value);
                this.advanceToNextPlayer();
                this.updatePlayer();
                break;
            case 'fold':
                player.latestMove = "Fold";
                player.isInRound = false;
                const numPlayers = this.numPlayersInRound();
                if(numPlayers>1){
                    this.advanceToNextPlayer();
                }else{
                    this.endRound();
                }
                this.updatePlayer();
                break;
            default:
                break;
        }
    }

    // Moves to the next player
    async advanceToNextPlayer() {
        do {
            console.log(this.currentPlayer);
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
            console.log(this.currentPlayer);
            console.log(this.anchor);
            if(this.anchor!=null){
                if(this.currentPlayer==this.anchor){
                    console.log('betting round done, advancing stage');
                    this.anchor=null;
                    this.advanceStage();
                }else{
                    this.promptPlayerAction();
                }
            }else{
                if(this.currentPlayer==this.startingPlayer){
                    console.log('betting round done, advancing stage');
                    this.advanceStage();
                }
            }
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
        this.moveBetstoPot();
        this.updatePlayer();
        this.highestBet = 0;
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

    async endRound() {
        let winner, handRank;
        if(this.numPlayersInRound()>1){
            [winner, handRank] = this.determineWinner();
            this.winner = winner; // Set this.winner to the winning player 
            console.log('rank: ', handRank);
        }else{
            winner = this.lastPlayerInRound();
            this.winner = winner;
        }
        console.log('winner',winner.userId);
        winner.chips += this.pot;

        await this.io.to(this.gameId).emit('round-ended', { gameId:this.gameId, winner: winner, prevIndex: this.currentSmallBlind, cards: [] });
    }

    lastPlayerInRound(){
        let winner;
        this.players.forEach(player => {
            console.log(player);
            if(player.isInRound===true) {
                console.log('player found');
                winner= player;
            }
        });
        return winner;
    }

    numPlayersInRound(){
        let index = 0;
        this.players.forEach(player => {
            if (player.isInRound) {
                index++;
            }
        });
        return index;
    }
    
    getRoundState(){
        return [
            this.players,
            this.highestBet,
            this.pot,
            this.communityCards,
            this.stage,
            this.currentPlayer,
            this.startingPlayer
        ]
    }

    positionInQueue(playerToFind){
        let counter = 0;
        for (let player of this.players) {
            if (player.userId === playerToFind.userId) {
                return counter;
            } else {
                counter++;
            }
        }
        return -1;  // -1 if the player is not found
    }

    updatePlayer(){
        console.log('updating player to client');
        console.log({gameId: this.gameId,
            index: this.index,
            players: this.players,
            deck: this.deck,
            smallBlindAmount: this.smallBlindAmount,
            highestBet: this.highestBet,
            pot: this.pot,
            communityCards: this.communityCards,
            hands: this.hands,
            stage: this.stage,
            startingPlayer: this.startingPlayer,
            currentPlayer: this.currentPlayer,
            currentSmallBlind: this.currentSmallBlind,
            playerResponses: this.playerResponses});
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
    }

    moveBetstoPot(){
        this.players.forEach(player => {
            if (player.isPlaying) {
               this.pot += parseInt(player.currentBet);
               player.currentBet = 0;
            }
        });
    }

    // go loop through each player
    // take a list of 7 cards from the com cards and their cards
    // check if their hand matches 10 ranks of poker hands
    // use the rank to create a list of the 5 best cards for the hand
    // store the 'strength' value and the cards in an array
    determineWinner() {
        let roundWinner = null;
        let bestHand = { rank: -1, kicker: -1 };
    
        this.players.forEach(player => {
            if (player.isInRound) {
                const playerCards = [...player.hand, ...this.communityCards];
                const playerHand = this.winner.evaluateHand(playerCards);
    
                if (playerHand.rank > bestHand.rank || 
                    (playerHand.rank === bestHand.rank && playerHand.kicker > bestHand.kicker)) {
                    bestHand = playerHand;
                    roundWinner = player;
                }
            }
        });
    
        return [roundWinner, bestHand.rank];
    }
  
}

module.exports = Round;