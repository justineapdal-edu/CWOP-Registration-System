// Vitals Lookup Page - Patient Records Table
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import { getServiceByCode } from '../../config/services';
import { formatFullName } from '../../utils/formatId';
import PageHeader from '../../components/layout/PageHeader';
import './VitalsLookup.css';

interface PatientTableRow {
  patientId: string;
  fullName: string;
  service: string;
  recordId: string;
}

const VitalsLookup: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = usePatient();
  const [searchQuery, setSearchQuery] = useState('');

  // Convert patients to table rows (one row per patient ID)
  const allPatientRows = useMemo(() => {
    const rows: PatientTableRow[] = [];
    
    patients.forEach((patient) => {
      patient.patientIds.forEach((patientId, index) => {
        const serviceCode = patient.serviceCodes[index];
        const service = getServiceByCode(serviceCode);
        const fullName = formatFullName(patient.firstName, patient.middleName, patient.lastName);
        
        rows.push({
          patientId,
          fullName,
          service: service?.name || serviceCode,
          recordId: patient.id,
        });
      });
    });
    
    return rows;
  }, [patients]);

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPatientRows;
    }

    const query = searchQuery.toLowerCase();
    return allPatientRows.filter((row) =>
      row.patientId.toLowerCase().includes(query) ||
      row.fullName.toLowerCase().includes(query) ||
      row.service.toLowerCase().includes(query)
    );
  }, [allPatientRows, searchQuery]);

  const handleRowClick = (patientId: string) => {
    navigate(`/vitals/form/${patientId}`);
  };

  return (
    <div className="vitals-lookup-page">
      <PageHeader title="Vitals Recording" />
      <div className="lookup-container">
        <div className="table-container">
          <div className="table-header">
            <div className="table-title">
              <h2>Patient Records</h2>
              <span className="record-count">{filteredRows.length} records</span>
            </div>
            <div className="table-search">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Patient ID, Name, or Service..."
                className="search-input"
              />
            </div>
          </div>

          {filteredRows.length > 0 ? (
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Full Name</th>
                  <th>Service Availed</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.patientId}
                    onClick={() => handleRowClick(row.patientId)}
                    className="table-row"
                  >
                    <td className="patient-id-cell">{row.patientId}</td>
                    <td>{row.fullName}</td>
                    <td>{row.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-records">
              {searchQuery
                ? `No records found matching "${searchQuery}"`
                : 'No patient records available. Register patients first.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VitalsLookup;
