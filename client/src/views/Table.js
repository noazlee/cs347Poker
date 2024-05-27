import React, {useState, useEffect} from 'react';
import PlayerBox from '../components/PlayerBox'
import Deck from '../components/Deck';
import '../css/Table.css'
import { useParams, useLocation } from 'react-router-dom';
import socket from '../socket';
import WinDisplay from '../components/WinDisplay';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buildImgUrl } from '../utils/utils';

export default function Table({ props }) {
    const location = useLocation();
    const hostId = location.state.hostId;
    const [roundData, setRoundData] = useState(undefined);
    const [playerOneCurrent, setPlayerOneCurrent] = useState(false);
    const [moves, setMoves] = useState([]);
    const [communityCards, setCommunityCards] = useState([]);
    const [roundOver, setRoundOver] = useState(false);
    const [winnerData, setWinnerData] = useState(undefined);
    const {gameId, userId} = useParams();
    const [highestBet, setHighestBet] = useState(0);

    const tableStyle = {
        width: '100%',
        height: '100vh',
        backgroundColor: `dark green`,
        backgroundImage: `url(${buildImgUrl('table.png')})`,
        backgroundSize: 'cover',
        border: '2px solid',
        resize: 'both',
        overflow: 'scroll',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        gap: '20px'
    };

    useEffect(() => {
        // Sent from Round.js file. Specificially, it is sent from both "start" and "updatePlayer" functions.
        socket.on('update-round-data', (data) => {
            console.log('updating round data');
            setRoundData(data.round);
            setRoundOver(false);
        });

        socket.on('update-round-data-without-popup', (data) => {
            console.log('updating round data');
            setRoundData(data.round);
        });

        // Sent from inside the game-sockets.js file. Only used for showing notification for players when a player makes a move.
        socket.on('player-action', (data) => {
            toast(`Game updated! Player: ${data.username} Action: ${data.action}`);
        });

        // Sent from round.js file. Specifically, it is sent from the "promptPlayerAction" function.
        socket.on('your-turn', (data) => {
            setPlayerOneCurrent(true);
            setMoves(data.acceptableMoves);
            console.log(data.highestbet);
            setHighestBet(data.highestbet);
        });

        // Sent from round.js file. Specifically, it is sent from the "start", "dealFlop", "dealTurn", "dealRiver" functions. Used to prompt the client to update the community cards.
        socket.on('shown-cards', (data) => {
            setCommunityCards(data.cards);
        });

        // Sent from round.js file. Specifically, it is sent from the "endRound" function.
        socket.on('round-ended', (data)=>{
            console.log('game ended on client');
            setPlayerOneCurrent(false);
            setWinnerData(data);
            setRoundOver(true);
            // if(data.stillPlaying==false){ add end of game display here

            // }
        });

        return () => {
            socket.off('update-round-data');
            socket.off('your-turn');
            socket.off('round-ended');
            socket.off('shown-cards');
        };
    }, []);

    const generatePlayerBoxes = (data) => {
        const currentPlayerId = data.players[data.currentPlayer].userId;
        let smallBlindPlayerId;
        let bigBlindPlayerId;
        let box = 1;

        console.log(`Now playing: Player ${data.currentPlayer}`);

        if (data.players.length >= 2) {
            smallBlindPlayerId = data.players[data.currentSmallBlind].userId;
            bigBlindPlayerId = data.players[(data.currentSmallBlind + 1) % data.players.length].userId;
        } else {
            smallBlindPlayerId = bigBlindPlayerId = undefined;
        }

        return (
            data.players.map((player, index) => {
                let blindStatus = 0;
                if (player.userId === smallBlindPlayerId) {
                    blindStatus = 1;
                } else if (player.userId === bigBlindPlayerId) {
                    blindStatus = 2;
                }

                let isPlayerOne;
                if (player.socketId === socket.id) {
                    isPlayerOne = true;
                } else {
                    isPlayerOne = false;
                }

                return (
                    <section key={index} id={isPlayerOne ? 'Player1-Box' : `Box-${box++}`}>
                        <PlayerBox
                            player={player} 
                            playerOne={isPlayerOne}
                            isCurrentPlayer={playerOneCurrent}
                            blind={blindStatus}
                            moves={moves}
                            highestBet={highestBet}
                            props={{
                                toggleCurrentPlayer: setPlayerOneCurrent
                            }}
                            gameId={gameId}
                            userId={userId}
                            active={player.userId === currentPlayerId ? true : false}
                        />
                    </section>
                )
        }));
    }

    return (
        roundData === undefined ? (
            <p>Loading...</p>
        ) : (
            <div className='table' style={tableStyle}>
                {generatePlayerBoxes(roundData)}
                <section id='deck'>
                    {roundOver === false ? (
                        <Deck props={{communityCards: communityCards, pot: roundData.pot}}/>
                    ) : (
                        <WinDisplay props={{isHost: (hostId === userId ? true : false), data: winnerData}} />
                    )}
                </section>
                <ToastContainer />
            </div>
        )
    );
}