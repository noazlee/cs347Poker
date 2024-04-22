import React from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3000', { withCredentials: true, transports: ['websocket', 'polling'] });

const CreateGame = () => {

    const { userId } = useParams();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                setUsername(response.data.username);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };

        fetchUser();
    }, [userId]); 

    const navigate = useNavigate();

    const handleCreateGame = () => {
        socket.emit('create-game', { hostId: username}); 

        socket.on('game-created', (data) => {
            console.log('Game Created: ', data);
            navigate(`/game/${data.gameId}/${data.hostId}`); // Redirecting to a game page, ensure you have a route setup for this
        });
    };

    return (
        <div>
            <h1>Create Game</h1>
            <button onClick={handleCreateGame}>Create New Game</button>
        </div>
    );
};

export default CreateGame;
