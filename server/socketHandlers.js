const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.info('New client connected:', socket.id);
    
        socket.on('disconnect', () => {
          console.info('Client disconnected');
        });
    
    });
};

module.exports = socketHandler;
