// Patient Context - Manages patient registration and records
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generatePatientIds } from '../config/idGenerator';

export interface PatientRecord {
  id: string; // Internal UUID
  patientIds: string[]; // Array of service-based Patient IDs (e.g., ['MA-000001', 'MP-000002'])
  firstName: string;
  middleName: string;
  lastName: string;
  age: number;
  ageUnit: 'years' | 'months';
  sex: 'Male' | 'Female';
  street: string;
  barangay: string;
  city: string;
  province: string;
  contactNumber: string;
  serviceCodes: string[]; // Array of service codes (e.g., ['MA', 'MP'])
  registrationDate: string; // ISO date string
  registeredBy?: string;
}

interface PatientContextType {
  patients: PatientRecord[];
  addPatient: (patient: Omit<PatientRecord, 'id' | 'patientIds' | 'registrationDate'>) => PatientRecord;
  updatePatient: (id: string, patient: Omit<PatientRecord, 'id' | 'patientIds' | 'registrationDate'>) => PatientRecord | undefined;
  deletePatient: (id: string) => void;
  getPatientByPatientId: (patientId: string) => PatientRecord | undefined;
  getPatientById: (id: string) => PatientRecord | undefined;
  searchPatients: (query: string) => PatientRecord[];
  getAllPatients: () => PatientRecord[];
  clearAllPatients: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    return storage.get<PatientRecord[]>(STORAGE_KEYS.PATIENTS) || [];
  });

  // Save patients to localStorage whenever they change
  useEffect(() => {
    if (patients.length > 0) {
      storage.set(STORAGE_KEYS.PATIENTS, patients);
    }
  }, [patients]);

  const addPatient = (patientData: Omit<PatientRecord, 'id' | 'patientIds' | 'registrationDate'>): PatientRecord => {
    // Generate unique ID for internal tracking
    const id = crypto.randomUUID();
    
    // Generate Patient IDs for each service
    const patientIds = generatePatientIds(patientData.serviceCodes);
    
    const newPatient: PatientRecord = {
      ...patientData,
      id,
      patientIds,
      registrationDate: new Date().toISOString(),
    };

    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, patientData: Omit<PatientRecord, 'id' | 'patientIds' | 'registrationDate'>): PatientRecord | undefined => {
    const existingPatient = patients.find(p => p.id === id);
    if (!existingPatient) return undefined;

    // Regenerate Patient IDs if services changed
    const patientIds = patientData.serviceCodes.length !== existingPatient.serviceCodes.length ||
      !patientData.serviceCodes.every((code, index) => code === existingPatient.serviceCodes[index])
      ? generatePatientIds(patientData.serviceCodes)
      : existingPatient.patientIds;

    const updatedPatient: PatientRecord = {
      ...patientData,
      id,
      patientIds,
      registrationDate: existingPatient.registrationDate,
    };

    setPatients((prev) => prev.map(p => p.id === id ? updatedPatient : p));
    return updatedPatient;
  };

  const deletePatient = (id: string): void => {
    setPatients((prev) => prev.filter(p => p.id !== id));
  };

  const getPatientByPatientId = (patientId: string): PatientRecord | undefined => {
    return patients.find((patient) => patient.patientIds.includes(patientId));
  };

  const getPatientById = (id: string): PatientRecord | undefined => {
    return patients.find((patient) => patient.id === id);
  };

  const searchPatients = (query: string): PatientRecord[] => {
    const lowerQuery = query.toLowerCase();
    return patients.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.middleName} ${patient.lastName}`.toLowerCase();
      const hasMatchingPatientId = patient.patientIds.some(pid => pid.toLowerCase().includes(lowerQuery));
      return fullName.includes(lowerQuery) || hasMatchingPatientId;
    });
  };

  const getAllPatients = (): PatientRecord[] => {
    return [...patients];
  };

  const clearAllPatients = (): void => {
    setPatients([]);
    storage.remove(STORAGE_KEYS.PATIENTS);
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientByPatientId,
        getPatientById,
        searchPatients,
        getAllPatients,
        clearAllPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

