import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import useDataStore from "../zustand/userDataStore";
import {
  auth,
  database,
  storage,
  googleProvider,
  githubProvider,
  discordProvider,
} from "../config/firebase";

const registerUser = async (
  email,
  password,
  name,
  dob,
  mobile,
  profileImage,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    const uid = user.uid;
    const profileImageRef = storageRef(
      storage,
      `profileImages/${user.uid}/${profileImage.name}`,
    );
    await uploadBytes(profileImageRef, profileImage);
    const profileImageURL = await getDownloadURL(profileImageRef);

    // Update user profile in Firebase Authentication
    await updateProfile(user, {
      displayName: name,
      photoURL: profileImageURL,
    });

    // Store additional user information in Firebase Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      uid,
      name,
      email,
      mobile,
      dob,
      profileImageURL,
    });

    return user;
  } catch (error) {
    console.error("Error during registration:", error);
    throw new Error(error.message);
  }
};

// Login user with email and password
const userLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    useDataStore.getState().setUser(user);
    window.location.replace("/welcome");
    return user;
  } catch (error) {
    console.error("Error during login:", error);
    if (error.code === "auth/user-not-found") {
      throw new Error("User not found");
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password");
    }
    throw new Error("An error occurred during login. Please try again.");
  }
};

// Handle social media logins and update user profile
const handleSocialLogin = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await updateUserProfile(user);
    useDataStore.getState().setUser(user);
    window.location.replace("/welcome");
    return user;
  } catch (error) {
    console.error(`${provider.constructor.name} login error:`, error);
    throw new Error("An error occurred during social login. Please try again.");
  }
};

// Google login
const GoogleLogin = () => handleSocialLogin(googleProvider);

// GitHub login
const GitHubLogin = () => handleSocialLogin(githubProvider);

// Discord login
const DiscordLogin = () => handleSocialLogin(discordProvider);

// Update user profile and store additional information in Firebase Realtime Database
const updateUserProfile = async (user) => {
  try {
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, {
        name: user.displayName,
        email: user.email,
        isPhoneNumberVisible: true,
        isProfileImageVisible: true,
        phone: user.phoneNumber,
        profileImageURL: user.photoURL,
      });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("An error occurred while updating user profile.");
  }
};

// Sign out user
const userSignOut = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("UserData Storage");
    localStorage.removeItem("isLoggedIn");
    window.location.replace("/");
  } catch (error) {
    console.error("Error during sign out:", error);
    throw new Error("An error occurred during sign out. Please try again.");
  }
};

export {
  userLogin,
  userSignOut,
  GoogleLogin,
  GitHubLogin,
  DiscordLogin,
  registerUser,
};
