//use socket to send signals to server
//check if its your turn
//make make move have the same websocket message as when the player clicks
//establiish socket with backend

//control p
//gameroom.js - logic for players creating and joining game rooms
//bettingcontrols.js - where the clients talk to the server
//prompt player action(round.js) - logic behind players options

//gamesocket.js add ai player

//adding ai player to game-model.js add ai players

//get the socket open

const Ai = require('../ai-player');

class Ai1 extends Ai {
    constructor(userId, socketId, chips, aiId) {
        super(userId, socketId, `AI-${aiId}`, chips, aiId);
        this.identifier = parseInt(aiId.toString()[0]);
    }

    makeMove(acceptableMoves) {
        if (this.identifier >= 1 && this.identifier <= 9) {
            const decision = Math.random();

            if (decision < 0.9 && acceptableMoves.includes('Check')) {
                this.check();
                return 'Check';
            }
            else{
                this.fold();
                return 'Fold';
            }


            // if (decision < 0.2 && acceptableMoves.includes('Fold')) {
            //     this.fold();
            //     return 'Fold';
            // } else if (decision < 0.4 && acceptableMoves.includes('Call')) {
            //     this.call();
            //     return 'Call';
            // } else if (decision < 0.6 && acceptableMoves.includes('AllIn')) {
            //     this.allIn();
            //     return 'All In';
            // } else if (decision >= 0.8 && acceptableMoves.includes('Raise')) {
            //     const raiseAmount = Math.floor(Math.random() * 100) + 1;
            //     this.raise(raiseAmount);
            //     return 'Raise';
            // } else if (decision >= 0.8 && decision < 0.9 && acceptableMoves.includes('Check')) {
            //     this.check();
            //     return 'Check';
            // }
            return 'No move';
        }
    }
}

module.exports = Ai1;