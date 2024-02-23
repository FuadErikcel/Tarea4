import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';

const CardGame = () => {
  const [cards, setCards] = useState<CardImage[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardImage[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<number>(0);

  interface CardImage {
    uri: number;
    name: string;
  }

  const cardImages: CardImage[] = [
    { uri: require('./images/auba.webp'), name: 'Auba' },
    { uri: require('./images/messi.webp'), name: 'Messi' },
    { uri: require('./images/ronaldo.webp'), name: 'Ronaldo' },
    { uri: require('./images/mbappe.webp'), name: 'Mbappe' },
    { uri: require('./images/neymar.webp'), name: 'Neymar' },
    { uri: require('./images/haaland.webp'), name: 'Haaland' },
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

  const getRandomImages = (): CardImage[] => {
    const selectedImages: CardImage[] = [];
    const availableImages = [...cardImages];
    while (selectedImages.length < 6 && availableImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      const randomImage = availableImages.splice(randomIndex, 1)[0];
      selectedImages.push(randomImage);
    }
    return selectedImages;
  };

  const shuffleArray = (array: any[]): any[] => {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardPress = (index: number): void => {
    if (flippedCards.length < 2 && !flippedCards.includes(index)) {
      const newFlippedCards: number[] = [...flippedCards, index];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setAttempts(attempts + 1);
        checkForMatch(newFlippedCards);
      }
    }
  };

  const checkForMatch = (flipped: number[]): void => {
    if (flipped.length === 2) {
      const [index1, index2] = flipped;
      if (cards[index1] && cards[index2] && cards[index1].name === cards[index2].name) {
        setSelectedCards([...selectedCards, cards[index1]]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const renderCard = (image: CardImage, index: number) => {
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
      <TouchableOpacity key={index} onPress={() => {handleCardPress(index); flipCard();}}>
        <Animated.View
          style={[
            styles.cardContainer,
            { transform: [{ rotateY: rotation }] }
          ]}
        >
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <Image source={image.uri} style={styles.cardImage} />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cards.map((image, index) => renderCard(image, index))}
      </View>
      {selectedCards.length === 6 &&
        <View style={styles.container}>
          <Text style={styles.winnerText}>¡Felicidades, has ganado!</Text>
          <Text style={styles.attemptsText}>Número de intentos: {attempts}</Text>
        </View>
      }
    </View>
  );
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
