// round.js
class Round {
    constructor() {
        this.game = game;
        this.players = game.players;  
        this.deck = new Deck();
        this.smallBlindAmount = game.smallBlindAmount;
        this.currentBet = this.smallBlindAmount * 2;
        this.pot = 0;
        this.hands = [];
        this.stage = 0; 
        this.startingPlayer = 0;
        this.currentPlayer = 0;
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
        this.advanceToNextPlayer(); 
    }

    dealFlop(){

    }

    dealTurn(){

    }

    dealRiver(){

    }

  
    advanceToNextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.activePlayers.length;
        if (this.currentPlayerIndex === 0) { //full rotation
            this.advanceStage();
        } else {
            this.handleBetting();
        }

    }

    setBettingOrder(){
        if (this.game.rounds.length === 0) { //if first round
            this.startingPlayer = (this.game.currentDealer + 3) % this.players.length; 
            this.currentPlayer = this.startingPlayer;
        } else {
            this.startingPlayer = (this.game.currentDealer + 1) % this.players.length;  
            this.currentPlayer = this.startingPlayer;
        }
    }

    notifyPlayerToAct(playerId) {
        this.game.io.to(playerId).emit('your-turn', {
            playerId: playerId,
        });
    }

    endRound() {
        const winner = this.determineWinner();
        this.game.io.to(this.game.gameId).emit('round-ended', { winner: winner.userId });
        this.game.startNewRound(); 
    }
    

}
