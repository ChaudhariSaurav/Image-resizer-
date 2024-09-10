// src/firebase/userPlanListener.js

import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase'; // Adjust the import path if needed
import useUserPlanStore from '../zustand/userPlanStore';

/**
 * Sets up a real-time listener for the user's plan from Firebase Realtime Database.
 * @param {string} uid - The user's unique ID.
 * @throws {Error} Will throw an error if the user does not exist or if there is an issue with the database.
 */
const listenForUserPlan = (uid) => {
  if (!uid) {
    throw new Error("User ID is required.");
  }

  try {
    // Create a reference to the user's node in the database
    const userRef = ref(database, `users/${uid}`);

    // Set up a listener to be notified of changes
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Default to "Free Plan" if the plan is not specified
        const plan = userData?.plan || "Free Plan";
        
        // Define plan limits
        const planLimits = {
          "Free Plan": 2,
          "Startup Plan": 10,
          "Premium Plan": 1000000,
        };
        
        // Determine the maximum allowed resizes based on the user's plan
        const maxResizes = planLimits[plan] ?? 2; // Default to 2 if plan is not recognized

        // Update Zustand store with the new plan data
        useUserPlanStore.getState().setUserPlan({
          plan,
          maxResizes,
        });
      } else {
        throw new Error(`User with ID ${uid} does not exist.`);
      }
    }, {
      onlyOnce: false, // Ensure the listener stays active
    });

  } catch (error) {
    console.error("Error setting up real-time listener for user plan:", error.message);
    throw new Error("Failed to set up real-time listener for user plan: " + error.message);
  }
};

export { listenForUserPlan };
