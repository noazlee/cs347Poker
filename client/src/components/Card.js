import React from 'react';
import { cardMap, buildImgUrl } from '../utils/utils';
import '../css/Card.css';

export default function Card({isVisible=false, suit, value}) {
    return (
        <div className='card'>
            {!isVisible ? (
                <img
                    src={buildImgUrl('cardback.png')}
                    width={50}
                    height={70}
                    alt='Facedown playing card'>
                </img>
            ) : (
                <img
                    src={buildImgUrl(`card_pics/${cardMap[`${value}-${suit}`]}`)}
                    alt={`${value} of ${suit}`}
                    width={50}
                    height={70}
                />
            )}
        </div>
    );
}