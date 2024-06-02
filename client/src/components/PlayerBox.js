// Displays a player's information in game. Includes buttons for the player to make a move or leave the game.
// Contributors: Ashok Khare, Carlos Flores

import React from "react";
import BettingControls from "./BettingControls";
import Card from "./Card";
import ChipsDisplay from "./ChipsDisplay";
import socket from '../socket'
import {useNavigate} from 'react-router-dom';
import '../css/playerBoxCards.css';
import '../css/PlayerBox.css';
import { buildImgUrl } from "../utils/utils";

export default function PlayerBox({ globalBettingCap, player, playerOne, isCurrentPlayer = false, blind, moves = [], highestBet, props, gameId, active, roundOver}) {
    const navigate = useNavigate();
    
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
        if (player.isPlaying) { // If the player is playing, remove them from the socket and the game
            socket.emit('leave-mid-game', {gameId, userId: player.userId});
        } else { // If the player is spectating (already left game), just remove them from the socket
            socket.emit('leave-socket', {gameId, userId: player.userId});
        }
        navigate(`/home/${player.userId}`);
    }
    console.log("PlayerBox Global betting cap: ", globalBettingCap);

    return (
            <div className={"playerBox " + (active === true ? "active" : "inactive")}>
                <div>
                    <h2>{player.username}</h2>
                    {getBlindIcon(blind)}
                    <div className="playerCards">
                        {player.hand.map((card, index) => {
                            const cardSuit = card.suite;
                            const cardValue = card.value;
                            return <Card key={index} isVisible={(playerOne || roundOver) && true} suit={cardSuit} value={cardValue} />
                        })}
                    </div>
                </div>
                <div className="bettingTab">
                    {playerOne ? (
                        <BettingControls props={{
                            globalBettingCap: globalBettingCap,
                            initialChips: player.chips,
                            currentBet: player.currentBet,
                            moves: moves,
                            isTurn: isCurrentPlayer,
                            toggleCurrentPlayer: props.toggleCurrentPlayer,
                            gameId:gameId,
                            username:player.username,
                            highestBet: highestBet
                        }}/>
                    ) : (
                        <ChipsDisplay props={{ initialChips: player.chips, currentBet: player.currentBet }}/>
                    )}
                    <p>Latest Move: {player.latestMove}</p>
                    {(playerOne === true && roundOver === false) && <button onClick={leaveGame}>Leave Game</button>}
                </div>
            </div>
        )
}