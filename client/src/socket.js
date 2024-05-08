import { io } from 'socket.io-client';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const url = isLocal ? 'http://localhost:3000' : 'http://10.133.26.36:3000';

export const socket = io(url, { withCredentials: true, transports: ['websocket', 'polling'] });
