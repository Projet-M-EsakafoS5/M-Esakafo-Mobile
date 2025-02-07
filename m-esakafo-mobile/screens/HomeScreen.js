import React, { useState, useEffect } from 'react';
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
  Alert
} from 'react-native';
import { fetchPlats } from '../services/api';

const imageMapping = {
  "spaghetti.jpg": require("../img/spaghetti.jpg"),
  "brochette.jpg": require("../img/brochette.jpg"),
  "frite.jpg": require("../img/frite.jpg"),
  "steak.jpg": require("../img/steak.jpg"),
};

const HomeScreen = ({ navigation }) => {
  const [plats, setPlats] = useState([]);
  const [selectedPlat, setSelectedPlat] = useState(null);
  const [quantite, setQuantite] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [panier, setPanier] = useState([]);

  useEffect(() => {
    loadPlats();
  }, []);

  const loadPlats = async () => {
    try {
      const data = await fetchPlats();
      setPlats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading plats:', error);
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
      <Text style={styles.header}>Nos Plats</Text>
      <FlatList
        data={plats}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.platItem} onPress={() => handlePlatPress(item)}>
            <Image 
              source={imageMapping[item.sprite] || { uri: item.sprite }} // Vérification d'image locale ou distante
              style={styles.platImage} 
            />
            <Text style={styles.platNom}>{item.nom}</Text>
            <Text style={styles.platPrix}>{item.prix} Ar</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity 
        style={styles.panierButton} 
        onPress={() => navigation.navigate('Panier', { panier })}
      >
        <Text style={styles.buttonText}>Voir Panier ({panier.length})</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', margin: 20 },
  platItem: { padding: 15, margin: 10, backgroundColor: '#eee', borderRadius: 10, alignItems: 'center' },
  platImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 10 },
  platNom: { fontSize: 18, fontWeight: 'bold' },
  platPrix: { fontSize: 16, color: '#2ecc71' },
  panierButton: { backgroundColor: '#00C851', padding: 15, borderRadius: 8, margin: 20 },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 20 },
  confirmButton: { backgroundColor: '#00C851', padding: 15, borderRadius: 8 },
});

export default HomeScreen;
