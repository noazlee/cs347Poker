export const cardMap = {
    "A-Hearts": "ace3.png",
    "A-Clubs": "ace1.png",
    "A-Spades": "ace2.png",
    "A-Diamonds": "ace4.png",
    "2-Hearts": "two3.png",
    "2-Clubs": "two1.png",
    "2-Spades": "two2.png",
    "2-Diamonds": "two4.png",
    "3-Hearts": "three2.png",
    "3-Clubs": "three4.png",
    "3-Spades": "three3.png",
    "3-Diamonds": "three1.png",
    "4-Hearts": "four3.png",
    "4-Clubs": "four1.png",
    "4-Spades": "four2.png",
    "4-Diamonds": "four4.png",
    "5-Hearts": "five2.png",
    "5-Clubs": "five4.png",
    "5-Spades": "five3.png",
    "5-Diamonds": "five1.png",
    "6-Hearts": "six2.png",
    "6-Clubs": "six4.png",
    "6-Spades": "six3.png",
    "6-Diamonds": "six1.png",
    "7-Hearts": "seven3.png",
    "7-Clubs": "seven1.png",
    "7-Spades": "seven2.png",
    "7-Diamonds": "seven4.png",
    "8-Hearts": "eight2.png",
    "8-Clubs": "eight4.png",
    "8-Spades": "eight3.png",
    "8-Diamonds": "eight1.png",
    "9-Hearts": "nine2.png",
    "9-Clubs": "nine4.png",
    "9-Spades": "nine3.png",
    "9-Diamonds": "nine1.png",
    "10-Hearts": "ten3.png",
    "10-Clubs": "ten1.png",
    "10-Spades": "ten2.png",
    "10-Diamonds": "ten4.png",
    "J-Hearts": "jack3.png",
    "J-Clubs": "jack2.png",
    "J-Spades": "jack1.png",
    "J-Diamonds": "jack4.png",
    "Q-Hearts": "queen2.png",
    "Q-Clubs": "queen3.png",
    "Q-Spades": "queen1.png",
    "Q-Diamonds": "queen4.png",
    "K-Hearts": "king2.png",
    "K-Clubs": "king3.png",
    "K-Spades": "king1.png",
    "K-Diamonds": "king4.png",
}

export function buildImgUrl(imgName) {
    const url = process.env.PUBLIC_URL + '/images/' + imgName
    return url;
}