// Vitals Print Page - Display and print RX-style output
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import { useVitals } from '../../context/VitalsContext';
import { useMissionInfo } from '../../context/MissionInfoContext';
import RxPrint from '../../components/print/RxPrint';
import './VitalsPrint.css';

const VitalsPrint: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { getPatientByPatientId } = usePatient();
  const { getVitalsByPatientId } = useVitals();
  const { missionInfo } = useMissionInfo();

  const patient = patientId ? getPatientByPatientId(patientId) : undefined;
  const vitals = patientId ? getVitalsByPatientId(patientId) : undefined;

  useEffect(() => {
    if (!patient || !vitals) {
      navigate('/vitals');
    }
  }, [patient, vitals, navigate]);

  if (!patient || !vitals || !patientId) {
    return <div>Loading...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleNewVitals = () => {
    navigate('/vitals');
  };

  const handleBackToRegistration = () => {
    navigate('/registration');
  };

  return (
    <div className="vitals-print-page">
      {/* Action buttons - hidden in print */}
      <div className="print-actions no-print">
        <div className="action-buttons">
          <button onClick={handleBackToRegistration} className="btn-secondary">
            Back to Registration
          </button>
          <button onClick={handleNewVitals} className="btn-secondary">
            Record New Vitals
          </button>
          <button onClick={handlePrint} className="btn-primary">
            Print RX
          </button>
        </div>
      </div>

      {/* RX Print Component */}
      <RxPrint
        patient={patient}
        vitals={vitals}
        patientId={patientId}
        missionInfo={missionInfo}
      />

      {/* Success message - hidden in print */}
      <div className="success-message no-print">
        <div className="success-icon">✓</div>
        <h2>Vital Signs Recorded Successfully</h2>
        <p>You can now print the RX or record vitals for another patient</p>
      </div>
    </div>
  );
};

export default VitalsPrint;

