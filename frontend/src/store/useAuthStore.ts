import { create } from 'zustand';

interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    streak?: { currentStreak: number; rhythmScore: number; longestStreak: number; avgReasoningScore?: number };
    stats?: { bugsFixed: number, reposHelped: number };
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setLoading: (isLoading) => set({ isLoading }),
}));
