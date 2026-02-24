import { create } from 'zustand';

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    setUser: (user) => set({ user }),
    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
            set({ token, isAuthenticated: true });
        } else {
            localStorage.removeItem('token');
            set({ token: null, isAuthenticated: false });
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));
