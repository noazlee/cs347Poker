const Deck = require('./deck');

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
        this.startBettingRound(); 
    }

    dealFlop(){
        card1 = this.deck.dealOneCard();
        card2 = this.deck.dealOneCard();
        card3 = this.deck.dealOneCard();
        cardsL = [card1,card2,card3]
        io.to(this.gameId).emit('shown-cards',{
            type: "Flop",
            cards: cardsL
        })
        this.startBettingRound();
    }

    dealTurn(){
        const card = this.deck.dealOneCard();
        io.to(this.gameId).emit('shown-cards',{
            type: "Turn",
            cards: [card]
        })
        this.startBettingRound();
    }

    dealRiver(){
        const card = this.deck.dealOneCard();
        io.to(this.gameId).emit('shown-cards',{
            type: "River",
            cards: [card]
        })
        this.startBettingRound();
    }

    startBettingRound(){
        offset = startingPlayer;
        for(let i=0;i<this.players.length;i++){
            playerIndex = (i + offset) % this.players.length;
            player = players[playerIndex];

            acceptableMovesList = ['Check','Raise','Fold'];
            if(player.isAi==false){
                socket.to(player.socketId).emit('your-turn',{
                    acceptableMoves: acceptableMovesList
                });
            }else{
                // call function from AIplayer
            }
            
            socket.on('player-action',(data)=>{ //Not finished
                move = data.action;
                switch(move){
                    case 'Check':
                        break;
                    case 'Raise':
                        break
                    case 'Fold':
                        break
                    case 'Call':
                        break;
                    default:
                        break;
                }
            })
        };
        showCards();
    }

    showCards(){
        switch(this.stage){
            case 0:
                stage++;
                this.dealFlop();
            case 1:
                stage++
                this.dealTurn();
            case 2:
                stage++
                this.dealRiver();
            case 3:
                this.endRound();
            default:
                //error
                break
        }
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
        if (this.stage==0) { //if first stage
            this.startingPlayer = (this.game.currentSmallBlind + 2) % this.players.length; 
            this.currentPlayer = this.startingPlayer;
        } else {
            this.startingPlayer = (this.game.currentSmallBlind + 1) % this.players.length;  
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

module.exports = Round;