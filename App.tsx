import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';

const CardGame = () => {
  const [cards, setCards] = useState<CardImage[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardImage[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<number>(0);

  interface CardImage {
    uriFront: number;
    uriBack: number;
    name: string;
  }

  const cardImages: CardImage[] = [
    { uriFront: require('./images/auba.webp'), uriBack: require('./images/back.png'), name: 'Auba' },
    { uriFront: require('./images/messi.webp'), uriBack: require('./images/back.png'), name: 'Messi' },
    { uriFront: require('./images/ronaldo.webp'), uriBack: require('./images/back.png'), name: 'Ronaldo' },
    { uriFront: require('./images/mbappe.webp'), uriBack: require('./images/back.png'), name: 'Mbappe' },
    { uriFront: require('./images/neymar.webp'), uriBack: require('./images/back.png'), name: 'Neymar' },
    { uriFront: require('./images/haaland.webp'), uriBack: require('./images/back.png'), name: 'Haaland' },
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
    if (!flippedCards.includes(index)) {
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
    const flipAnimation = new Animated.Value(isFlipped ? 1 : 0);
    const rotateY = flipAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

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
            { transform: [{ rotateY: rotateY }] }
          ]}
        >
          <Image source={isFlipped ? image.uriFront : image.uriBack} style={styles.cardImage} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewLogo}>
        <Image source={require('./images/ealogo.png')} style={{ width: 200, height: 200, resizeMode: 'contain' }}/>
      </View>
      <View style={styles.grid}>
        {cards.map((image, index) => renderCard(image, index))}
      </View>
      {selectedCards.length === 6 &&
        <View style={styles.bottomView}>
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
    backgroundColor: '#1b1e29',
    
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
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    top: 40,
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#fff'
  },
  attemptsText: {
    fontSize: 18,
    color:'#fff'
  },
  viewLogo:{
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center', 
  },
  bottomView: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    backgroundColor: '#1b1e29', 
    alignItems: 'center', 
    justifyContent: 'center',
  },

});

export default CardGame;
