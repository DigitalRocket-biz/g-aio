import { useLocalStorage } from './useLocalStorage';

export type SortDirection = 'asc' | 'desc';

export interface SortPreference<T> {
    field: T;
    direction: SortDirection;
}

export function useSortPreferences<T extends string>() {
    const [sortPreference, setSortPreference] = useLocalStorage<SortPreference<T>>(
        'campaign-table-sort',
        { field: 'cost' as T, direction: 'desc' }
    );

    const toggleSort = (field: T) => {
        setSortPreference((prev: SortPreference<T>) => ({
            field,
            direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    return { sortPreference, toggleSort };
}