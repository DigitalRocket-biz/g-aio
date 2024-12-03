import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccountSelectionsState {
    selectedAccounts: string[];
    isLSAEnabled: boolean;
    setSelectedAccounts: (accounts: string[]) => void;
    toggleLSA: () => void;
}

export const useAccountSelections = create(
    persist<AccountSelectionsState>(
        (set) => ({
            selectedAccounts: [],
            isLSAEnabled: false,
            setSelectedAccounts: (accounts) => set({ selectedAccounts: accounts }),
            toggleLSA: () => set((state) => ({ isLSAEnabled: !state.isLSAEnabled })),
        }),
        {
            name: 'account-selections',
        }
    )
); 