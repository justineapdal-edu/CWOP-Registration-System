// Storage utility for managing localStorage with TypeScript support

export const storage = {
  /**
   * Get item from localStorage
   */
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   */
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Check if key exists in localStorage
   */
  has: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },
};

// Storage keys used throughout the app
export const STORAGE_KEYS = {
  PATIENTS: 'medical_mission_patients',
  VITALS: 'medical_mission_vitals',
  COUNTERS: 'patient_id_counters',
  MISSION_INFO: 'mission_info',
};
