const express = require('express');

const router = express.Router();

// EXAMPLES
// router.get('/add-product',(req,res,next)=>{
//     res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
// }); 

// router.post('/product',(req,res,next)=>{
//     console.log(req.body.title);
//     res.redirect('/');
// }); 

//tests
router.get('/',(req,res,next)=>{
    res.write('<h1>Hello world2</h1>');
}); 

router.post('/api/table/init', (req, res) => {
    const { num_players, starting_chips } = req.body;

    // Create a new table ID
    const table_id = Object.keys(tables).length + 1;

    // Initialize the table with the specified number of players and starting chips
    tables[table_id] = {
        players: Array.from({ length: num_players }, (_, i) => ({
            id: i + 1,
            chips: starting_chips
        })),
        pot: 0
    };

    res.json({ success: true, message: 'Table initialized successfully', table_id });
});

let tables = {};
class card{
    suite = // hearts, spade, cloves, diamond
    value = // ace - king
}

/*
class deck{
    constructor(card){
        this.card = card
    }

    //dictionary holding numbers 1-52 and their corresponding card
    deck = {
        //heart
        1: "ace_of_hearts", 
        2: "two_of_hearts", 
        3: "three_of_hearts",
        4: "four_of_hearts",
        5: "five_of_hearts",
        6: "six_of_hearts",
        7: "seven_of_hearts",
        8: "eight_of_hearts",
        9: "nine_of_hearts",
        10: "ten_of_hearts",
        11: "jack_of_hearts",
        12: "queen_of_hearts",
        13: "king_of_hearts",
        //diamond
        14: "ace_of_diamonds", 
        15: "two_of_diamonds", 
        16: "three_of_diamonds",
        17: "four_of_diamonds",
        18: "five_of_diamonds",
        19: "six_of_diamonds",
        20: "seven_of_diamonds",
        21: "eight_of_diamonds",
        22: "nine_of_diamonds",
        23: "ten_of_diamonds",
        24: "jack_of_diamonds",
        25: "queen_of_diamonds",
        26: "king_of_diamonds",
        //clubs
        27: "ace_of_clubs", 
        28: "two_of_clubs", 
        29: "three_of_clubs",
        30: "four_of_clubs",
        31: "five_of_clubs",
        32: "six_of_clubs",
        33: "seven_of_clubs",
        34: "eight_of_clubs",
        35: "nine_of_clubs",
        36: "ten_of_clubs",
        37: "jack_of_clubs",
        38: "queen_of_clubs",
        39: "king_of_clubs",
        //spades
        40: "ace_of_spades", 
        41: "two_of_spades", 
        42: "three_of_spades",
        43: "four_of_spades",
        44: "five_of_spades",
        45: "six_of_spades",
        46: "seven_of_spades",
        47: "eight_of_spades",
        48: "nine_of_spades",
        49: "ten_of_spades",
        50: "jack_of_spades",
        51: "queen_of_spades",
        52: "king_of_spades"
    };
    


    //creating the array with 52 cards
    let card = []
    for(let i = 1; i<= 52; i++){
        card.push(i);
    }


    //pick a random card from deck






    //remember which card have been chosen, remove from array

    //loop until each player has two cards(working wiht between 2-8 players)
    return 0;
}
*/


// //pick card function
// fun pick_card{
//     Math.random(card)
// }
    




//hands



//gameID




//hand out chips

//role - big blind, small blind
//reset position when someone raises

module.exports = router;