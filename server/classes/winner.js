const Card = require('./card');
const Player = require('./player');

class Winner {
    constructor(players) {
        this.players = players;
        this.hands = [];
    }

    // Function that will determine the rank/strength of your hand
    // create variables such as:
    // bestHand, which is the best hand you have out of all possible combination
    // rank, rank of your card
    // iterate through the array playerCards to determine the strength
    evaluateHand(playerCards){
        // Sort the player's cards by value
        playerCards.sort((a, b) => a.value - b.value);
        let highestCardNum;
        for(let card in playerCards){
            highestCardNum = 0;
            let cardNum = this.convertCardToNumber(card);
            if(cardNum>highestCardNum){
                highestCardNum=cardNum;
            }
        }

        // Check for specific hand patterns
        if (this.isRoyalStraightFlush(playerCards)) {
            console.log('is royal flush');
            return { rank: 9, cards: playerCards, kicker: highestCardNum }; // Royal straight flush
        } else if (this.isStraightFlush(playerCards)) {
            console.log('is straight flush');
            return { rank: 8, cards: playerCards, kicker: highestCardNum }; // Straight flush
        } else if (this.isFourOfAKind(playerCards)) {
            console.log('is 4 of a kind');
            return { rank: 7, cards: playerCards, kicker: highestCardNum }; // Four of a kind
        } else if (this.isFullHouse(playerCards)) {
            console.log('is a full house');
            return { rank: 6, cards: playerCards, kicker: highestCardNum }; // Full house
        } else if (this.isFlush(playerCards)) {
            console.log('is a flush');
            return { rank: 5, cards: playerCards, kicker: highestCardNum }; // Flush
        } else if (this.isStraight(playerCards)) {
            console.log('is a straight');
            return { rank: 4, cards: playerCard, kicker: highestCardNums }; // Straight
        } else if (this.isThreeOfAKind(playerCards)) {
            console.log('is a three of a kind');
            return { rank: 3, cards: playerCards, kicker: highestCardNum }; // Three of a kind
        } else if (this.isTwoPair(playerCards)) {
            console.log('is a two pair');
            return { rank: 2, cards: playerCards, kicker: highestCardNum }; // Two pair
        } else if (this.isPair(playerCards)) {
            console.log('is a pair');
            return { rank: 1, cards: playerCards, kicker: highestCardNum }; // Pair
        } else {
            console.log('is a high card');
            return { rank: 0, cards: playerCards, kicker: highestCardNum }; // High card
        }
    }

    isRoyalStraightFlush(cards){
        if (!this.isStraightFlush(cards)) {
            return false;
        }
        const values = cards.map(card => card.value);
        return values.includes(10) && values.includes(11) && values.includes(12) && values.includes(13) && values.includes(1);
    }

    isStraightFlush(cards) {
        if (this.isFlush(cards) && this.isStraight(cards)) {
            return true;
        }
        return false;
    }

    isFourOfAKind(cards) {
        const values = cards.map(card => card.value);
        values.sort((a, b) => a - b);

        for (let i = 0; i <= values.length - 4; i++) {
            if (values[i] === values[i + 3]) {
                return true;
            }
        }
        return false;
    }

    isFullHouse(cards) {
        if (this.isThreeOfAKind(cards) && this.isTwoPair(cards)){
            return true;
        }
        return false;
    }

    isFlush(cards) {
        let isFlush = false;
        let suiteDict = {
            'Clubs' : 0,
            'Diamonds':0,
            'Spades':0,
            'Hearts':0
        }
        for (let i = 1; i < cards.length; i++) {
            let card = cards[i];
            if(card.suite=='Clubs'){
                suiteDict['Clubs']+=1;
            }else if(card.suite=='Diamonds'){
                suiteDict['Diamonds']+=1;
            }else if(card.suite=='Spades'){
                suiteDict['Spades']+=1;
            }else{
                suiteDict['Hearts']+=1;
            }
        }
        if(suiteDict['Clubs']>=5){
            isFlush  = true;
        }
        if(suiteDict['Diamonds']>=5){
            isFlush  = true;
        }
        if(suiteDict['Spades']>=5){
            isFlush  = true;
        }
        if(suiteDict['Hearts']>=5){
            isFlush  = true;
        }
        return isFlush;
    }

    isStraight(cards) {
        const values = cards.map(card => card.value);
        //const values = cards.map(card => this.cardValueToInt(card.value));
        values.sort((a, b) => a - b);

        for (let i = 0; i < values.length - 1; i++) {
            if (values[i + 1] - values[i] !== 1) {
                return false;
            }
        }
        return true;
    }

    isThreeOfAKind(cards) {
        const values = cards.map(card => card.value);
        values.sort((a, b) => a - b);

        for (let i = 0; i <= values.length - 3; i++) {
            if (values[i] === values[i + 2]) {
                return true;
            }
        }
        return false;
    }

    isTwoPair(cards) {
        const values = cards.map(card => card.value);
        //const values = cards.map(card => this.cardValueToInt(card.value));
        values.sort((a, b) => a - b);

        let pairCount = 0;
        let distinctValues = [];

        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] === values[i + 1]) {
                if (!distinctValues.includes(values[i])) {
                    distinctValues.push(values[i]);
                    pairCount++;
                }
                i++;
            }
        }

        return pairCount >= 2;
    }

    isPair(cards) {
        const values = cards.map(card => card.value);
        //const values = cards.map(card => this.cardValueToInt(card.value));
        values.sort((a, b) => a - b);

        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] === values[i + 1]) {
                return true; 
            }
        }
        return false;
    }

    convertCardToNumber(card){
        let val = 0;
        if(card.value=='2'){
            return 2;
        }
        if(card.value=='3'){
            return 3;
        }
        if(card.value=='4'){
            return 4;
        }
        if(card.value=='5'){
            return 5;
        }
        if(card.value=='6'){
            return 6;
        }
        if(card.value=='7'){
            return 7;
        }
        if(card.value=='8'){
            return 8;
        }
        if(card.value=='9'){
            return 9;
        }
        if(card.value=='10'){
            return 10;
        }
        if(card.value=='J'){
            return 11;
        }
        if(card.value=='Q'){
            return 12;
        }
        if(card.value=='K'){
            return 13;
        }
        if(card.value=='A'){
            return 14;
        }
    }

}

module.exports = Winner;