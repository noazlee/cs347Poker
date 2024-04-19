/*
THIS FILE WAS CREATED BY NOAH AND ITS PURPOSE IS TO HANDLE SOCKET.IO COMMUNICATION FOR THE GAME.
 */
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
