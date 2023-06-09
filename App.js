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
  const [lastKey, setLastKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    setIsLoading(true);

    let query = database.ref('cars').orderByKey();
    if (lastKey) {
      query = query.startAfter(String(lastKey));
    }

    query.limitToFirst(10).once('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const carArray = Object.values(data);
        const newLastKey = carArray[carArray.length - 1].key;
        setCarData((prevData) => [...prevData, ...carArray]);
        setLastKey(newLastKey);
      }
      setIsLoading(false);
      setIsFetching(false);
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.name}>{item.key}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.speed}>{item.speed} mph</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MAD TERMINAL</Text>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={carData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key.toString()}
          ListFooterComponent={isFetching && <Text style={styles.loadingText}>Loading more...</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F6F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#212A3E',
    marginTop: 50,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
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
