// Formatting utilities for Patient IDs and other data

/**
 * Format Patient ID with proper spacing and capitalization
 */
export const formatPatientId = (patientId: string): string => {
  return patientId.toUpperCase().trim();
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
 * Format blood pressure for display
 */
export const formatBloodPressure = (systolic: number, diastolic: number): string => {
  return `${systolic}/${diastolic}`;
};

/**
 * Format weight for display
 */
export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(1)} kg`;
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Format time for display
 */
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Format full name
 */
export const formatFullName = (
  firstName: string,
  middleName: string,
  lastName: string
): string => {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ');
};

/**
 * Format address
 */
export const formatAddress = (
  street: string,
  barangay: string,
  city: string,
  province: string
): string => {
  const parts = [street, barangay, city, province].filter(Boolean);
  return parts.join(', ');
};

/**
 * Format age display
 */
export const formatAge = (age: number, unit: 'years' | 'months' = 'years'): string => {
  return `${age} ${unit}`;
};

/**
 * Format phone number (Philippine format)
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +63 XXX XXX XXXX or 09XX XXX XXXX
  if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('63')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};
