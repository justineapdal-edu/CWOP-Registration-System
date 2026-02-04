// Patient Records Page - View, Edit, Delete all registered patients
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import type { PatientRecord } from '../../context/PatientContext';
import { formatFullName } from '../../utils/formatId';
import { MEDICAL_SERVICES } from '../../config/services';
import PageHeader from '../../components/layout/PageHeader';
import './PatientRecords.css';

const PatientRecords: React.FC = () => {
  const navigate = useNavigate();
  const { patients, deletePatient } = usePatient();
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  // Filter and search patients
  const filteredPatients = useMemo(() => {
    let result = [...patients];

    // Filter by service
    if (serviceFilter !== 'all') {
      result = result.filter(patient => 
        patient.serviceCodes.includes(serviceFilter)
      );
    }

    // Search by name or patient ID
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(patient => {
        const fullName = formatFullName(patient.firstName, patient.middleName, patient.lastName).toLowerCase();
        const hasMatchingId = patient.patientIds.some(id => id.toLowerCase().includes(query));
        return fullName.includes(query) || hasMatchingId;
      });
    }

    return result;
  }, [patients, searchQuery, serviceFilter]);

  const handleDelete = (patientId: string) => {
    deletePatient(patientId);
    setShowDeleteConfirm(null);
  };

  const handleEdit = (patient: PatientRecord) => {
    // Store patient data for editing and navigate to registration
    sessionStorage.setItem('editingPatient', JSON.stringify(patient));
    navigate('/registration');
  };

  const handleRowClick = (patient: PatientRecord) => {
    setSelectedPatient(patient);
  };

  const handlePrintRx = (patientId: string) => {
    navigate(`/vitals/print/${patientId}`);
  };

  const handleDeleteFromModal = () => {
    if (selectedPatient) {
      handleDelete(selectedPatient.id);
      setSelectedPatient(null);
    }
  };

  const handleEditFromModal = () => {
    if (selectedPatient) {
      handleEdit(selectedPatient);
      setSelectedPatient(null);
    }
  };

  return (
    <div className="patient-records-page">
      <PageHeader title="Patient Records" />
      <div className="records-container">
        <div className="table-container">
          <div className="table-header">
            <div className="table-title">
              <h2>All Registered Patients</h2>
              <span className="record-count">{filteredPatients.length} records</span>
            </div>
            <div className="table-controls">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="service-filter"
              >
                <option value="all">All Services</option>
                {MEDICAL_SERVICES.map(service => (
                  <option key={service.code} value={service.code}>
                    {service.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or Patient ID..."
                className="search-input"
              />
            </div>
          </div>

          {filteredPatients.length > 0 ? (
            <table className="records-table">
              <thead>
                <tr>
                  <th>Patient IDs</th>
                  <th>Full Name</th>
                  <th className="hide-mobile">Age/Sex</th>
                  <th className="hide-mobile">Address</th>
                  <th className="hide-mobile">Services Availed</th>
                  <th className="hide-mobile">Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => {
                  const fullName = formatFullName(patient.firstName, patient.middleName, patient.lastName);
                  const services = patient.serviceCodes
                    .map(code => MEDICAL_SERVICES.find(s => s.code === code)?.name || code)
                    .join(', ');

                  return (
                    <tr key={patient.id} onClick={() => handleRowClick(patient)} className="clickable-row">
                      <td className="patient-ids-cell">
                        {patient.patientIds.map(id => (
                          <span key={id} className="patient-id-badge">{id}</span>
                        ))}
                      </td>
                      <td className="name-cell">{fullName}</td>
                      <td className="hide-mobile">{patient.age} {patient.ageUnit} / {patient.sex}</td>
                      <td className="address-cell hide-mobile">
                        {patient.barangay}, {patient.city}
                      </td>
                      <td className="services-cell hide-mobile">{services}</td>
                      <td className="hide-mobile">{patient.contactNumber || '—'}</td>
                      <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEdit(patient)}
                          className="btn-action btn-edit"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(patient.id)}
                          className="btn-action btn-delete"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="no-records">
              {searchQuery || serviceFilter !== 'all'
                ? 'No records found matching your search criteria.'
                : 'No patient records available. Register patients first.'}
            </div>
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Patient Details</h3>
              <button 
                className="close-btn" 
                onClick={() => setSelectedPatient(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="details-content">
              <div className="detail-section">
                <h4>Patient IDs</h4>
                <div className="patient-ids-list">
                  {selectedPatient.patientIds.map(id => (
                    <span key={id} className="patient-id-badge">{id}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>Personal Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">
                    {formatFullName(selectedPatient.firstName, selectedPatient.middleName, selectedPatient.lastName)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">{selectedPatient.age} {selectedPatient.ageUnit}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Sex:</span>
                  <span className="detail-value">{selectedPatient.sex}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Address</h4>
                <div className="detail-row">
                  <span className="detail-value">
                    {selectedPatient.street && `${selectedPatient.street}, `}
                    {selectedPatient.barangay}, {selectedPatient.city}
                    {selectedPatient.province && `, ${selectedPatient.province}`}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Services Availed</h4>
                <div className="detail-row">
                  <span className="detail-value">
                    {selectedPatient.serviceCodes
                      .map(code => MEDICAL_SERVICES.find(s => s.code === code)?.name || code)
                      .join(', ')}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Contact</h4>
                <div className="detail-row">
                  <span className="detail-value">{selectedPatient.contactNumber || '—'}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions modal-actions-multiple">
              <button
                onClick={handleEditFromModal}
                className="btn-primary"
              >
                Edit
              </button>
              <button
                onClick={() => handlePrintRx(selectedPatient.patientIds[0])}
                className="btn-secondary"
              >
                Print RX
              </button>
              <button
                onClick={handleDeleteFromModal}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this patient record? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
