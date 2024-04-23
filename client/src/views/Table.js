import React from 'react';
import PlayerBox from '../components/PlayerBox'

export default function Table() {
    return (
        <>
            <PlayerBox isPlayerOne={true}/>
            <PlayerBox isPlayerOne={false}/>
        </>
    );
}