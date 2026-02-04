// Vitals Context - Manages vital signs records
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';

export interface VitalsRecord {
  id: string; // Internal UUID
  patientId: string; // Service-based Patient ID (e.g., 'MA-000001')
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  weight: number;
  recordedDate: string; // ISO date string
  recordedBy?: string;
  notes?: string;
}

interface VitalsContextType {
  vitalsRecords: VitalsRecord[];
  addVitalsRecord: (record: Omit<VitalsRecord, 'id' | 'recordedDate'>) => VitalsRecord;
  getVitalsByPatientId: (patientId: string) => VitalsRecord | undefined;
  getAllVitals: () => VitalsRecord[];
  updateVitalsRecord: (id: string, updates: Partial<VitalsRecord>) => void;
  clearAllVitals: () => void;
}

const VitalsContext = createContext<VitalsContextType | undefined>(undefined);

export const VitalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vitalsRecords, setVitalsRecords] = useState<VitalsRecord[]>([]);

  // Load vitals from localStorage on mount
  useEffect(() => {
    const storedVitals = storage.get<VitalsRecord[]>(STORAGE_KEYS.VITALS);
    if (storedVitals) {
      setVitalsRecords(storedVitals);
    }
  }, []);

  // Save vitals to localStorage whenever they change
  useEffect(() => {
    if (vitalsRecords.length > 0) {
      storage.set(STORAGE_KEYS.VITALS, vitalsRecords);
    }
  }, [vitalsRecords]);

  const addVitalsRecord = (recordData: Omit<VitalsRecord, 'id' | 'recordedDate'>): VitalsRecord => {
    const id = crypto.randomUUID();
    
    const newRecord: VitalsRecord = {
      ...recordData,
      id,
      recordedDate: new Date().toISOString(),
    };

    setVitalsRecords((prev) => [...prev, newRecord]);
    return newRecord;
  };

  const getVitalsByPatientId = (patientId: string): VitalsRecord | undefined => {
    // Return the most recent vitals record for this patient ID
    const records = vitalsRecords
      .filter((record) => record.patientId === patientId)
      .sort((a, b) => new Date(b.recordedDate).getTime() - new Date(a.recordedDate).getTime());
    
    return records[0];
  };

  const getAllVitals = (): VitalsRecord[] => {
    return [...vitalsRecords];
  };

  const updateVitalsRecord = (id: string, updates: Partial<VitalsRecord>): void => {
    setVitalsRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
    );
  };

  const clearAllVitals = (): void => {
    setVitalsRecords([]);
    storage.remove(STORAGE_KEYS.VITALS);
  };

  return (
    <VitalsContext.Provider
      value={{
        vitalsRecords,
        addVitalsRecord,
        getVitalsByPatientId,
        getAllVitals,
        updateVitalsRecord,
        clearAllVitals,
      }}
    >
      {children}
    </VitalsContext.Provider>
  );
};

export const useVitals = (): VitalsContextType => {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error('useVitals must be used within a VitalsProvider');
  }
  return context;
};
