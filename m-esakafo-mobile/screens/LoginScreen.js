import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, ImageBackground 
} from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in with:', user.email);
      navigation.replace('Home');
    } catch (error) {
      setError('Email ou mot de passe incorrect');
      console.error(error);
    }
  };

  return (
    <ImageBackground 
      source={require('../img/log-in.jpg')} 
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.inputContainer}>          
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',  // Ajuste l’image sans la déformer
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Texte en blanc pour contraster avec le fond
  },
  inputContainer: {
    width: '80%',
    marginTop: 120,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#FF9700',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#FF9700',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#FF9700',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
