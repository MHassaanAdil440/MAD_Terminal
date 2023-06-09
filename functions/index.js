// const setUberMode = async (mode) => {
//   const cloudFunctionURL = 'https://your-project-name.cloudfunctions.net/setUberMode';

//   try {
//     const response = await fetch(`${cloudFunctionURL}?mode=${mode}`);
//     const result = await response.text();
//     console.log(result);
//   } catch (error) {
//     console.error('Error setting Uber mode:', error);
//   }
// };

// // Call the function to set the Uber mode without any user interaction
// setUberMode('driver'); // Replace 'driver' with the desired mode
const setUberMode = async (mode) => {
    const cloudFunctionURL = 'https://your-project-name.cloudfunctions.net/setUberMode';
  
    try {
      const response = await fetch(`${cloudFunctionURL}?mode=${mode}`);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error('Error setting Uber mode:', error);
    }
  };
  
  // Call the function to set the Uber mode without any user interaction
  setUberMode('driver'); // Replace 'driver' with the desired mode
  