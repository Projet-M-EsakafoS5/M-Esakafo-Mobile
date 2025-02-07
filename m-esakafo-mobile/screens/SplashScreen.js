import React, { useEffect } from 'react';
import { View, Text, ImageBackground, ActivityIndicator, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../img/load-image.jpg')} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.text}>
          Commandez vos plats préférés en quelques clics et savourez des moments gourmands directement chez vous !
        </Text>
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
});

export default SplashScreen;
