class Players{
    constructor(userId,position, chips){
        this.userId = userId;
        this.position = position;
        this.chips = chips;
        this.cards = [];
        this.isPlaying = true;
        this.isAi = false;
    }

    dealCards(card1,card2){
        this.cards.push(card1,card2);
    }

    // revealCards(){

    // }

    getChips(){
        return this.chips;
    }

    getPosition(){
        return this.position;
    }

    isAi(){
        this.isAi = false;
    }

    fold(){
        this.isPlaying = false;
    }

    raise(amount){
        if(amount > this.chips){
            console.log('Insufficient amount of chips');
            return;
        }
        this.chips -= amount;
    }

    check(){
        
    }

    call(currentBet){
        const amountToCall = currentbet - this.chips;
        if(amountToCall <= 0){
            console.log('Player calls')
            return;
        }
        if(amountToCall > this.chips){
            console.log('Insufficient amount of chips');
            return;
        }
        this.chips -= amountToCall
    }


    leaveGame(){
        isPlaying = false;
    }


}

//players two cards
//position
//chips
// is ai
//user id
//is still playing

//methods:
// fold, raise, check, call, leave game, all in?