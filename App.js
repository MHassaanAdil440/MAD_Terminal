import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { Platform } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

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

const App = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Check the user's OS
    const currentOS = Platform.OS;
    setResult(currentOS);

    // Save OS to Firebase Realtime Database
    const osRef = ref(database, 'os');
    push(osRef, {
      name: currentOS,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>{result ? {result} : 'Failure'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
