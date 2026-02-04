// Patient ID Generator
// Format: <SERVICE_CODE>-<6-DIGIT SEQUENCE>
// Example: MA-000001, MP-000012, OBP-000004

const COUNTER_STORAGE_KEY = 'patient_id_counters';

interface CounterMap {
  [serviceCode: string]: number;
}

/**
 * Get all counters from localStorage
 */
const getCounters = (): CounterMap => {
  const stored = localStorage.getItem(COUNTER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

/**
 * Save counters to localStorage
 */
const saveCounters = (counters: CounterMap): void => {
  localStorage.setItem(COUNTER_STORAGE_KEY, JSON.stringify(counters));
};

/**
 * Generate a new Patient ID for a specific service
 * @param serviceCode - The service code (e.g., 'MA', 'MP', 'OBP')
 * @returns Patient ID in format: SERVICE_CODE-XXXXXX
 */
export const generatePatientId = (serviceCode: string): string => {
  const counters = getCounters();
  
  // Get current counter for this service, default to 0
  const currentCounter = counters[serviceCode] || 0;
  
  // Increment counter
  const newCounter = currentCounter + 1;
  
  // Update and save
  counters[serviceCode] = newCounter;
  saveCounters(counters);
  
  // Format: Pad with zeros to 6 digits
  const sequenceNumber = newCounter.toString().padStart(6, '0');
  
  return `${serviceCode}-${sequenceNumber}`;
};

/**
 * Generate multiple Patient IDs for multiple services
 * @param serviceCodes - Array of service codes
 * @returns Array of Patient IDs
 */
export const generatePatientIds = (serviceCodes: string[]): string[] => {
  return serviceCodes.map(code => generatePatientId(code));
};

/**
 * Parse a Patient ID to extract service code and sequence
 * @param patientId - Patient ID string (e.g., 'MA-000001')
 * @returns Object with serviceCode and sequence, or null if invalid
 */
export const parsePatientId = (patientId: string): { serviceCode: string; sequence: number } | null => {
  const match = patientId.match(/^([A-Z]+)-(\d{6})$/);
  if (!match) return null;
  
  return {
    serviceCode: match[1],
    sequence: parseInt(match[2], 10),
  };
};

/**
 * Validate if a Patient ID follows the correct format
 * @param patientId - Patient ID to validate
 * @returns true if valid format
 */
export const isValidPatientId = (patientId: string): boolean => {
  return /^[A-Z]+-\d{6}$/.test(patientId);
};

/**
 * Get current counter value for a service (for debugging/admin)
 * @param serviceCode - Service code
 * @returns Current counter value
 */
export const getCurrentCounter = (serviceCode: string): number => {
  const counters = getCounters();
  return counters[serviceCode] || 0;
};

/**
 * Reset counter for a service (admin function)
 * @param serviceCode - Service code to reset
 */
export const resetCounter = (serviceCode: string): void => {
  const counters = getCounters();
  delete counters[serviceCode];
  saveCounters(counters);
};

/**
 * Reset all counters (admin function)
 */
export const resetAllCounters = (): void => {
  localStorage.removeItem(COUNTER_STORAGE_KEY);
};
