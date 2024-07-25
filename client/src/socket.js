import io from 'socket.io-client';

const acceptedURL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'IP ADDRESS';
const socket = io(acceptedURL, { withCredentials: true, transports: ['websocket', 'polling'] });

export default socket;
