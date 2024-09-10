import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBxx7sMlWZeP7nAtvFe5-1ZxlSoiLmPtDs",
  authDomain: "shoping-website-7be8d.firebaseapp.com",
  databaseURL: "https://shoping-website-7be8d-default-rtdb.firebaseio.com",
  projectId: "shoping-website-7be8d",
  storageBucket: "shoping-website-7be8d.appspot.com",
  messagingSenderId: "345838195370",
  appId: "1:345838195370:web:a57de8fb1f103a579a36d3",
  measurementId: "G-WYEJHKC2BY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Create providers for Google, GitHub, and Discord
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const discordProvider = new OAuthProvider('discord.com');

export { auth, database, storage, googleProvider, githubProvider, discordProvider };