
// src/zustand/userPlanStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the state with user plan data
const useUserPlanStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      data: [],
      user: null,
      userPlan: null, // Add userPlan to the state
      setUser: (user) => set(() => ({ user, isLoggedIn: true })),
      clearUser: () => set(() => ({ user: null, isLoggedIn: false })),
      setUserPlan: (planData) => set(() => ({ userPlan: planData })), // Add method to update userPlan
      clearUserPlan: () => set(() => ({ userPlan: null })), // Add method to clear userPlan
    }),
    {
      name: "useUserPlanStore", // Unique name for localStorage
      getStorage: () => localStorage, // Specify localStorage as the storage
    }
  )
);

export default useUserPlanStore;