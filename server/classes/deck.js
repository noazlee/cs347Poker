const Card = require('./card');

class Deck{
    // Array is used to implement stack 
    constructor() 
    {   
        this.cards = []; 
        //adding all 52 cards to the array cards
        const suite = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
        const value = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        for (const i of suites){
            for (const j of value){
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
            //picks a random number between 0 and i, and swaps
            const j = Math.floor(Math.random() * (i+1));
            [this.cards[i], this.cards[j] = this.cards[j], this.cards[i]];
        }
    }

    //print the cards currently in stack
    printStack(){
        for(let i = this.cards.length-1; i>=0; i--){
            console.log(this.cards[i]);
        }
    }

    //how to scramble an array
  
    // Functions to be implemented 
    // push(item) 
    // pop() 
    // peek() 
    // isEmpty() 
    // printStack() 
    // shuffle deck

}
module.exports = Deck;