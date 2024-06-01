// Created by Sho Tanaka and Noah Lee - handles the ranking of different combinations of cards

const CARD_RANKS = "23456789TJQKA";
const HAND_RANKS = {
    "High Card": 1,
    "One Pair": 2,
    "Two Pair": 3,
    "Three of a Kind": 4,
    "Straight": 5,
    "Flush": 6,
    "Full House": 7,
    "Four of a Kind": 8,
    "Straight Flush": 9,
    "Royal Flush": 10
};

function getCardRank(card) {
    const rank = card.value;
    const index = CARD_RANKS.indexOf(rank);
    if (index === -1) {
        console.error(`Invalid card rank: ${rank}`);
    }
    return index;
}

function getHandRank(hand) {
    return HAND_RANKS[hand];
}

function evaluateHighCard(cards) {
    console.log(`Evaluating High Card for: ${cards.map(card => card.value + card.suite)}`);
    cards.sort((a, b) => getCardRank(b) - getCardRank(a));
    console.log(`Sorted Cards: ${cards.map(card => card.value + card.suite)}`);
    return {
        hand: "High Card",
        strength: HAND_RANKS["High Card"],
        rank: [getCardRank(cards[0])],
        kicker: cards.slice(1).map(card => getCardRank(card))
    };
}


function evaluateHighCard(cards) {
    console.log(`Evaluating High Card for: ${cards.map(card => card.value + card.suite)}`);
    cards.sort((a, b) => getCardRank(b) - getCardRank(a));
    console.log(`Sorted Cards: ${cards.map(card => card.value + card.suite)}`);
    return {
        hand: "High Card",
        strength: HAND_RANKS["High Card"],
        rank: [getCardRank(cards[0])],
        kicker: cards.slice(1).map(card => getCardRank(card))
    };
}

function evaluateOnePair(cards) {
    console.log(`Evaluating One Pair for: ${cards.map(card => card.value + card.suite)}`);
    const rankCount = {};
    cards.forEach(card => {
        const rank = getCardRank(card);
        rankCount[rank] = (rankCount[rank] || 0) + 1;
    });

    console.log(`Rank Counts: ${JSON.stringify(rankCount)}`);

    const pairs = Object.entries(rankCount).filter(([rank, count]) => count === 2).map(([rank]) => parseInt(rank));
    if (pairs.length === 0) {
        return null;
    }

    pairs.sort((a, b) => b - a);
    const highestPair = pairs[0];

    const remainingCards = cards.filter(card => getCardRank(card) !== highestPair);
    remainingCards.sort((a, b) => getCardRank(b) - getCardRank(a));

    return {
        hand: "One Pair",
        strength: HAND_RANKS["One Pair"],
        rank: [highestPair],
        kicker: remainingCards.slice(0, 3).map(card => getCardRank(card))
    };
}



function evaluateTwoPair(cards) {
    console.log(`Evaluating Two Pair for: ${cards.map(card => card.value + card.suite)}`);
    const rankCount = {};
    cards.forEach(card => {
        const rank = getCardRank(card);
        rankCount[rank] = (rankCount[rank] || 0) + 1;
    });

    console.log(`Rank Counts: ${JSON.stringify(rankCount)}`);

    const pairs = Object.entries(rankCount).filter(([rank, count]) => count === 2).map(([rank]) => parseInt(rank));
    if (pairs.length < 2) {
        return null;
    }

    pairs.sort((a, b) => b - a);
    const highestPair = pairs[0];
    const secondHighestPair = pairs[1];

    const remainingCards = cards.filter(card => getCardRank(card) !== highestPair && getCardRank(card) !== secondHighestPair);
    remainingCards.sort((a, b) => getCardRank(b) - getCardRank(a));

    return {
        hand: "Two Pair",
        strength: HAND_RANKS["Two Pair"],
        rank: [highestPair, secondHighestPair],
        kicker: remainingCards.slice(0, 1).map(card => getCardRank(card))
    };
}


function evaluateHand(playerHand, communityCards) {
    const allCards = playerHand.concat(communityCards);
    console.log(`Evaluating hand with player cards: ${playerHand.map(card => card.value + card.suite)} and community cards: ${communityCards.map(card => card.value + card.suite)}`);
    let bestHand = evaluateHighCard(allCards);

    const onePair = evaluateOnePair(allCards);
    if (onePair && compareHandObjects(onePair, bestHand) > 0) {
        bestHand = onePair;
    }

    const twoPair = evaluateTwoPair(allCards);
    if (twoPair && compareHandObjects(twoPair, bestHand) > 0) {
        bestHand = twoPair;
    }
    console.log(bestHand);
    return bestHand;
}


function compareHandObjects(hand1, hand2) {
    if (hand1.strength !== hand2.strength) {
        return hand2.strength - hand1.strength; // Descending order for sorting
    }

    for (let i = 0; i < hand1.rank.length; i++) {
        if (hand1.rank[i] !== hand2.rank[i]) {
            return hand2.rank[i] - hand1.rank[i]; // Descending order for sorting
        }
    }

    for (let i = 0; i < hand1.kicker.length; i++) {
        if (hand1.kicker[i] !== hand2.kicker[i]) {
            return hand2.kicker[i] - hand1.kicker[i]; // Descending order for sorting
        }
    }

    return 0; // Hands are exactly the same
}

function getBestHands(hands) {
    hands.sort(compareHandObjects);

    const bestHand = hands[0];
    const bestHands = hands.filter(hand => compareHandObjects(hand, bestHand) === 0);

    return bestHands;
}

module.exports = {
    evaluate: evaluateHand,
    compare: compareHandObjects,
    getBestHands: getBestHands
};
