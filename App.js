import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, set } from 'firebase/database';
import { Platform } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

// Initialize Firebase
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "AIzaSyBhfcUdNqfZWO2IdBsqiZ7jx1Y9naaa9co",
  authDomain: "mad-terminal-8154f.firebaseapp.com",
  projectId: "mad-terminal-8154f",
  storageBucket: "mad-terminal-8154f.appspot.com",
  messagingSenderId: "126435334074",
  appId: "1:126435334074:web:53880f2d854889878e2f83",
  measurementId: "G-CEBGD4635F"
};

if (!firebase.apps.length) {
  initializeApp(firebaseConfig);
}

const database = getDatabase();

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const [result, setResult] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Check the user's OS
    const currentOS = Platform.OS;
    setResult(currentOS);

    // Save OS to Firebase Realtime Database
    const osRef = ref(database, 'os');
    push(osRef, {
      name: currentOS,
    });

    // Save current screen to Firebase Realtime Database
    if (isFocused) {
      const screenRef = ref(database, 'currentScreen');
      push(screenRef, {
        name: 'Dashboard',
      });
    }

    // Retrieve data from Firebase Realtime Database
    const carsRef = ref(database, 'cars');
    const carsListener = onValue(carsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const carList = Object.values(data);
        setCars(carList);
      }
    });

    // Clean up the listener when component unmounts
    return () => {
      off(carsRef, 'value', carsListener);
    };
  }, [isFocused]);

  const setUberMode = (mode) => {
    const uberRef = ref(database, 'uber');
    set(uberRef, mode)
      .then(() => {
        console.log(`Uber mode set to ${mode}`);
      })
      .catch((error) => {
        console.error('Error setting Uber mode:', error);
      });
  };

  const renderCarItem = ({ item }) => (
    <View style={styles.carItem}>
      <Text style={styles.carName}>{item.name}</Text>
      <Text>{item.brand}</Text>
    </View>
  );

  useEffect(() => {
    // Set the Uber mode as driver when the component mounts
    setUberMode('driver');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>{result}</Text>
      <FlatList
        data={cars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </View>
  );
};

const SettingsScreen = () => {
  const isFocused = useIsFocused();

  useEffect(() => {
    // Save current screen to Firebase Realtime Database
    if (isFocused) {
      const screenRef = ref(database, 'currentScreen');
      push(screenRef, {
        name: 'Settings',
      });
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.screenText}>Settings Screen</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  flatList: {
    marginTop: 20,
  },
  carItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  carName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
