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

        // Check for specific hand patterns
        if (isRoyalStraightFlush(playerCards)) {
            return { rank: 9, cards: playerCards }; // Royal straight flush
        } else if (isStraightFlush(playerCards)) {
            return { rank: 8, cards: playerCards }; // Straight flush
        } else if (isFourOfAKind(playerCards)) {
            return { rank: 7, cards: playerCards }; // Four of a kind
        } else if (isFullHouse(playerCards)) {
            return { rank: 6, cards: playerCards }; // Full house
        } else if (isFlush(playerCards)) {
            return { rank: 5, cards: playerCards }; // Flush
        } else if (isStraight(playerCards)) {
            return { rank: 4, cards: playerCards }; // Straight
        } else if (isThreeOfAKind(playerCards)) {
            return { rank: 3, cards: playerCards }; // Three of a kind
        } else if (isTwoPair(playerCards)) {
            return { rank: 2, cards: playerCards }; // Two pair
        } else if (isPair(playerCards)) {
            return { rank: 1, cards: playerCards }; // Pair
        } else {
            return { rank: 0, cards: playerCards }; // High card
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
        if (this.isThreeOfAKind(card) && this.isTwoPair(cards)){
            return true;
        }
        return false;
    }

    isFlush(cards) {
        const firstSuit = cards[0].suit;
        for (let i = 1; i < cards.length; i++) {
            if (cards[i].suit !== firstSuit) {
                return false;
            }
        }
        return true;
    }

    isStraight(cards) {
        const values = cards.map(card => this.cardValueToInt(card.value));
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
        const values = cards.map(card => this.cardValueToInt(card.value));
        values.sort((a, b) => a - b);

        let pairCount = 0;
        let distinctValues = [];

        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] === values[i + 1]) {
                // Found a pair, add it to distinctValues if it's not already there
                if (!distinctValues.includes(values[i])) {
                    distinctValues.push(values[i]);
                    pairCount++;
                }
                i++; // Skip the next card as it's already part of the pair
            }
        }

        return pairCount === 2; // Two distinct pairs found
    }

    isPair(cards) {
        const values = cards.map(card => this.cardValueToInt(card.value));
        values.sort((a, b) => a - b); // sorts in ascending order

        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] === values[i + 1]) {
                return true; // Found a pair
            }
        }
        return false; // No pair found
    }

}

module.exports = Winner;