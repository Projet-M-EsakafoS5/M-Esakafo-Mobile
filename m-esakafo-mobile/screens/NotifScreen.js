import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from 'react-native';  
import { fetchCommandesTerminees } from '../services/api'; 
import { getAuth } from "firebase/auth";

const NotifScreen = () => {
    const [commandesTerminees, setCommandesTerminees] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const getCommandes = async () => {
            if (user) {
                const data = await fetchCommandesTerminees(user.uid);
                setCommandesTerminees(data);
            }
        };

        getCommandes();
    }, [user]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notifications</Text> 
            {commandesTerminees.length > 0 ? (
                <FlatList 
                    data={commandesTerminees}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.itemText}>{item.message}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Text style={styles.noNotif}>Aucune commande terminée.</Text>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#300E66",
        color: "white",
        flex: 1,
        justifyContent: 'flex-start',  
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,  
    },
    title: {
        color: "#FF9700",
        fontSize: 35,
        marginTop: 100,
        fontWeight: "bold",
        marginBottom: 20,  
    },
    listContainer: {
        paddingBottom: 20,  
    },
    item: {
        marginLeft:20,
        backgroundColor: "white",
        color: "#300E66",
        padding: 10,
        marginVertical: 10,
        width: "80%",
        borderRadius: 5,
        alignItems: 'center',
    },
    itemText: {
        color: "#300E66",
        fontSize: 18,
        fontWeight: "bold",
    },
    noNotif: {
        color: "#FF9700",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default NotifScreen;