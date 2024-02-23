import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';

const CardGame = () => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const cardImages = [
    require('./images/auba.webp'),
    require('./images/messi.webp'),
    require('./images/ronaldo.webp'),
    require('./images/mbappe.webp'),
    require('./images/neymar.webp'),
    require('./images/haaland.webp'),
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const selectedImages = getRandomImages();
    const doubledImages = [...selectedImages, ...selectedImages];
    const shuffledImages = shuffleArray(doubledImages);
    setCards(shuffledImages);
  };

  const getRandomImages = () => {
    const selectedIndexes = [];
    while (selectedIndexes.length < 6) {
      const randomIndex = Math.floor(Math.random() * cardImages.length);
      if (!selectedIndexes.includes(randomIndex)) {
        selectedIndexes.push(randomIndex);
      }
    }
    return selectedIndexes.map(index => cardImages[index]);
  };

  const shuffleArray = array => {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardPress = index => {
    if (flippedCards.length < 2 && !flippedCards.includes(index)) {
      const newFlippedCards = [...flippedCards, index];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setAttempts(attempts + 1);
        setTimeout(checkForMatch, 1000);
      }
    }
  };

  const checkForMatch = () => {
    const [index1, index2] = flippedCards;
    if (cards[index1] === cards[index2]) {
      setSelectedCards([...selectedCards, cards[index1]]);
      setFlippedCards([]);
    } else {
      setFlippedCards([]);
    }
  };

  const renderCard = (image, index) => {
    const isFlipped = flippedCards.includes(index) || selectedCards.includes(image);
    const rotation = isFlipped ? '180deg' : '0deg';
    const flipAnimation = new Animated.Value(isFlipped ? 1 : 0);

    const rotateY = flipAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const frontInterpolate = flipAnimation.interpolate({
      inputRange: [0, 0.5, 0.5, 1],
      outputRange: ['0deg', '90deg', '-90deg', '0deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
      inputRange: [0, 0.5, 0.5, 1],
      outputRange: ['0deg', '90deg', '-90deg', '0deg'],
    });

    const frontAnimatedStyle = {
      transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
      transform: [{ rotateY: backInterpolate }],
    };

    const flipCard = () => {
      Animated.timing(flipAnimation, {
        toValue: isFlipped ? 0 : 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity key={index} onPress={() => handleCardPress(index)}>
        <Animated.View
          style={[
            styles.cardContainer,
            { transform: [{ rotateY: rotation }] }
          ]}
        >
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            <Image source={require('./images/cardBack.png')} style={styles.cardImage} />
          </Animated.View>
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <Image source={image} style={styles.cardImage} />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderGameScreen = () => {
    return (
      <View style={styles.container}>
        <View style={styles.grid}>
          {cards.map((image, index) => renderCard(image, index))}
        </View>
      </View>
    );
  };

  const renderWinnerScreen = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.winnerText}>¡Felicidades, has ganado!</Text>
        <Text style={styles.attemptsText}>Número de intentos: {attempts}</Text>
      </View>
    );
  };

  return selectedCards.length === 6 ? renderWinnerScreen() : renderGameScreen();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardContainer: {
    width: 80,
    height: 120,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  attemptsText: {
    fontSize: 18,
  },
});

export default CardGame;
