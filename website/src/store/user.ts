import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

export interface User {
    email: string;
    userId: string;
    fullName: string;
}

export interface DecodedToken extends User {
    iat: number;
    exp: number;
}

interface UserStore {
    user: User | null;
    token: string | null;
    setToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<UserStore>()(
    persist(
        (set) => ({
            token: null,
            user: null,

            // Action to set the token on login
            setToken: (token: string) => {
                try {
                    const decodedPayload = jwtDecode<DecodedToken>(token);
                    const user: User = {
                        email: decodedPayload.email,
                        userId: decodedPayload.userId,
                        fullName: decodedPayload.fullName,
                    };

                    set({ token, user });
                } catch (error) {
                    console.error("Failed to decode token:", error);
                    set({ token: null, user: null });
                }
            },

            // Action to clear the token on logout
            logout: () => {
                set({ token: null, user: null });
            },
        }),
        {
            name: "octotokens-auth-storage",
        }
    )
);
