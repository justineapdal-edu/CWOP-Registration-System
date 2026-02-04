// Vitals Form Page - Record vital signs
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import { useVitals } from '../../context/VitalsContext';
import { validateVitalSigns, getBloodPressureCategory } from '../../utils/validateVitals';
import { formatFullName } from '../../utils/formatId';
import { getServiceByCode } from '../../config/services';
import PageHeader from '../../components/layout/PageHeader';
import './VitalsForm.css';

const VitalsForm: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { getPatientByPatientId } = usePatient();
  const { addVitalsRecord, getVitalsByPatientId } = useVitals();

  const patient = patientId ? getPatientByPatientId(patientId) : undefined;
  const existingVitals = patientId ? getVitalsByPatientId(patientId) : undefined;

  const [formData, setFormData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    weight: '',
    notes: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!patient) {
      navigate('/vitals');
    }
  }, [patient, navigate]);

  // Calculate BP category directly
  const systolic = parseFloat(formData.bloodPressureSystolic);
  const diastolic = parseFloat(formData.bloodPressureDiastolic);
  const bpCategory = !isNaN(systolic) && !isNaN(diastolic) 
    ? getBloodPressureCategory(systolic, diastolic) 
    : '';

  if (!patient || !patientId) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const vitalsData = {
      bloodPressureSystolic: parseFloat(formData.bloodPressureSystolic),
      bloodPressureDiastolic: parseFloat(formData.bloodPressureDiastolic),
      weight: parseFloat(formData.weight),
    };

    const validation = validateVitalSigns(vitalsData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      addVitalsRecord({
        patientId,
        ...vitalsData,
        notes: formData.notes.trim(),
      });

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      setErrors(['Failed to save vital signs. Please try again.']);
      console.error('Vitals recording error:', error);
    }
  };

  const handlePrintRx = () => {
    navigate(`/vitals/print/${patientId}`);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/vitals');
  };

  const serviceCode = patientId.split('-')[0];
  const service = getServiceByCode(serviceCode);
  const fullName = formatFullName(patient.firstName, patient.middleName, patient.lastName);

  return (
    <div className="vitals-form-page">
      <PageHeader title="Record Vital Signs" />
      <div className="vitals-container">

        {/* Patient Info Card */}
        <div className="patient-info-card">
          <div className="patient-id-badge">{patientId}</div>
          <div className="patient-details">
            <h2>{fullName}</h2>
            <div className="patient-meta">
              <span>{patient.age} {patient.ageUnit}</span>
              <span>•</span>
              <span>{patient.sex}</span>
              <span>•</span>
              <span>{service?.name || serviceCode}</span>
            </div>
            <div className="patient-address">
              {patient.barangay}, {patient.city}
            </div>
          </div>
        </div>

        {/* Existing Vitals Warning */}
        {existingVitals && (
          <div className="warning-message">
            <strong>Note:</strong> Vital signs have already been recorded for this Patient ID on{' '}
            {new Date(existingVitals.recordedDate).toLocaleString()}.
            Submitting this form will create a new record.
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                {error}
              </div>
            ))}
          </div>
        )}

        {/* Vitals Form */}
        <form onSubmit={handleSubmit} className="vitals-form">
          <div className="form-section">
            <h3>Blood Pressure</h3>
            <div className="bp-inputs">
              <div className="form-group">
                <label htmlFor="bloodPressureSystolic">Systolic (mmHg) *</label>
                <input
                  type="number"
                  id="bloodPressureSystolic"
                  name="bloodPressureSystolic"
                  value={formData.bloodPressureSystolic}
                  onChange={handleInputChange}
                  min="30"
                  max="300"
                  required
                  autoFocus
                />
              </div>

              <div className="bp-separator">/</div>

              <div className="form-group">
                <label htmlFor="bloodPressureDiastolic">Diastolic (mmHg) *</label>
                <input
                  type="number"
                  id="bloodPressureDiastolic"
                  name="bloodPressureDiastolic"
                  value={formData.bloodPressureDiastolic}
                  onChange={handleInputChange}
                  min="30"
                  max="200"
                  required
                />
              </div>
            </div>

            {bpCategory && (
              <div className={`bp-category bp-${bpCategory.toLowerCase().replace(/\s+/g, '-')}`}>
                Category: {bpCategory}
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Weight</h3>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg) *</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                min="1"
                max="300"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Notes (Optional)</h3>
            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any observations or remarks..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/vitals')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Vital Signs
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content success-modal">
            <div className="success-icon">✓</div>
            <h2>Successfully Recorded</h2>
            <p>Vital signs have been saved successfully.</p>
            <p className="modal-subtitle">Your prescription is ready to be printed.</p>
            <div className="modal-actions">
              <button onClick={handleCloseModal} className="btn-secondary">
                Close
              </button>
              <button onClick={handlePrintRx} className="btn-primary">
                Print Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalsForm;
