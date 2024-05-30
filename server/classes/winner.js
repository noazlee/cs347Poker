// Created by Sho and Noah - Winner class which handles the logic of deciding the game winner - called in determineWinner in round.js

const Card = require('./card');
const Player = require('./player');

class Winner {
    constructor(players) {
        this.players = players;
    }

    // Function that will determine the rank/strength of your hand
    // create variables such as:
    // bestHand, which is the best hand you have out of all possible combination
    // rank, rank of your card
    // iterate through the array playerCards to determine the strength
    evaluateHand(playerCards){

        // Sort the player's cards by value
        playerCards.sort((a, b) => this.convertCardToNumber(a) - this.convertCardToNumber(b));
        const highestCardNum = Math.max(...playerCards.map(card => this.convertCardToNumber(card))); // returns highest card from spreaded array

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
        } else if (this.isStraight(playerCards).isStraight) {
            console.log('is a straight');
            return { rank: 4, cards: playerCards, kicker: highestCardNum }; // Straight
        } else if (this.isThreeOfAKind(playerCards)!= false) {
            console.log('is a three of a kind');
            const { threeOfAKind, kickers } = this.isThreeOfAKind(playerCards);
            return { rank: 3, cards: playerCards, kicker: threeOfAKind }; // Three of a kind
        } else if (this.isTwoPair(playerCards)!= false) {
            const { pairs, kicker } = this.isTwoPair(playerCards);
            console.log('is a two pair');
            return { rank: 2, cards: playerCards, kicker: pairs }; // Two pair
        } else if (this.isPair(playerCards)!=false) {
            const { pair, kicker } = this.isPair(playerCards);
            console.log('is a pair');
            return { rank: 1, cards: playerCards, kicker: pair }; // Pair
        } else {
            const threeOfAKind = this.isThreeOfAKind(playerCards);
            if (threeOfAKind !== false) {
                console.log('is a three of a kind');
                return { rank: 3, cards: playerCards, kicker: threeOfAKind.threeOfAKind }; // Three of a kind
            }
            const twoPair = this.isTwoPair(playerCards);
            if (twoPair !== false) {
                console.log('is a two pair');
                return { rank: 2, cards: playerCards, kicker: twoPair.kicker }; // Two pair
            }
            const pair = this.isPair(playerCards);
            if (pair !== false) {
                console.log('is a pair');
                return { rank: 1, cards: playerCards, kicker: pair.pair }; // Pair
            }
            console.log('is a high card');
            return { rank: 0, cards: playerCards, kicker: highestCardNum }; // High card
        }
    }

    isRoyalStraightFlush(cards){
        return this.isStraightFlush(cards) && cards.some(card => card.value === 14); //checks if royal flush has an ace in it
    }

    isStraightFlush(cards) {
        if (this.isFlush(cards) && this.isStraight(cards)) {
            return true;
        }
        return false;
    }

    isFourOfAKind(cards) {
        const values = cards.map(card => this.convertCardToNumber(card));

        const hasFourOfAKind = values.some((value, _, arr) => {
            // Filter the array to include only the elements equal to the current value
            const filteredValues = arr.filter(v => v === value);
            
            // Check if the length of the filtered array is exactly 4
            const isFourOfAKind = filteredValues.length === 4;
            
            return isFourOfAKind;
            });

        return hasFourOfAKind;
    }

    isFullHouse(cards) {
        if (this.isThreeOfAKind(cards) && this.isTwoPair(cards)){
            return true;
        }
        return false;
    }

    isFlush(cards) {
        const suitCounts = new Map();
        cards.forEach(card => {
            suitCounts.set(card.suite, (suitCounts.get(card.suite) || 0) + 1);
        });
        const hasFlush = Array.from(suitCounts.values()).some(count => count >= 5);
        return hasFlush;
    }

    isStraight(cards) {
        const uniqueValues = Array.from(new Set(cards.map(card => this.convertCardToNumber(card))));
        uniqueValues.sort((a, b) => a - b);
        if (uniqueValues.length < 5){
            return { isStraight: false };
        } 
        for (let i = 0; i <= uniqueValues.length - 5; i++) {
            const sequence = uniqueValues.slice(i, i + 5);
    
            let isConsecutive = true;
            for (let j = 0; j < 4; j++) {
                if (sequence[j] + 1 !== sequence[j + 1]) {
                    isConsecutive = false;
                }
            }
    
            if (isConsecutive) {
                const highestStraightCard = sequence[4];
                return { isStraight: true, highestStraightCard };
            }
        }
        return { isStraight: false };
    }

    isThreeOfAKind(cards) {
        const values = cards.map(card => this.convertCardToNumber(card));
        const triples = [];
        const kickers = [];

        values.forEach((value, index, array) => {
            const valueCount = array.filter(v => v === value).length;
            if (valueCount === 3 && !triples.includes(value)) {
                triples.push(value);
            } else if (valueCount === 1) {
                kickers.push(value);
            }
        });

        triples.sort((a, b) => b - a);
        kickers.sort((a, b) => b - a);

        if (triples.length >= 1) {
            return { threeOfAKind: triples[0], kickers: kickers.slice(0, 2) };
        }

        return false;
    }

    isTwoPair(cards) {

        const values = cards.map(card => this.convertCardToNumber(card));
        const pairs = [];
        const kickers=[];
        values.forEach((value, index, array) => {
            const valueCount = array.filter(v => v === value).length;
            // If 'value' appears exactly twice, it forms a pair
            if (valueCount === 2 && !pairs.includes(value)) {
                pairs.push(value);
            } else if (valueCount === 1) {
                kickers.push(value);
            }
        });

        pairs.sort((a, b) => b - a);
        kickers.sort((a, b) => b - a);

        if (pairs.length >= 2) {
            return { pairs: pairs.slice(0, 2), kicker: kickers[0] };
        }
        return false;
    }

    isPair(cards) {
        const values = cards.map(card => this.convertCardToNumber(card));
        const pairs = [];
        const kickers = [];

        values.forEach((value, index, array) => {
            const valueCount = array.filter(v => v === value).length;
            if (valueCount === 2 && !pairs.includes(value)) {
                pairs.push(value);
            } else if (valueCount === 1) {
                kickers.push(value);
            }
        });

        pairs.sort((a, b) => b - a);
        kickers.sort((a, b) => b - a);

        if (pairs.length >= 1) {
            return { pair: pairs[0], kicker: kickers[0] };
        }

        return false;
    }

    convertCardToNumber(card) {
        switch (card.value) {
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case '8': return 8;
            case '9': return 9;
            case '10': return 10;
            case 'J': return 11;
            case 'Q': return 12;
            case 'K': return 13;
            case 'A': return 14;
            default: return 0;
        }
    }

}

module.exports = Winner;