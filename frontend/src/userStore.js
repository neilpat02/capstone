import { writable } from 'svelte/store';

// Initialize the stores with values from localStorage if available
export const userEmail = writable(localStorage.getItem('userEmail') || "");
export const team = writable(""); // No changes here unless you want to persist the team similarly
export const userToken = writable(localStorage.getItem('jwtToken') || "");

// Subscribe to changes in userEmail and userToken to update localStorage accordingly
userEmail.subscribe($userEmail => {
  if ($userEmail) {
    localStorage.setItem('userEmail', $userEmail);
  } else {
    localStorage.removeItem('userEmail');
  }
});

userToken.subscribe($userToken => {
  if ($userToken) {
    localStorage.setItem('jwtToken', $userToken);
  } else {
    localStorage.removeItem('jwtToken');
  }
});

// Function to set both token and email in local storage and Svelte store
export function setToken(token, email) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userEmail', email);
    userToken.set(token);
    userEmail.set(email);
}

// Function to clear token and email from both localStorage and Svelte store
export function clearToken() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userEmail');
    userToken.set("");
    userEmail.set("");
}
