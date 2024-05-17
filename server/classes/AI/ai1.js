//use socket to send signals to server
//check if its your turn
//make make move have the same websocket message as when the player clicks
//establiish socket with backend

//control p
//gameroom.js - logic for players creating and joining game rooms
//bettingcontrols.js - where the clients talk to the server
//prompt player action(round.js) - logic behind players options

//gamesocket.js add ai player

const Ai = require('./ai');

class Ai1 extends Ai {
    constructor(userId, socketId, chips, aiId) {
        super(userId, socketId, `AI-${aiId}`, chips, true, aiId);
        this.identifier = parseInt(aiId.toString()[0]);
    }

    makemove(acceptableMoves) {
        if (this.identifier >= 1 && this.identifier <= 9) {
            const decision = Math.random();

            if (decision < 0.6 && acceptableMoves.includes('Fold')) {
                this.fold();

            } else if (decision < 0.8 && acceptableMoves.includes('Call')) {
                this.call();
            } else if (decision < 0.9 && acceptableMoves.includes('AllIn')) {
                this.allIn();

            } else if (decision >= 0.9 && acceptableMoves.includes('Raise')) {
                const raiseAmount = Math.floor(Math.random() * 100) + 1;
                this.raise(raiseAmount);
               
            }
        }
    }

    emitSocketAction(action, amount = null) {
        // Emit socket event for AI action
        socket.emit('ai-action', { action, amount });
    }
}

module.exports = Ai1;