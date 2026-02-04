// App Routes Configuration
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/home/Home';
import Registration from '../pages/registration/Registration';
import PatientIdResult from '../pages/registration/PatientIdResult';
import VitalsLookup from '../pages/vitals/VitalsLookup';
import VitalsForm from '../pages/vitals/VitalsForm';
import VitalsPrint from '../pages/vitals/VitalsPrint';
import PatientRecords from '../pages/records/PatientRecords';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Home / Dashboard */}
          <Route path="/" element={<Home />} />

          {/* Registration Routes */}
          <Route path="/registration" element={<Registration />} />
          <Route path="/registration/result/:patientId" element={<PatientIdResult />} />

          {/* Patient Records */}
          <Route path="/records" element={<PatientRecords />} />

          {/* Vitals Routes */}
          <Route path="/vitals" element={<VitalsLookup />} />
          <Route path="/vitals/form/:patientId" element={<VitalsForm />} />
          <Route path="/vitals/print/:patientId" element={<VitalsPrint />} />

          {/* Fallback - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;

