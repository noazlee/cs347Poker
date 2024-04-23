import React from "react";
import BettingControls from "./BettingControls";
import Card from "./Card";
import ChipsDisplay from "./ChipsDisplay";
import '../css/playerBoxCards.css';
import '../css/PlayerBox.css';

export default function PlayerBox({ player, isPlayerOne }) {
    return isPlayerOne ? (
            <div className="playerBox">
                <div className="playerCards">
                    <Card isVisible={true} />
                    <Card isVisible={true} />                
                </div>
                <BettingControls props={{initialChips: 60, currentBet: 20}}/>
            </div>
        ) : (
            <div className="playerBox">
                <div className="playerCards">
                    <Card />
                    <Card />                    
                </div>
                <ChipsDisplay props={{initialChips: 40, currentBet: 10}}/>
            </div>
        );
}