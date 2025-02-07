import React, { useEffect } from 'react'; 
import { Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen'; 
// import { messaging } from './firebase'; // Importation de Firebase Messaging
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import PanierScreen from './screens/PanierScreen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

// // Création du stack de navigation
  const Stack = createNativeStackNavigator();

// // 🔹 Fonction pour s'inscrire aux notifications et obtenir un token FCM
// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     // Demande la permission pour les notifications
//     const authStatus = await messaging.requestPermission();
//     const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (!enabled) {
//       Alert.alert('Erreur', 'Permission de notification refusée');
//       return;
//     }
//   }

//   // Récupère le token FCM
//   token = await messaging.getToken();
//   console.log("📲 Token FCM:", token);

//   // Enregistre le token FCM sur ton serveur
//   await fetch('http://192.168.88.14:8000/store-fcm-token', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ fcm_token: token })
//   });

//   return token;
// }

export default function App() {
  // useEffect(() => {
  //   // 🔹 Inscription aux notifications au démarrage
  //   registerForPushNotificationsAsync();

  //   // 🔹 Écouteur pour afficher les notifications reçues
  //   messaging.onMessage(async remoteMessage => {
  //     console.log("Notification reçue en premier plan:", remoteMessage);
  //     Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
  //   });

  //   // 🔹 Écouteur pour les notifications lorsque l'application est en arrière-plan ou terminée
  //   messaging.onNotificationOpenedApp(remoteMessage => {
  //     console.log("Notification ouverte en arrière-plan:", remoteMessage);
  //   });

  //   // 🔹 Si l'application est fermée et ouverte via une notification
  //   messaging.getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log("Notification ouverte au démarrage:", remoteMessage);
  //       }
  //     });

  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
          // options={{
          //   headerShown: true,
          //   title: 'M-Esakafo',
          //   headerTitleAlign: 'center',
          // }}
        />
        <Stack.Screen 
          name="Panier" 
          component={PanierScreen}
          options={{ title: 'Ma Commande' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
