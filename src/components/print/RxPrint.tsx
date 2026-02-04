// RX Print Component - Medical prescription-style print layout
import React from 'react';
import type { PatientRecord } from '../../context/PatientContext';
import type { VitalsRecord } from '../../context/VitalsContext';
import type { MissionInfo } from '../../context/MissionInfoContext';
import { getServiceByCode } from '../../config/services';
import logo from '../../assets/LIGHTHOUSE_CAINTA_LOGO_BLACK.png';
import {
  formatFullName,
  formatAddress,
  formatBloodPressure,
  formatWeight,
  formatDate,
  formatAge,
} from '../../utils/formatId';
import { getBloodPressureCategory } from '../../utils/validateVitals';
import './RxPrint.css';

interface RxPrintProps {
  patient: PatientRecord;
  vitals: VitalsRecord;
  patientId: string;
  missionInfo: MissionInfo;
}

const RxPrint: React.FC<RxPrintProps> = ({
  patient,
  vitals,
  patientId,
  missionInfo,
}) => {
  const fullName = formatFullName(patient.firstName, patient.middleName, patient.lastName);
  const address = formatAddress(patient.street, patient.barangay, patient.city, patient.province);
  const serviceCode = patientId.split('-')[0];
  const service = getServiceByCode(serviceCode);
  const bpCategory = getBloodPressureCategory(
    vitals.bloodPressureSystolic,
    vitals.bloodPressureDiastolic
  );

  return (
    <div className="rx-print">
      <div className="rx-container">
        {/* Header */}
        <div className="rx-header">
          <div className="rx-logo-section">
            <img src={logo} alt="Lighthouse Cainta" className="rx-logo-image" />
          </div>
          <div className="rx-title-section">
            <h1>{missionInfo.name || 'Medical Mission'}</h1>
            <div className="rx-subtitle">{missionInfo.location}</div>
            <div className="rx-date">{formatDate(new Date(missionInfo.date))}</div>
            {missionInfo.organizer && (
              <div className="rx-organizer">Organized by: {missionInfo.organizer}</div>
            )}
          </div>
        </div>

        <div className="rx-divider"></div>

        {/* Patient Information */}
        <div className="rx-section">
          <div className="rx-section-title">Patient Information</div>
          
          <div className="rx-info-grid">
            <div className="rx-info-row">
              <span className="rx-label">Patient ID:</span>
              <span className="rx-value rx-patient-id">{patientId}</span>
            </div>
            
            <div className="rx-info-row">
              <span className="rx-label">Name:</span>
              <span className="rx-value">{fullName}</span>
            </div>
            
            <div className="rx-info-row">
              <span className="rx-label">Age/Sex:</span>
              <span className="rx-value">
                {formatAge(patient.age, patient.ageUnit)} / {patient.sex}
              </span>
            </div>
            
            <div className="rx-info-row">
              <span className="rx-label">Address:</span>
              <span className="rx-value">{address}</span>
            </div>
            
            {patient.contactNumber && (
              <div className="rx-info-row">
                <span className="rx-label">Contact:</span>
                <span className="rx-value">{patient.contactNumber}</span>
              </div>
            )}
            
            <div className="rx-info-row">
              <span className="rx-label">Service:</span>
              <span className="rx-value">{service?.name || serviceCode}</span>
            </div>
          </div>
        </div>

        <div className="rx-divider"></div>

        {/* Vital Signs */}
        <div className="rx-section">
          <div className="rx-section-title">Vital Signs</div>
          
          <div className="rx-vitals-grid">
            <div className="rx-vital-item">
              <div className="rx-vital-label">Blood Pressure</div>
              <div className="rx-vital-value">
                {formatBloodPressure(
                  vitals.bloodPressureSystolic,
                  vitals.bloodPressureDiastolic
                )} mmHg
              </div>
              <div className="rx-vital-category">{bpCategory}</div>
            </div>
            
            <div className="rx-vital-item">
              <div className="rx-vital-label">Weight</div>
              <div className="rx-vital-value">{formatWeight(vitals.weight)}</div>
            </div>
          </div>

          {vitals.notes && (
            <div className="rx-notes">
              <div className="rx-notes-label">Notes:</div>
              <div className="rx-notes-content">{vitals.notes}</div>
            </div>
          )}
        </div>

        <div className="rx-divider"></div>

        {/* All Services */}
        {patient.patientIds.length > 1 && (
          <>
            <div className="rx-section">
              <div className="rx-section-title">All Services Availed</div>
              <div className="rx-services-list">
                {patient.patientIds.map((pid, index) => {
                  const svcCode = patient.serviceCodes[index];
                  const svc = getServiceByCode(svcCode);
                  return (
                    <div key={pid} className="rx-service-item">
                      <span className="rx-service-id">{pid}</span>
                      <span className="rx-service-name">{svc?.name || svcCode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rx-divider"></div>
          </>
        )}

        {/* Footer */}
        <div className="rx-footer">
          <div className="rx-footer-row">
            <div className="rx-footer-item">
              <div className="rx-footer-label">Recorded:</div>
              <div className="rx-footer-value">
                {new Date(vitals.recordedDate).toLocaleString()}
              </div>
            </div>
            {vitals.recordedBy && (
              <div className="rx-footer-item">
                <div className="rx-footer-label">Recorded by:</div>
                <div className="rx-footer-value">{vitals.recordedBy}</div>
              </div>
            )}
          </div>
          
          <div className="rx-signature-section">
            <div className="rx-signature-line">
              <div className="signature-line"></div>
              <div className="signature-label">Healthcare Provider Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RxPrint;

