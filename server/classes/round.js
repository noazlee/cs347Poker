// round.js
class Round {
    constructor(table) {
        this.table = table;
        this.currentBet = table.smallBlindAmount * 2;
        this.pot = 0;
        this.hands=[];
        this.stage=0;//0 is preflop, 1 is postflop, 2 is postturn, 3 is postriver
    }

    start() {
        this.table.players.forEach(player => {
            if (player.isPlaying) {
                player.resetForNewRound();
            }
        });

        // Shuffle and deal cards to each player in the round
        this.table.deck.shuffle();
        this.table.players.filter(player => player.isInRound).forEach(player => {
            player.addCardToHand(this.table.deck.dealOneCard());
            player.addCardToHand(this.table.deck.dealOneCard());
        });

        // Initialize the pot and other round specific variables
        this.pot = 0;

        // Betting rounds initiated here

    }

    // Methods for progressing through betting rounds, adding to the pot, etc.
}
