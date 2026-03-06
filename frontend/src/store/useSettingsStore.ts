import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemePreference = 'dark' | 'light' | 'system';
type LayoutPreference = 'standard' | 'compact';
type EditorFontSize = 12 | 13 | 14 | 16 | 18;

interface SettingsState {
    theme: ThemePreference;
    layout: LayoutPreference;
    editorFontSize: EditorFontSize;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    setTheme: (theme: ThemePreference) => void;
    setLayout: (layout: LayoutPreference) => void;
    setEditorFontSize: (size: EditorFontSize) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'dark', // Default to Dark Phase 5 per reqs
            layout: 'standard',
            editorFontSize: 14,
            soundEnabled: true,
            notificationsEnabled: true,
            setTheme: (theme) => set({ theme }),
            setLayout: (layout) => set({ layout }),
            setEditorFontSize: (editorFontSize) => set({ editorFontSize }),
            setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
            setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
        }),
        {
            name: 'debughub-user-settings',
        }
    )
);
