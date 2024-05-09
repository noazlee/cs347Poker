import io from 'socket.io-client';

// const acceptedURL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'http://10.133.26.36:3000';
const socket = io('http://localhost:3000', { withCredentials: true, transports: ['websocket', 'polling'] });

export default socket;