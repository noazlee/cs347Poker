import { io } from 'socket.io-client';
const acceptedURL  = ['http://10.133.26.36:3001', 'http://localhost:3001']
export const socket = io(acceptedURL, { withCredentials: true, transports: ['websocket', 'polling'] });

