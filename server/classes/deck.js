// Created by Wesley Yang - Initializes the deck and its methods

const Card = require('./card');

class Deck{
    // Array is used to implement stack 
    constructor() 
    {   
        this.cards = []; 
        this.initializeDeck();
    }

    initializeDeck(){
        const suites = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        for (const suite of suites){
            for (const value of values){
                this.cards.push(new Card(suite,value));
            }
        }
    }

    //adding a card to the array
    addCard(card){
        this.cards.push(card);
    }

    //getting number of cards in the array
    numberOfCards(){
        return this.cards.length;
    }

    //check if deck is empty
    isEmpty(){
        return this.cards.length == 0;
    }

    //shuffle deck
    shuffle(){
        for(let i = this.cards.length - 1; i>0; i--){
            const j = Math.floor(Math.random() * (i+1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    dealOneCard(){
        return this.cards.pop();
    }

    //print the cards currently in stack
    printStack(){
        for(let i = this.cards.length-1; i>=0; i--){
            console.log(this.cards[i]);
        }
    }

}
module.exports = Deck;