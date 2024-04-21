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

router.post('/start-game/:gameId', (req, res) => {
    const { gameId } = req.params;
    // table = New Table();
    // res.json({table});
});

router.post('/table/init', (req, res) => {
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


module.exports = router;