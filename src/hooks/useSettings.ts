// src/hooks/useSettings.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
    theme: 'light' | 'dark';
    refreshInterval: number;
    autoRefresh: boolean;
    notifications: boolean;
    selectedAccounts: string[];
    dateRange: string;
}

interface SettingsState extends Settings {
    updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettings = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'dark',
            refreshInterval: 300000,
            autoRefresh: true,
            notifications: true,
            selectedAccounts: [],
            dateRange: 'TODAY',
            updateSettings: (newSettings) => set((state) => ({
                ...state,
                ...newSettings
            }))
        }),
        {
            name: 'settings-store'
        }
    )
);