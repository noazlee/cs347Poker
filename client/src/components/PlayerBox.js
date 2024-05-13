import React from "react";
import BettingControls from "./BettingControls";
import Card from "./Card";
import ChipsDisplay from "./ChipsDisplay";
import '../css/playerBoxCards.css';
import '../css/PlayerBox.css';
import { buildImgUrl } from "../utils/utils";

export default function PlayerBox({ player, playerOne, isCurrentPlayer = false, blind, moves = [], props, gameId , userId}) {
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

    return (
            <div className="playerBox">
                <div>
                    <h2>{player.username}</h2>
                    {getBlindIcon(blind)}
                </div>
                <div className="playerCards">
                    {player.hand.map((card, index) => {
                        const cardSuit = card.suite;
                        const cardValue = card.value;
                        return <Card key={index} isVisible={playerOne && true} suit={cardSuit} value={cardValue} />
                    })}
                </div>
                {playerOne ? (
                    <BettingControls props={{
                        initialChips: player.chips,
                        currentBet: player.currentBet,
                        moves: moves,
                        isTurn: isCurrentPlayer,
                        toggleCurrentPlayer: props.toggleCurrentPlayer,
                        gameId:gameId
                    }}/>
                ) : (
                    <ChipsDisplay props={{ initialChips: player.chips, currentBet: player.currentBet }}/>
                )}
            </div>
        )
}