// Global state variable for the LED status
let ledState = false;

// Helper function to get the current path from the URL
function getCurrentPath() {
  return window.location.pathname;
}

// Function to handle URL changes and update the checkbox and bulb color
function handleUrlChange() {
  const path = getCurrentPath();

  // Update checkbox state and bulb color based on the current URL path
  if (path === '/on') {
    setCheckboxState(true);
    setBulbColor('#fff');  // Turn on the bulb (white color)
  } else if (path === '/off') {
    setCheckboxState(false);
    setBulbColor('#5a5a5a');  // Turn off the bulb (grey color)
  }
}

// Function to set the checkbox state
function setCheckboxState(state) {
  const checkbox = document.querySelector('.switch input');
  checkbox.checked = state;
}

// Function to change the bulb color by setting a CSS variable
function setBulbColor(color) {
  document.documentElement.style.setProperty('--light-bulb-color', color);
}

// Function to update the URL without reloading the page
function updateUrl(newPath) {
  history.pushState(null, '', newPath);
  handleUrlChange();
}

// Function to handle the checkbox change (to trigger actions when toggled)
function handleCheckboxChange() {
  const checkbox = document.querySelector('.switch input');
  const action = checkbox.checked ? '/on' : '/off';
  updateUrl(action);
  toggleLED(checkbox.checked);
}

// Function to toggle the LED by sending a GET request to the server
async function toggleLED(state) {
  ledState = state;
  try {
    const response = await fetch(`/${state ? 'on' : 'off'}`, {
      method: 'GET',
    });

    if (response.ok) {
      console.log(`LED ${state ? 'on' : 'off'} successfully.`);
    } else {
      console.error(`Failed to toggle LED to ${state ? 'on' : 'off'}.`);
    }
  } catch (error) {
    console.log('Error toggling LED:', error);
  }
}

// Initialize the page by handling URL and setting up event listeners
function initializePage() {
  // Handle URL change and initialize checkbox and bulb state
  handleUrlChange();

  // Event listener for the checkbox state change
  const checkbox = document.querySelector('.switch input');
  checkbox.addEventListener('change', handleCheckboxChange);

  // Event listeners for the "ON" and "OFF" buttons
  document.getElementById('onButton').addEventListener('click', (event) => {
    event.preventDefault();
    updateUrl('/on');
    toggleLED(true);
  });

  document.getElementById('offButton').addEventListener('click', (event) => {
    event.preventDefault();
    updateUrl('/off');
    toggleLED(false);
  });
}

// Initialize the page on load and when the URL changes
window.addEventListener('load', initializePage);
window.addEventListener('popstate', handleUrlChange);
// Constants
// const LED_STATES = Object.freeze({
//   ON: Object.freeze({ path: '/on', color: '#fff', state: true }),
//   OFF: Object.freeze({ path: '/off', color: '#5a5a5a', state: false })
// });

// // Pure utility functions
// const getCurrentPath = () => window.location.pathname;
// const getCheckbox = () => document.querySelector('.switch input');
// const setBulbColor = color => 
//   document.documentElement.style.setProperty('--light-bulb-color', color);
// const updateUrl = path => history.pushState(null, '', path);

// // State derivation
// const deriveStateFromPath = path => 
//   path === LED_STATES.ON.path ? LED_STATES.ON : LED_STATES.OFF;

// // UI updates
// const updateUI = ({ color, state }) => {
//   const checkbox = getCheckbox();
//   checkbox.checked = state;
//   setBulbColor(color);
//   return state; // Return state for composition
// };

// // API interaction
// const toggleLED = state => 
//   fetch(state ? LED_STATES.ON.path : LED_STATES.OFF.path, { method: 'GET' })
//     .then(response => {
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       console.log(`LED ${state ? 'on' : 'off'} successfully`);
//       return state;
//     })
//     .catch(error => {
//       console.error('Error toggling LED:', error);
//       return state;
//     });

// // Event handlers
// const handleStateChange = () => 
//   pipe(
//     getCurrentPath,
//     deriveStateFromPath,
//     updateUI
//   )();

// const handleCheckboxToggle = () => 
//   pipe(
//     () => getCheckbox().checked,
//     state => state ? LED_STATES.ON : LED_STATES.OFF,
//     ({ path, state }) => {
//       updateUrl(path);
//       return state;
//     },
//     toggleLED
//   )();

// const handleButtonClick = state => () => 
//   pipe(
//     () => state ? LED_STATES.ON : LED_STATES.OFF,
//     ({ path, state }) => {
//       updateUrl(path);
//       return state;
//     },
//     toggleLED
//   )();

// // Function composition utility
// const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// // Initialization
// const initialize = () => {
//   const checkbox = getCheckbox();

//   // Event listeners
//   checkbox.addEventListener('change', handleCheckboxToggle);
//   document.getElementById('onButton').addEventListener('click', e => {
//     e.preventDefault();
//     handleButtonClick(true)();
//   });
//   document.getElementById('offButton').addEventListener('click', e => {
//     e.preventDefault();
//     handleButtonClick(false)();
//   });
//   window.addEventListener('load', handleStateChange);
//   window.addEventListener('popstate', handleStateChange);

//   // Initial state
//   handleStateChange();
// };

// // Start the application
// initialize();
