import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';  
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { fetchPlats, createCommande } from '../services/api';  

const imageMapping = {
  "spaghetti.jpg": require("../img/spaghetti.jpg"),
  "soupe.jpg": require("../img/soupe.jpg"),
  "riz.jpg": require("../img/riz.jpg"),
  "steak.jpg": require("../img/steak.jpg"),
};

const HomeScreen = ({ navigation }) => {
  const [plats, setPlats] = useState([]);
  const [selectedPlat, setSelectedPlat] = useState(null);
  const [quantite, setQuantite] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [panier, setPanier] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserName = () => {
    const user = getAuth().currentUser;
  
    if (!user || !user.email) {
      return null; 
    }
  
    return user.email.split("@")[0]; 
  };
  
  useEffect(() => {
    loadPlats();
  }, []);

  const loadPlats = async () => {
    try {
      const data = await fetchPlats();
      setPlats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur de chargement des plats:', error);
      setPlats([]);
    }
  };

  const handlePlatPress = (plat) => {
    setSelectedPlat(plat);
    setModalVisible(true);
  };

  const ajouterAuPanier = () => {
    const qte = parseInt(quantite);
    if (isNaN(qte) || qte <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer une quantité valide');
      return;
    }

    const itemExiste = panier.find(item => item.id === selectedPlat.id);
    if (itemExiste) {
      setPanier(panier.map(item =>
        item.id === selectedPlat.id ? { ...item, quantite: item.quantite + qte } : item
      ));
    } else {
      setPanier([...panier, { ...selectedPlat, quantite: qte }]);
    }

    setModalVisible(false);
    setQuantite('1');
    Alert.alert('Succès', 'Article ajouté au panier');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../img/logo.png")} style={styles.logo} />
      <Text style={styles.nomUser}>Bonjour , {getUserName()} </Text>
      <Text style={styles.header}>Voici nos Plats</Text>

      <FlatList
        data={plats}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.platItem} onPress={() => handlePlatPress(item)}>
            <Image
              source={imageMapping[item.sprite] || { uri: item.sprite }}
              style={styles.platImage}
            />
            <Text style={styles.platNom}>{item.nom}</Text>
            <Text style={styles.platPrix}>{item.prix} Ar</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
      />

      <TouchableOpacity
        style={styles.panierButton}
        onPress={() => navigation.navigate('Panier', { panier })}
      >
        <Text style={styles.buttonText}>Voir Panier</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panierButtonDeco}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter {selectedPlat?.nom} au panier</Text>
            <TextInput
              style={styles.input}
              value={quantite}
              onChangeText={setQuantite}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.confirmButton} onPress={ajouterAuPanier}>
              <Text style={styles.buttonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#300E66',
    textAlign: 'center',
    marginBottom: 20,
  },
  nomUser: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#300E66',
    textAlign: 'center',
    marginBottom: 20,
  },
  platItem: {
    backgroundColor: '#300E66',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    width: 150,
  },
  platImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  platNom: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  platPrix: {
    fontSize: 14,
    color: '#FF9700',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  panierButton: {
    backgroundColor: '#FF9700',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    width: 200,
    alignItems: 'center',
  },
  panierButtonDeco: {
    backgroundColor: '#300E66',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#300E66',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#300E66',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
});

export default HomeScreen;
