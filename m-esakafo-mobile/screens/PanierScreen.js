import React, { useState } from 'react'; 
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';  
import { createCommande } from '../services/api'; 

const PanierScreen = ({ route }) => {
  const navigation = useNavigation();
  const [panier, setPanier] = useState(route.params?.panier || []);
  const [loading, setLoading] = useState(false); 

  const getUserId = () => {
    const user = getAuth().currentUser;
    return user ? user.uid : null;  
  };

  const handlePasserCommande = async () => {
    if (panier.length === 0) {
      Alert.alert('Erreur', 'Votre panier est vide');
      return;
    }

    try {
      setLoading(true); 
      const userId = getUserId();  
      if (!userId) {
        Alert.alert('Erreur', 'Vous devez être connecté pour passer une commande');
        return;
      }

      const numeroTicket = `T-${Math.floor(Math.random() * 1000)}`;  
      for (let plat of panier) {
        const response = await createCommande(userId, [plat], numeroTicket, plat.quantite);

        if (!response.success) {
          throw new Error('Erreur lors de la création de la commande');
        }
      }

      Alert.alert('Succès', `Commande enregistrée avec le numéro : ${numeroTicket}`);
      setPanier([]);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const augmenterQuantite = (index) => {
    setPanier((prevPanier) => 
      prevPanier.map((plat, i) => 
        i === index ? { ...plat, quantite: plat.quantite + 1 } : plat
      )
    );
  };
  
  const diminuerQuantite = (index) => {
    setPanier((prevPanier) =>
      prevPanier
        .map((plat, i) => 
          i === index ? { ...plat, quantite: plat.quantite - 1 } : plat
        )
        .filter((plat) => plat.quantite > 0)
    );
  };
  

  const supprimerPlat = (index) => {
    const newPanier = panier.filter((_, i) => i !== index);
    setPanier(newPanier);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nom} x {item.quantite}</Text>
      <Text style={styles.itemPrice}>{item.prix} Ar</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => augmenterQuantite(index)} style={styles.quantityButton}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => diminuerQuantite(index)} style={styles.quantityButton}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => supprimerPlat(index)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={require('../img/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Votre Panier</Text>
      <FlatList
        data={panier}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity 
        style={styles.commandeButton} 
        onPress={handlePasserCommande}
        disabled={loading} 
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
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#300E66',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FF9700',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#300E66',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  commandeButton: {
    backgroundColor: '#300E66',
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
