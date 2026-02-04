// Vital signs validation utilities

export interface VitalSigns {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  weight: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate blood pressure values
 */
export const validateBloodPressure = (
  systolic: number,
  diastolic: number
): ValidationResult => {
  const errors: string[] = [];

  // Check if values are positive numbers
  if (isNaN(systolic) || systolic <= 0) {
    errors.push('Systolic blood pressure must be a positive number');
  }
  if (isNaN(diastolic) || diastolic <= 0) {
    errors.push('Diastolic blood pressure must be a positive number');
  }

  // Reasonable range checks (30-300 mmHg)
  if (systolic < 30 || systolic > 300) {
    errors.push('Systolic blood pressure should be between 30 and 300 mmHg');
  }
  if (diastolic < 30 || diastolic > 200) {
    errors.push('Diastolic blood pressure should be between 30 and 200 mmHg');
  }

  // Systolic should be greater than diastolic
  if (systolic <= diastolic) {
    errors.push('Systolic pressure must be greater than diastolic pressure');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate weight value
 */
export const validateWeight = (weight: number): ValidationResult => {
  const errors: string[] = [];

  if (isNaN(weight) || weight <= 0) {
    errors.push('Weight must be a positive number');
  }

  // Reasonable range check (1-300 kg)
  if (weight < 1 || weight > 300) {
    errors.push('Weight should be between 1 and 300 kg');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate all vital signs
 */
export const validateVitalSigns = (vitals: VitalSigns): ValidationResult => {
  const bpValidation = validateBloodPressure(
    vitals.bloodPressureSystolic,
    vitals.bloodPressureDiastolic
  );
  const weightValidation = validateWeight(vitals.weight);

  const allErrors = [...bpValidation.errors, ...weightValidation.errors];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

/**
 * Get blood pressure classification
 */
export const getBloodPressureCategory = (
  systolic: number,
  diastolic: number
): string => {
  if (systolic < 120 && diastolic < 80) {
    return 'Normal';
  } else if (systolic < 130 && diastolic < 80) {
    return 'Elevated';
  } else if (systolic < 140 || diastolic < 90) {
    return 'Stage 1 Hypertension';
  } else if (systolic >= 140 || diastolic >= 90) {
    return 'Stage 2 Hypertension';
  } else if (systolic >= 180 || diastolic >= 120) {
    return 'Hypertensive Crisis';
  }
  return 'Unknown';
};
