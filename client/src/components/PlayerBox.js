import React, { useEffect, useState } from "react";
import BettingControls from "./BettingControls";
import Card from "./Card";
import ChipsDisplay from "./ChipsDisplay";
import '../css/playerBoxCards.css';
import '../css/PlayerBox.css';
import { buildImgUrl } from "../utils/utils";
import axios from 'axios';

export default function PlayerBox({ player, playerOne, isCurrentPlayer = false, blind }) {
    const [playerName, setPlayerName] = useState('Loading...');
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

    useEffect(() => {
        const getPlayerName = async (playerId) => {
            await axios.get(`/api/users/${playerId}`).then((res) => {setPlayerName(res.data.username)})
        }
        getPlayerName(player.userId)
    }, [player.userId]);

    return (
            <div className="playerBox">
                <div>
                    <h2>{playerName}</h2>
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
                    <BettingControls props={{ initialChips: player.chips, currentBet: player.currentBet }}/>
                ) : (
                    <ChipsDisplay props={{ initialChips: player.chips, currentBet: player.currentBet }}/>
                )}
            </div>
        )
}