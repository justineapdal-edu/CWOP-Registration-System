// Medical Services Configuration
export interface MedicalService {
  code: string;
  name: string;
  description: string;
  category: 'medical' | 'dental' | 'eye' | 'therapy' | 'ob';
}

export const MEDICAL_SERVICES: MedicalService[] = [
  {
    code: 'MA',
    name: 'Medical Adult',
    description: 'General medical consultation for adults',
    category: 'medical',
  },
  {
    code: 'MP',
    name: 'Medical Pedia',
    description: 'Pediatric medical consultation',
    category: 'medical',
  },
  {
    code: 'MD',
    name: 'Medical Derma',
    description: 'Dermatology consultation',
    category: 'medical',
  },
  {
    code: 'DE',
    name: 'Dental Extraction',
    description: 'Tooth extraction service',
    category: 'dental',
  },
  {
    code: 'ES',
    name: 'Eye Screening',
    description: 'Vision and eye health screening',
    category: 'eye',
  },
  {
    code: 'PT',
    name: 'Physical Therapy',
    description: 'Physical therapy and rehabilitation',
    category: 'therapy',
  },
  {
    code: 'OBP',
    name: 'OB Prenatal Checkup',
    description: 'Prenatal care and checkup',
    category: 'ob',
  },
  {
    code: 'OBC',
    name: 'OB Cervical Cancer Screening',
    description: 'Cervical cancer screening',
    category: 'ob',
  },
];

export const getServiceByCode = (code: string): MedicalService | undefined => {
  return MEDICAL_SERVICES.find((service) => service.code === code);
};

export const getServiceCategories = (): string[] => {
  return Array.from(new Set(MEDICAL_SERVICES.map((s) => s.category)));
};
