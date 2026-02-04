// Mission Info Context - Manages medical mission details
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';

export interface MissionInfo {
  name: string;
  location: string;
  date: string; // ISO date string
  organizer: string;
  contactInfo?: string;
}

interface MissionInfoContextType {
  missionInfo: MissionInfo;
  updateMissionInfo: (info: Partial<MissionInfo>) => void;
  resetMissionInfo: () => void;
}

const DEFAULT_MISSION_INFO: MissionInfo = {
  name: 'Medical Mission',
  location: '',
  date: new Date().toISOString(),
  organizer: '',
  contactInfo: '',
};

const MissionInfoContext = createContext<MissionInfoContextType | undefined>(undefined);

export const MissionInfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [missionInfo, setMissionInfo] = useState<MissionInfo>(() => {
    return storage.get<MissionInfo>(STORAGE_KEYS.MISSION_INFO) || DEFAULT_MISSION_INFO;
  });

  // Save mission info to localStorage whenever it changes
  useEffect(() => {
    storage.set(STORAGE_KEYS.MISSION_INFO, missionInfo);
  }, [missionInfo]);

  const updateMissionInfo = (info: Partial<MissionInfo>): void => {
    setMissionInfo((prev) => ({ ...prev, ...info }));
  };

  const resetMissionInfo = (): void => {
    setMissionInfo(DEFAULT_MISSION_INFO);
    storage.remove(STORAGE_KEYS.MISSION_INFO);
  };

  return (
    <MissionInfoContext.Provider
      value={{
        missionInfo,
        updateMissionInfo,
        resetMissionInfo,
      }}
    >
      {children}
    </MissionInfoContext.Provider>
  );
};

export const useMissionInfo = (): MissionInfoContextType => {
  const context = useContext(MissionInfoContext);
  if (!context) {
    throw new Error('useMissionInfo must be used within a MissionInfoProvider');
  }
  return context;
};

