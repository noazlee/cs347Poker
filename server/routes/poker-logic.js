const express = require('express');
const Table = require('../classes/table');
const Player = require('../classes/player');




const router = express.Router();
const games = require('./game-logic');

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

router.post('/start-game/:gameId/', (req, res, next) => {
    const { gameId } = req.params;
    // table = New Table();
    // res.json({table});
    table[table_id] = {

    }
});

router.post('/round-of-betting/:gameId/:stage', (req, re, next) => {
    // go through queue, send request to client when it is their turn
});

router.post('/show-cards/:gameId/:stage', (req, res, next) => {
    // if stage == 0 => flop
    // if stage == 1 => turn
    // if stage == 2 => river
    // if stage == 3 => calculate winner () - cycle through each player in queue, take their hand and combine with community cards
    // to calculate the best combination of 5 cards and assign a 'strength value 1-10'
    // compare each players strength value, add cases when they are equal
});




module.exports = router;