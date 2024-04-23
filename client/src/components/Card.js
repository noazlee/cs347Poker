import React from 'react';
import { buildImgUrl } from '../utils/utils';
import '../css/Card.css';

export default function Card ({ isVisible=false, card_data}) {
    return (

        <div className='card'>
            {!isVisible ? (
                <img
                    src={buildImgUrl('cardback.png')}
                    width={25}
                    height={35}
                    alt='Facedown playing card'>
                </img>
            ) : (
                <img
                    src={buildImgUrl('ace1.png')}
                    alt={'Ace of Clubs'}
                    width={25}
                    height={35}
                />
            )}
        </div>
    );
}