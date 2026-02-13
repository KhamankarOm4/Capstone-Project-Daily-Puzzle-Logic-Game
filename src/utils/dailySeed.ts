import SHA256 from 'crypto-js/sha256';
import dayjs from 'dayjs';

/**
 * Generates a unique, deterministic seed based on the date.
 * @param date Optional date object. Defaults to today.
 * @returns SHA256 hash string of the YYYY-MM-DD date.
 */
export const getDailySeed = (date?: Date | string): string => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    return SHA256(formattedDate).toString();
};

/**
 * Returns the current date formatted as YYYY-MM-DD.
 */
export const getTodayDateString = (): string => {
    return dayjs().format('YYYY-MM-DD');
};
