import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';


// Initialize Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyBhfcUdNqfZWO2IdBsqiZ7jx1Y9naaa9co",
  authDomain: "mad-terminal-8154f.firebaseapp.com",
  projectId: "mad-terminal-8154f",
  storageBucket: "mad-terminal-8154f.appspot.com",
  messagingSenderId: "126435334074",
  appId: "1:126435334074:web:53880f2d854889878e2f83",
  measurementId: "G-CEBGD4635F"
};

const app = firebase.initializeApp(firebaseConfig);
const database = app.database();

export default function App() {
  const [carData, setCarData] = useState([]);

  useEffect(() => {
    // Fetch car data from Firebase Realtime Database
    const carsRef = database.ref('cars');
    carsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const carArray = Object.values(data);
        setCarData(carArray);
      }
    });

    return () => {
      carsRef.off(); // Unsubscribe from Firebase Realtime Database
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.speed}>{item.speed} mph</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={carData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    marginTop: 8,
  },
  speed: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});
