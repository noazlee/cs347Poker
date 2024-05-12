import React, { useEffect, useState } from "react";
import BettingControls from "./BettingControls";
import Card from "./Card";
import ChipsDisplay from "./ChipsDisplay";
import '../css/playerBoxCards.css';
import '../css/PlayerBox.css';
import { buildImgUrl } from "../utils/utils";

export default function PlayerBox({ player, isPlayerOne, blind, chips, socket}) {
    const [hand, setHand] = useState([]);

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
        const handleDealCards = (data) => {
            console.log(data);
            if (data.playerId === player.userId) {
                setHand(data.hand);
            }
        };

        socket.on('deal-cards', handleDealCards);

        return () => {
            socket.off('deal-cards', handleDealCards);
        };
    }, [socket, player.userId]);

    const blindIcon = getBlindIcon(blind);
    console.log(player)
    return (
            <div className="playerBox">
                <div>
                    <h2>{player.username}</h2>
                    {blindIcon}
                </div>
                <div className="playerCards">
                {hand.map((card, index) => (
                    <Card key={index} isVisible={true} card={card} />
                ))}
            </div>
            {isPlayerOne ? (
                <BettingControls props={{ initialChips: chips, currentBet: 0 }}/>
            ) : (
                <ChipsDisplay props={{ initialChips: chips, currentBet: 0 }}/>
            )}
        </div>
        )
}