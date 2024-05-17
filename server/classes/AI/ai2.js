const Ai2 = require('../ai-player'); 


//aggressive Ai
class Ai2 extends Ai{
    constructor(chips, aiId){
       super(chips,true, aiId);
       this.identifier = parseInt(aiId.tostring()[0]);
    }
    
    makemove(){
        const decision = Math.random();
        if(decision < 0.2){
            this.fold();
        }
        else if(decision <0.8){
            this.call();
        }
        else{
            this.raise(Math.floor(Math.random() * 100) + 1);
        }
    }
}

module.exports = Ai2;