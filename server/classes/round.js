// Created by Noah Lee - Round class which handles the logic for an entire round of a game of poker
// Contributors: Batmend, Ashok, Wesley, Sho

const Deck = require('./deck');
const pokerHandEvaluator = require('./poker-hand-evaluator');
const Winner = require('./winner');
const Ai1 = require('./AI/ai1');
const Game = require('./game-model');

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
        this.currentBigBlind = (this.currentSmallBlind + 1) % this.players.length;
        this.playerResponses = new Map(); 
        this.winners = new Winner(players); // Initialize Winner object with the players array (sho)
        this.roundEnded = false;
        this.roundPlaying=false;

        this.aiSocketIds = new Map();
    }

    async start() {
        if (this.players.length === 0) { // If players array is empty (no active human player), skip straight to end game
            this.endRound();
        } else {
            let humanPlayersRemaining = 0;
            let aiPlayersRemaining = 0;
            this.players.forEach(player => {
                if (player.isPlaying) {
                    player.resetForNewRound();
                    if (player.isAi) {
                        aiPlayersRemaining++;
                    } else {
                        humanPlayersRemaining++;
                    }
                }
            });

            if ((humanPlayersRemaining === 1) && (aiPlayersRemaining === 0)) { // if only 1 human player left, end round early
                this.endRound();
            } else {

                console.log(this.currentSmallBlind);


                this.deck.shuffle();
                this.players.filter(player => player.isInRound).forEach(player => {
                    player.addCardToHand(this.deck.dealOneCard());
                    player.addCardToHand(this.deck.dealOneCard());
                });

                this.pot = 0;
                
                await this.setBettingOrder();

                this.players[this.currentSmallBlind].currentBet = this.smallBlindAmount;
                this.players[this.currentSmallBlind].chips -= this.smallBlindAmount;

                this.players[this.currentBigBlind].currentBet = this.smallBlindAmount * 2; //big blind
                this.players[this.currentBigBlind].chips -= this.smallBlindAmount * 2;

                this.players.forEach(player=>{
                    console.info(player);
                })

                this.io.to(this.gameId).emit('shown-cards', {
                    cards: []
                });
                this.io.to(this.gameId).emit('update-round-data', {
                    round: {
                        gameId: this.gameId,
                        index: this.index,
                        players: this.players, // problem ... AI player inside player ... socket inside AI player
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
                        currentBigBlind: this.currentBigBlind,
                        playerResponses: this.playerResponses
                    }
                });

                await this.promptPlayerAction();
            }
        }
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

        if(this.roundEnded==false){
            if (this.currentPlayer >= this.players.length) {
                this.currentPlayer = 0;  // Wrap-around
            }
    
            const player = this.players[this.currentPlayer];
            console.log(player.userId, "turn"); 
            var acceptableMoves;
            // console.log(player.currentBet);
            // console.log(this.highestBet);
            if(player.currentBet<this.highestBet){
                if(player.chips==0){
                    acceptableMoves = ['Fold', 'Check'];
                }else{
                    acceptableMoves = ['Raise', 'Fold', 'Call'];
                }
            }else{
                if(player.chips==0){
                    acceptableMoves = ['Fold', 'Check'];
                }else{
                    acceptableMoves = ['Raise', 'Fold', 'Check'];
                }
            }
    
            //this.io.to()
            //player.makemove(acceptableMoves);
    
            if (player.isInRound) {
                if (player.isAi) {
                    console.log(acceptableMoves);
                    const aiMove = player.makeMove(acceptableMoves, this.highestBet);
                    // const aiSocketId = Game.aiSocketIds.get(player.userId);
                    await this.processPlayerActionAI(player, aiMove);
                }else{
                // Send signal to client. Received by Table.js
                this.io.to(player.socketId).emit('your-turn', { // Waits for signal from client and calls function game sockets.
                    highestbet: this.highestBet,
                    acceptableMoves: acceptableMoves
                });
                return new Promise((resolve) => { 
                    this.playerResponses.set(player.socketId, resolve);
                });
            }
            } else {
                await this.advanceToNextPlayer();  // Skip if the player is not active
            }
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
    
    async processPlayerActionAI(player, aiMove) {
        console.log(`Action received from ${player.userId}: ${aiMove}`);
        this.roundPlaying=true;
        switch(aiMove){
            case 'check':
                player.latestMove = "Check";
                await this.advanceToNextPlayer();
                await this.updatePlayer();
                break;
            case 'call':
                player.latestMove = "Call";
                await this.advanceToNextPlayer();
                await this.updatePlayer();
                break;
            case 'raise':
                player.latestMove = "Raise";
                this.highestBet = player.currentBet;
                this.anchor = this.positionInQueue(player);
                await this.advanceToNextPlayer();
                await this.updatePlayer();
                break;
            case 'fold':
                player.latestMove = "Fold";
                player.isInRound = false;
                const numPlayers = this.numPlayersInRound();
                this.pot += player.currentBet;
                player.currentBet = 0;

                if(numPlayers>1){
                    await this.advanceToNextPlayer();
                    await this.updatePlayer();
                }else{
                    await this.endRound();
                }
                break;
            default:
                break;
        }
    }

    processPlayerAction(socket, data) {
        // Process the action
        console.log(`Action received from ${socket.id}: ${data.action}`);
        const player = this.players[this.currentPlayer];
        this.roundPlaying=true;
        switch (data.action) {
            case 'check':
                console.log(this.currentPlayer);
                console.log(this.startingPlayer);
                console.log(this.anchor);
                player.latestMove = "Check";
                this.advanceToNextPlayer();
                this.updatePlayer();
                break;
            case 'call':
                player.latestMove = "Call";
                // let previousCall = player.currentBet;
                player.call(this.highestBet);
                // let currentCall = player.currentBet;
                // this.pot += (currentCall - previousCall);
                console.log(this.getRoundState());
                this.advanceToNextPlayer();
                this.updatePlayer();
                break;
            case 'raise':
                player.latestMove = "Raise";
                this.highestBet = data.value;
                this.anchor = this.positionInQueue(player);
                console.log('raise anchor: ',this.anchor);
                // let previousRaise = player.currentBet;
                player.raise(data.value);
                // let currentRaise = player.currentBet;
                // this.pot += (currentRaise - previousRaise);
                this.advanceToNextPlayer();
                this.updatePlayer();
                break;
            case 'fold':
                player.latestMove = "Fold";
                player.isInRound = false;

                const numPlayers = this.numPlayersInRound();

                this.pot += player.currentBet;
                player.currentBet = 0;

                if(numPlayers>1){
                    this.advanceToNextPlayer();
                    this.updatePlayer();
                }else{
                    this.endRound();
                }
                break;
            default:
                break;
        }
    }

    // Moves to the next player
    async advanceToNextPlayer() {
        let movedToNextPlayer = false;
    
        do {
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
            console.log(`Current player index after increment: ${this.currentPlayer}`);
            movedToNextPlayer = this.players[this.currentPlayer].isInRound;
    
            // Check if we've returned to the anchor player
            if (this.anchor !== null && this.currentPlayer === this.anchor) {
                console.log('Betting round done, advancing stage');
                this.anchor = null;
                this.advanceStage();
                return;
            }
    
            // Check if we've returned to the starting player
            if (this.anchor === null && this.currentPlayer === this.startingPlayer) {
                console.log('Betting round done, advancing stage');
                this.advanceStage();
                return;
            }
    
        } while (!movedToNextPlayer);
    
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
                this.setBettingOrder();
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
        if (this.stage === 0) { //if first stage
            while (!this.players[this.currentSmallBlind].isPlaying) {
                this.currentSmallBlind = (this.currentSmallBlind + 1) % this.players.length;
            }
    
            this.currentBigBlind = (this.currentSmallBlind + 1) % this.players.length;
            while (!this.players[this.currentBigBlind].isPlaying) {
                this.currentBigBlind = (this.currentBigBlind + 1) % this.players.length;
            }

            this.startingPlayer = (this.currentBigBlind + 1) % this.players.length;
            while (!this.players[this.startingPlayer].isPlaying) {
                this.startingPlayer = (this.startingPlayer + 1) % this.players.length;
            } 
            this.currentPlayer = this.startingPlayer;
        } else {
            console.log('changing starting player');
            this.startingPlayer = this.currentSmallBlind;
            this.currentPlayer = this.startingPlayer;
        }
    }

    async endRound() {
        let winners, handRank;
        let numPplPlaying = 0;

        this.roundEnded = true;

        if (this.players.length > 0) {
            this.players.forEach(player=>{
                this.pot+=player.currentBet;
                player.currentBet=0;
            })

            if(this.numPlayersInRound()>1){
                [winners, handRank] = this.determineWinner();
                this.winners = winners; 
                console.log('rank: ', handRank);
            }else{
                winners = [this.lastPlayerInRound()];
                this.winners = winners;
            }

            winners.forEach(winner => console.log('winner: ', winner.username, handRank));

            if (winners.length > 1) {
                const potShare = Math.floor(this.pot / winners.length);
                winners.forEach(winner => {
                    winner.chips += potShare;
                });
            } else {
                const winner = winners[0];
                winner.chips += this.pot;
            }

            this.players.forEach(player => {
                if(player.isPlaying){
                    if(player.chips<=0){
                        player.isPlaying = false;
                    }else{
                        numPplPlaying += 1;
                    }
                }
            });
        } else {
            winners = [];
        }

        if(numPplPlaying>1){
            await this.io.to(this.gameId).emit('round-ended', { gameId:this.gameId, winner: winners, prevIndex: this.currentSmallBlind, cards: [], stillPlaying: true });
        }else{
            console.log('emitting game ended to client');
            await this.io.to(this.gameId).emit('round-ended', { gameId:this.gameId, winner: winners, prevIndex: this.currentSmallBlind, cards: [], stillPlaying: false });
        }
    }

    lastPlayerInRound(){
        let winner;
        this.players.forEach(player => {
            console.log(player);
            if(player.isInRound===true) {
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

        if(this.roundEnded==false){
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
                    currentBigBlind: this.currentBigBlind,
                    playerResponses: this.playerResponses
                }
            });
        }else{
            this.io.to(this.gameId).emit('update-round-data-without-popup', {
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
                    currentBigBlind: this.currentBigBlind,
                    playerResponses: this.playerResponses
                }
            });
        }
        
    }

    updateHost(hostId) {
        this.io.to(this.gameId).emit('update-host', {hostId});
    }

    moveBetstoPot(){
        let totalBets = 0;
        // console.log('moving bets to pot');
        this.players.forEach(player => {
            if (player.isPlaying) {
                // console.log(`Moving ${player.currentBet} from ${player.userId} to pot`);
                this.pot += parseInt(player.currentBet);
                player.currentBet = 0;
            }
        });
        // console.log(`Total pot after moving bets: ${this.pot}`);
    }

    // go loop through each player
    // take a list of 7 cards from the com cards and their cards
    // check if their hand matches 10 ranks of poker hands
    // use the rank to create a list of the 5 best cards for the hand
    // store the 'strength' value and the cards in an array
    determineWinner() {
        let roundWinners = [];
        let bestHand = { rank: -1, kicker: -1 };
    
        this.players.forEach(player => {

            if (player.isInRound) {
                const playerCards = [...player.hand, ...this.communityCards];
                // console.log(player.userId, playerCards);
                const playerHand = this.winners.evaluateHand(playerCards);
    
                if (playerHand.rank > bestHand.rank || 
                    (playerHand.rank === bestHand.rank && playerHand.kicker > bestHand.kicker)) {
                    bestHand = playerHand;
                    roundWinners = [player];
                }else if (playerHand.rank === bestHand.rank && playerHand.kicker === bestHand.kicker) {
                    roundWinners.push(player);
                }
            }
        });

        
    
        return [roundWinners, bestHand.rank];
    }
  
}

module.exports = Round;