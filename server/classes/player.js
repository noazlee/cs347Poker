class Player{
    constructor(userId, socketId, chips, isAi){
        this.userId = userId;
        this.socketId = socketId;
        this.chips = chips;
        this.hand = [];
        this.isPlaying = true;
        this.isInRound = true;
        this.currentBet = 0;
        this.isAi = isAi;
    }

    getCardToHand(card) {
        this.hand.push(card);
    }

    fold(){
        this.isInRound = false;
    }

    raise(amount) {
        if (amount > this.chips) {
            throw new Error('Insufficient chips to raise');
        }
        this.chips -= amount;
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


}

module.exports = Player;

//players two cards
//position
//chips
// is ai
//user id
//is still playing

//methods:
// fold, raise, check, call, leave game, all in?

