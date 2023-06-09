import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Modal,
  TextInput,
  Platform,
  Button,
  Dimensions,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [carData, setCarData] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [osName, setOsName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    fetchCars();

    // Add event listener for Back button press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // Cleanup the event listener on component unmount
    return () => backHandler.remove();
  }, []);

  const fetchCars = () => {
    setIsLoading(true);

    let query = database.ref("cars").orderByKey();
    if (lastKey) {
      query = query.startAfter(String(lastKey));
    }

    query.limitToFirst(10).once("value", (snapshot) => {
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

  const handleItemPress = () => {
    navigation.navigate("Dashboard");
  };

  const handleBackPress = () => {
    // Kill the app instead of going back
    BackHandler.exitApp();
    return true;
  };

  const handleCheckOS = () => {
    const os = Platform.OS;
    setOsName(os);
  };

  const storeOSName = (name) => {
    // Get a reference to the "osNames" node in the database
    const osNamesRef = database.ref("osNames");

    // Push a new entry with the OS name to the database
    osNamesRef.push(name, (error) => {
      if (error) {
        // Handle the error
        console.log("Failed to save OS name:", error);
      } else {
        // OS name saved successfully
        setModalText("Saved");
        setModalVisible(true);
      }
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={handleItemPress}>
      <Text style={styles.name}>{item.key}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.speed}>{item.speed} mph</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MAD TERMINAL</Text>
      <Text>Your OS: {osName}</Text>
      <Button title="Check My OS" onPress={handleCheckOS} />
      <Modal visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{modalText}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={carData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key.toString()}
          ListFooterComponent={
            isFetching && (
              <Text style={styles.loadingText}>Loading more...</Text>
            )
          }
        />
      )}
    </View>
  );
};

const DashboardScreen = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    // Kill the app instead of going back
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    // Add event listener for Back button press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // Cleanup the event listener on component unmount
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      <TouchableOpacity style={styles.button} onPress={handleBackPress}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F6F9",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#212A3E",
    marginTop: 50,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    marginTop: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    marginTop: 8,
  },
  speed: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#212A3E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    width: windowWidth * 0.4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
