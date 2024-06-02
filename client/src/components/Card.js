// Displays a card back, or the front given a suit and value.
// Contributors: Ashok Khare, Carlos Flores

import React, { useState } from 'react';
import { cardMap, buildImgUrl } from '../utils/utils';
import '../css/Card.css';

export default function Card({isVisible=false, suit, value}) {
    const [flip, setFlipped] = useState(false);
    setTimeout(() => {
        setFlipped(true);
    }, 200)

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
                <div className='visibleCard'>
                    <div className={"flippableCard " + (flip === true ? "flipped" : "unflipped")}>
                        <div className='cardFront'>
                            <img
                                src={buildImgUrl(`card_pics/${cardMap[`${value}-${suit}`]}`)}
                                alt={`${value} of ${suit}`}
                                width={50}
                                height={70}
                            />
                        </div>
                        <div className='cardBack'>
                            <img
                                src={buildImgUrl('cardback.png')}
                                alt='Facedown playing card'
                                width={50}
                                height={70}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}