# Medical Mission Patient Registration System

A comprehensive, offline-capable medical mission frontend system built with React + Vite that supports multi-booth operations through a service-based Patient ID workflow.

## 🎯 Project Overview

This system enables fast patient registration, accurate service tracking, vital signs encoding, and RX-style printing suitable for real-world medical missions. It operates offline-first and supports multiple booths working simultaneously.

## 🏥 Medical Services Supported

- **MA** - Medical Adult
- **MP** - Medical Pedia (Pediatrics)
- **MD** - Medical Derma (Dermatology)
- **DE** - Dental Extraction
- **ES** - Eye Screening
- **PT** - Physical Therapy
- **OBP** - OB Prenatal Checkup
- **OBC** - OB Cervical Cancer Screening

## 🆔 Patient ID System

### Format

```
<SERVICE_CODE>-<6-DIGIT SEQUENCE>
```

### Examples

- `MA-000001` - First Medical Adult patient
- `MP-000012` - 12th Medical Pedia patient
- `OBP-000004` - 4th OB Prenatal patient

### Key Features

- Each service maintains its own sequential counter
- IDs are generated during registration
- One patient may receive multiple Patient IDs if multiple services are availed
- ID generation works offline
- Human-readable and encoder-friendly

## 🔄 System Workflow

### 1. Registration Booth

1. Encode patient demographics (name, age, sex, address, contact)
2. Select one or more services availed
3. System generates corresponding Patient ID(s) per service
4. Display and/or print Patient ID slip
5. Data persists locally for offline usage

### 2. Vitals Recording Booth

1. Encoder inputs Patient ID
2. System validates and retrieves patient record
3. Encode vital signs:
   - Blood pressure (systolic / diastolic)
   - Body weight (kg)
4. Medical-safe validation rules applied
5. Save vitals linked to Patient ID

### 3. RX-Style Printing

Generate a print-optimized RX layout containing:

- Patient name and demographics
- Patient ID(s)
- Services availed
- Blood pressure and weight
- Date and mission details
- Professional prescription-style format

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Modern web browser

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── config/              # Service definitions & ID generation
├── context/             # React Context providers
├── pages/               # Page components
├── components/          # Reusable components
├── utils/               # Utility functions
└── routes/              # Route configuration
```

## 💡 Key Features

- ✅ Offline-capable with LocalStorage
- ✅ Multi-booth support
- ✅ Service-based Patient IDs
- ✅ Medical validation
- ✅ Print-optimized RX layout
- ✅ Responsive design

## 🎯 Future Enhancements

- Backend API integration (Laravel)
- PDF export functionality
- Additional vital signs
- Diagnosis and prescription modules
- Multi-language support
- Analytics dashboard

## 📄 License

This project is developed for medical mission use. Please ensure compliance with local healthcare data regulations.

---

**Built with ❤️ for Medical Mission Service**
