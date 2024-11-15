// src/utils/date.ts

import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export function getDateRange(range: string) {
    const today = new Date();
    const days = range === 'last7' ? 7 : range === 'last30' ? 30 : 90;

    return {
        start: startOfDay(subDays(today, days)),
        end: endOfDay(today)
    };
}

export function formatDate(date: Date | string) {
    return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateTime(date: Date | string) {
    return format(new Date(date), 'MMM d, yyyy HH:mm');
}