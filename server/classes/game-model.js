    /*
    THIS FILE WAS CREATED BY NOAH AND ITS PURPOSE IS TO CREATE A GAME CLASS THAT CAN BE USED IN ROUTES LIKE GAME-LOGIC 
    WHERE TEMPORARY GAME DATA CAN EXIST BEFORE BEING UPLOADED TO THE DB AFTER COMPLETION.
    */

    const Player = require('./player');

    const MAXNUMPLAYERS = 4;
    const POTAMOUNT = 10000;
    const SMALLBLINDAMOUNT = 100; 
    const GAMEMODE = 'default'; 

    class Game {
        constructor(ioInstance, hostId, hostSocketId) {
            this.io = ioInstance;
            this.gameId = Math.random().toString(36).substring(2, 15);
            this.players = [];
            this.maxPlayers = MAXNUMPLAYERS;
            this.hostId = hostId;
            this.hostSocketId = hostSocketId;
            this.potAmount = POTAMOUNT;
            this.gameMode = GAMEMODE;
            this.smallBlindAmount = SMALLBLINDAMOUNT;
            this.rounds = [];
            this.status = 'waiting';

            this.addPlayer(hostId, hostSocketId, false);
            // this.initializeAIPlayers();
        }

        initializeAIPlayers() {
            while (this.players.length < this.maxPlayers) {
                const aiId = `AI-${Math.random().toString(36).substring(2, 9)}`;
                const aiSocketId = `AI-Socket-${Math.random().toString(36).substring(2, 9)}`;
                this.addPlayer(aiId, aiSocketId, true);
            }
        }
        
        // move to the next player in the queue unless there is no players left
        nextPlayer(){
            
        }

        // method to get all the relevant game information that would be known by everyone at the table
        getPublicGameState() {
        }

        notifyPlayerToAct(playerId) {
            this.io.to(playerId).emit('your-turn', {
                //what actions the player can take
            });
        }

        addPlayer(playerId, socketId, isAI) {
            if (this.players.some(p => p.userId === playerId)) {
                console.log("Player already exists:", playerId);
                return false; 
            }
            const newPlayer = new Player(playerId, socketId, this.startingChips, isAI);
            this.players.push(newPlayer);
            console.log("Player added:", playerId);
            return true;
        }

        removePlayer(socketId) {
            this.players = this.players.filter(player => player.socketId !== socketId);
            // Optionally, re-fill with AI players if below max capacity
            if (this.players.length < this.maxPlayers) {
                this.initializeAIPlayers();
            }
        }

        getPlayerBySocket(socketId) {
            return this.players.find(player => player.socketId === socketId);
        }

        getPlayerById(playerId) {
            return this.players.find(player => player.playerId === playerId);
        }

        startGame() {
            // NEEDS TO BE IMPLEMENTED
        }
    }

    module.exports = Game;