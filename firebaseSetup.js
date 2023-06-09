const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  // Add your Firebase admin SDK configuration here
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://mad-terminal-8154f-default-rtdb.firebaseio.com/',
});

// Reference to the Firebase Realtime Database
const db = admin.database();

// Function to set the value in Firebase Realtime Database
const setUberMode = (mode) => {
  const ref = db.ref('uberMode');
  ref.set(mode)
    .then(() => {
      console.log('Uber mode successfully set in Firebase');
      process.exit(); // Exit the script after setting the value
    })
    .catch((error) => {
      console.error('Error setting Uber mode in Firebase:', error);
      process.exit(1); // Exit the script with an error code
    });
};

// Call the function to set the Uber mode value
setUberMode('driver'); // Replace 'driver' with 'rider' if needed
