// Patient ID Result Page - Display generated Patient IDs
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import { getServiceByCode } from '../../config/services';
import { formatFullName, formatAddress } from '../../utils/formatId';
import PageHeader from '../../components/layout/PageHeader';
import './PatientIdResult.css';

const PatientIdResult: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { getPatientById } = usePatient();

  const patient = patientId ? getPatientById(patientId) : undefined;

  useEffect(() => {
    if (!patient) {
      navigate('/registration');
    }
  }, [patient, navigate]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleNewRegistration = () => {
    navigate('/registration');
  };

  const handleGoToVitals = () => {
    navigate('/vitals');
  };

  const fullName = formatFullName(patient.firstName, patient.middleName, patient.lastName);
  const address = formatAddress(patient.street, patient.barangay, patient.city, patient.province);

  return (
    <div className="patient-id-result-page">
      <PageHeader title="Registration Complete" />
      <div className="result-container">
        <div className="success-header">
          <h1>Registration Successful</h1>
          <p>Patient has been registered successfully</p>
        </div>

        <div className="patient-info-card">
          <h2>Patient Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{fullName}</span>
            </div>
            <div className="info-item">
              <span className="label">Age:</span>
              <span className="value">{patient.age} {patient.ageUnit}</span>
            </div>
            <div className="info-item">
              <span className="label">Sex:</span>
              <span className="value">{patient.sex}</span>
            </div>
            <div className="info-item">
              <span className="label">Address:</span>
              <span className="value">{address}</span>
            </div>
            {patient.contactNumber && (
              <div className="info-item">
                <span className="label">Contact:</span>
                <span className="value">{patient.contactNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div className="patient-ids-card">
          <h2>Generated Patient IDs</h2>
          <p className="instruction">
            Please provide the patient with their Patient ID(s) for the selected service(s):
          </p>
          
          <div className="patient-ids-list">
            {patient.patientIds.map((pid, index) => {
              const serviceCode = patient.serviceCodes[index];
              const service = getServiceByCode(serviceCode);
              
              return (
                <div key={pid} className="patient-id-item">
                  <div className="patient-id-code">{pid}</div>
                  <div className="patient-id-service">
                    {service?.name || serviceCode}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Print-only section */}
        <div className="print-only">
          <div className="patient-slip">
            <h1>Medical Mission</h1>
            <h2>Patient Registration Slip</h2>
            
            <div className="slip-section">
              <strong>Patient Name:</strong> {fullName}
            </div>
            <div className="slip-section">
              <strong>Age/Sex:</strong> {patient.age} {patient.ageUnit} / {patient.sex}
            </div>
            <div className="slip-section">
              <strong>Address:</strong> {address}
            </div>
            
            <div className="slip-section">
              <strong>Patient ID(s):</strong>
              <div className="slip-ids">
                {patient.patientIds.map((pid, index) => {
                  const serviceCode = patient.serviceCodes[index];
                  const service = getServiceByCode(serviceCode);
                  return (
                    <div key={pid} className="slip-id">
                      <span className="slip-id-code">{pid}</span>
                      <span className="slip-id-service">({service?.name})</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="slip-footer">
              <p>Please present this slip at the service booth(s)</p>
              <p className="slip-date">
                Registered: {new Date(patient.registrationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons - hidden in print */}
        <div className="result-actions no-print">
          <button onClick={handlePrint} className="btn-primary">
            Print Patient Slip
          </button>
          <button onClick={handleGoToVitals} className="btn-secondary">
            Go to Vitals Recording
          </button>
          <button onClick={handleNewRegistration} className="btn-secondary">
            New Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientIdResult;
