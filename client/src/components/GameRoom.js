import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust the URL to match your server

function GameRoom() {
  useEffect(() => {
    // Listen for events
    socket.on('game-update', (data) => {
      // Handle game update
    });

    // Clean up on unmount
    return () => {
      socket.off('game-update');
      socket.disconnect();
    };
  }, []);

  // Emit events as a result of some user action or other events
  const handleJoinGame = () => {
    socket.emit('join-game', { gameId: '123' });
  };

  return (
    <div>
      <h1>Game Room</h1>
      <button onClick={handleJoinGame}>Join Game</button>
      {/* Render game room UI */}
    </div>
  );
}

export default GameRoom;