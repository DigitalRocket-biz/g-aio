import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
    selectedAccounts: string[];
    dateRange: string;
}

interface SettingsStore extends Settings {
    updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettings = create<SettingsStore>()(
    persist(
        (set) => ({
            selectedAccounts: [],
            dateRange: 'TODAY',
            updateSettings: (newSettings) => set((state) => ({
                ...state,
                ...newSettings,
            })),
        }),
        {
            name: 'user-settings',
        }
    )
);
