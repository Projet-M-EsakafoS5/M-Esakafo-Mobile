import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';  // Importer pour récupérer l'utilisateur connecté
import { createCommande } from '../services/api'; // Importer la fonction createCommande

const PanierScreen = ({ route }) => {
  const navigation = useNavigation();
  const [panier, setPanier] = useState(route.params?.panier || []);
  const [loading, setLoading] = useState(false); // État pour gérer le chargement

  // Fonction pour récupérer l'ID de l'utilisateur connecté
  const getUserId = () => {
    const user = getAuth().currentUser;
    return user ? user.uid : null;  // Retourner l'ID si l'utilisateur est connecté, sinon null
  };

  const handlePasserCommande = async () => {
    if (panier.length === 0) {
      Alert.alert('Erreur', 'Votre panier est vide');
      return;
    }

    try {
      setLoading(true); // Afficher le chargement pendant l'appel API
      const userId = getUserId();  // Récupérer l'ID de l'utilisateur connecté
      console.log(userId);
      if (!userId) {
        Alert.alert('Erreur', 'Vous devez être connecté pour passer une commande');
        return;
      }

      // Générer un ticket pour la commande
      const numeroTicket = `T-${Math.floor(Math.random() * 1000)}`;  // Exemple de génération de ticket

      // Passer chaque plat un par un dans le panier
      for (let plat of panier) {
        const quantite = plat.quantite; // Quantité du plat à commander

        // Appeler l'API pour chaque plat
        const response = await createCommande(userId, [plat], numeroTicket, quantite);

        if (response.success) {
          console.log('Commande créée pour le plat:', plat.nom);
        } else {
          throw new Error('Erreur lors de la création de la commande');
        }
      }

      // Si toutes les commandes ont été passées avec succès
      Alert.alert('Succès', `Votre commande a été enregistrée avec le numéro de ticket : ${numeroTicket}`);
      setPanier([]); // Vider le panier après la commande
      navigation.goBack(); // Retourner à l'écran précédent

    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création de la commande');
      console.error(error);
    } finally {
      setLoading(false); // Arrêter le chargement une fois l'API terminée
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nom} x {item.quantite}</Text>
      <Text style={styles.itemPrice}>{item.prix} Ar</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Votre Panier</Text>
      <FlatList
        data={panier}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity 
        style={styles.commandeButton} 
        onPress={handlePasserCommande}
        disabled={loading} // Désactiver le bouton pendant le chargement
      >
        <Text style={styles.buttonText}>{loading ? 'En cours...' : 'Passer la commande'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  commandeButton: {
    backgroundColor: '#00C851',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PanierScreen;
