// Created by Wesley Yang: Players moves and options
// Contributor: Sho Tanaka

class Player{
    constructor(userId, socketId, username, chips, isAi){
        this.username = username;
        this.userId = userId;
        this.socketId = socketId;
        this.chips = chips;
        this.hand = [];
        this.isPlaying = true;
        this.isInRound = true;
        this.currentBet = 0;
        this.isAi = isAi;
        this.latestMove = "";
    }

    addCardToHand(card) {
        this.hand.push(card);
    }

    fold(){
        this.isInRound = false;
        // io.to(gameId).emit('player-action', { userId: this.userId, action: 'fold' });
    }

    raise(amount) {
        const amountToRaise = amount - this.currentBet;
        if (amountToRaise > this.chips) {
            throw new Error('Insufficient chips to raise');
        }
        this.chips -= amountToRaise;
        this.currentBet = amount;
    }   

    check() {
        //ADD LATER
    }

    call(amount){
        const amountToCall = amount - this.currentBet;
        if(amountToCall <= 0){
            throw new Error('Player calls')
        }
        if(amountToCall > this.chips){
            throw new Error('Insufficient amount of chips');
        }
        this.chips -= amountToCall
        this.currentBet += amountToCall;
    }

    allIn() {
        this.currentBet += this.chips;
        this.chips = 0;
        return this.currentBet; // ADD LIMIT TO HIGHEST OTHER BET LATER
    }

    resetForNewRound() {
        this.hand = [];
        this.currentBet = 0;
        this.isInRound = this.isPlaying; // Only reset for the round if still playing in the game
    }

    leaveGame(){
        this.isPlaying = false;
        this.isInRound = false;
    }

    getChips(){
        return this.chips;
    }

    getPosition(){
        return this.position;
    }
    
    makeMove() {
        // Dummy implementation, can be overridden in subclasses
        // console.log('AI making a move with acceptable moves:', acceptableMoves);
    }


}

module.exports = Player;


