// Start game stuff

//Express is used to create the API endpoints
const express = require('express');
const router = express.Router();


//extracts the entire body portion of an incoming request stream and exposes it on req.body as an object. 
//This makes it easier to work with the request body, especially when dealing with POST requests 
//where you are sending data to the server.
const bodyParser = require('body-parser'); 

//create an instance of the Express application and specify the port number
//on which the server will listen for incoming requests.
const app = express();
const PORT = 3000;

//define a JavaScript object (tables) to store the game tables. 
//This object will hold the state of each table, including players and the pot.
let tables = {};

app.use(bodyParser.json());

app.post('/api/table/init', (req, res) => {
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



class deck{
    //dictionary
    {1; ace_of_spades,  2: "ace of hears", }
    [1,52]



    //array of four arrays containing each suit

    randnum(1,4)
    //Heart suit
    1 = []

    //remember which card have been chosen, remove from array

    //loop until each player has two cards(working wiht between 2-8 players)

    
}



    




//hands



//gameID




//hand out chips

//role - big blind, small blind
//reset position when someone raises


module.exports = router;