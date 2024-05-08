import React from "react";
import BettingControls from "./BettingControls";
import Card from "./Card";
import ChipsDisplay from "./ChipsDisplay";
import '../css/playerBoxCards.css';
import '../css/PlayerBox.css';
import { buildImgUrl } from "../utils/utils";

export default function PlayerBox({ player, isPlayerOne, blind, chips}) {

    const getBlindIcon = (blind) => {
        if (blind === 2) {
                return (
                    <img 
                        id="blindImage"
                        src={buildImgUrl('bigblind.png')}
                        alt="Big blind"
                        width={40}
                        height={40}
                    />
                );
        } else if (blind === 1) {
                return (
                    <img
                        id="blindImage"
                        src={buildImgUrl('smallblind.jpg')}
                        alt="Small blind"
                        width={40}
                        height={40}
                    />
                );
        } else {
            return null;
        }
    }

    const blindIcon = getBlindIcon(blind);

    return isPlayerOne ? (
            <div className="playerBox">
                <div>
                    <h2>{player}</h2>
                    {blindIcon}
                </div>
                <div className="playerCards">
                    <Card isVisible={true} />
                    <Card isVisible={true} />                
                </div>
                <BettingControls props={{initialChips: chips, currentBet: 0}}/>
            </div>
        ) : (
            <div className="playerBox">
                <div>
                    <h2>{player}</h2>
                    {blindIcon}
                </div>
                <div className="playerCards">
                    <Card />
                    <Card />                    
                </div>
                <ChipsDisplay props={{initialChips: chips, currentBet: 0}}/>
            </div>
        );
}