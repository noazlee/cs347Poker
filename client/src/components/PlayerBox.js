import React from "react";
import BettingControls from "./BettingControls";
import Card from "./Card";
import ChipsDisplay from "./ChipsDisplay";
import socket from '../socket'
import '../css/playerBoxCards.css';
import '../css/PlayerBox.css';
import { buildImgUrl } from "../utils/utils";

export default function PlayerBox({ player, playerOne, isCurrentPlayer = false, blind, moves = [], props, gameId, active}) {
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

    const leaveGame = () => {
        socket.emit('leave-mid-game', {gameId, userId: player.userId})
    }

    return (
            <div className={"playerBox " + (active === true ? "active" : "inactive")}>
                <div>
                    <h2>{player.username}</h2>
                    {getBlindIcon(blind)}
                    <div className="playerCards">
                        {player.hand.map((card, index) => {
                            const cardSuit = card.suite;
                            const cardValue = card.value;
                            return <Card key={index} isVisible={playerOne && true} suit={cardSuit} value={cardValue} />
                        })}
                    </div>
                </div>
                <div className="bettingTab">
                    {playerOne ? (
                        <BettingControls props={{
                            initialChips: player.chips,
                            currentBet: player.currentBet,
                            moves: moves,
                            isTurn: isCurrentPlayer,
                            toggleCurrentPlayer: props.toggleCurrentPlayer,
                            gameId:gameId,
                            username:player.username,
                        }}/>
                    ) : (
                        <ChipsDisplay props={{ initialChips: player.chips, currentBet: player.currentBet }}/>
                    )}
                    <p>Latest Move: {player.latestMove}</p>
                    {playerOne && <button onClick={leaveGame}>Leave Game</button>}
                </div>
            </div>
        )
}