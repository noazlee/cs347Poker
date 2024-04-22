import React from 'react';
import { buildImgUrl } from '../utils/utils';

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
                // To Do: Add visible card front depending on the card. Null placeholder for now
                null
            )}
        </div>
    );
}