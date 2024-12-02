import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useLeadTypePreferences = () => {
    const [preferences, setPreferences] = useLocalStorage('leadTypePreferences', {
        visibleTypes: ['Purchases', 'Submit Lead Forms', 'Converted Leads', 'Phone Calls', 'Qualified Leads', 'Request Quotes'],
        sortField: 'count',
        sortDirection: 'desc'
    });

    const toggleLeadType = (type: string) => {
        setPreferences(prev => ({
            ...prev,
            visibleTypes: prev.visibleTypes.includes(type)
                ? prev.visibleTypes.filter(t => t !== type)
                : [...prev.visibleTypes, type]
        }));
    };

    return {
        preferences,
        toggleLeadType,
        setPreferences
    };
};