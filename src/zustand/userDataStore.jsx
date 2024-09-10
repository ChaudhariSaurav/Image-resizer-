import { create } from "zustand";
import { persist } from "zustand/middleware";

const useDataStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            data: [],
            user: null,
            setUser: (user) => set(() => ({ user, isLoggedIn: true })),
            clearUser: () => set(() => ({ user: null })),
        }),
        {
            name: "UserData Storage",
            localStorage: () => localStorage,
        }
    )
);

export default useDataStore;