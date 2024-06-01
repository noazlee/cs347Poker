// Created by Wesley Yang - Handles logic of when Ai makes a move
// Contributors: Noah Lee, Sho Tanaka

const Ai = require('../ai-player');

class Ai1 extends Ai {
    constructor(userId, socketId, chips, aiId) {
        super(userId, socketId, `AI-${aiId}`, chips, aiId);
        this.identifier = parseInt(aiId.toString()[0]);
    }

    makeMove(acceptableMoves, highestBet) {
        if (acceptableMoves.includes('Fold') && acceptableMoves.includes('Check') && !acceptableMoves.includes('Call')) {
            if (this.identifier >= 1 && this.identifier <= 9) {
                const decision = Math.random();
                if (decision < 0.9 && acceptableMoves.includes('Check')) {
                    this.check();
                    return 'check';
                } else {
                    this.fold();
                    return 'fold';
                }
            }
        } else if (acceptableMoves.includes('Raise') && acceptableMoves.includes('Fold') && acceptableMoves.includes('Call')) {
            const decision = Math.random();
            if (decision < 0.2) {
                this.fold();
                return 'fold';
            } else if (decision < 0.5) {
                this.call(highestBet);
                return 'call';
            } else {
                const raiseAmount = this.calculateRaiseAmount(highestBet);
                this.raise(raiseAmount);
                return 'raise';
            }
        } else if (acceptableMoves.includes('Raise') && acceptableMoves.includes('Fold') && acceptableMoves.includes('Check')) {
            const decision = Math.random();
            if (decision < 0.2) {
                this.fold();
                return 'fold';
            } else if (decision < 0.5) {
                this.check();
                return 'check';
            } else {
                const raiseAmount = this.calculateRaiseAmount(highestBet);
                this.raise(raiseAmount);
                return 'raise';
            }
        }
    }

    calculateRaiseAmount(highestBet) {
        const minRaise = highestBet + 1;
        const raiseAmount = Math.min(this.chips, minRaise);

        return raiseAmount;
    }
}

module.exports = Ai1;