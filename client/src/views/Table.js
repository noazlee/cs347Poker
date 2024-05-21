import React, {useState, useEffect} from 'react';
import PlayerBox from '../components/PlayerBox'
import Deck from '../components/Deck';
import '../css/Table.css'
import { useParams, useLocation } from 'react-router-dom';
import socket from '../socket';
import WinDisplay from '../components/WinDisplay';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    useEffect(() => {
        // Sent from Round.js file. Specificially, it is sent from both "start" and "updatePlayer" functions.
        socket.on('update-round-data', (data) => {
            setRoundData(data.round);
            setRoundOver(false);
        });

        // Sent from inside the game-sockets.js file. Only used for showing notification for players when a player makes a move.
        socket.on('player-action', (data) => {
            toast(`Game updated! Player: ${data.username} Action: ${data.action}`);
        });

        // Sent from round.js file. Specifically, it is sent from the "promptPlayerAction" function.
        socket.on('your-turn', (data) => {
            setPlayerOneCurrent(true);
            setMoves(data.acceptableMoves);
        });

        // Sent from round.js file. Specifically, it is sent from the "start", "dealFlop", "dealTurn", "dealRiver" functions. Used to prompt the client to update the community cards.
        socket.on('shown-cards', (data) => {
            setCommunityCards(data.cards);
        });

        // Sent from round.js file. Specifically, it is sent from the "endRound" function.
        socket.on('round-ended', (data)=>{
            console.log('game ended on client');
            setWinnerData(data);
            setRoundOver(true);
            data.winner.forEach(winnerP=>{
                if(socket.id===winnerP.socketId){ //ensures this is not sent twice
                    console.log('Sending socket emit');
                    socket.emit('round-end-client', {gameId: data.gameId, winner:winnerP, prevIndex: data.prevIndex});
                }  
            })
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
            <div className='table'>
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