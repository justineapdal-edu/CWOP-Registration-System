// Registration Page - Main patient registration form
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import PageHeader from '../../components/layout/PageHeader';
import ServiceSelection from './ServiceSelection';
import './Registration.css';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { addPatient, updatePatient } = usePatient();

  // Initialize state with editing patient data from sessionStorage
  const editingPatientData = sessionStorage.getItem('editingPatient');
  const editingPatient = editingPatientData ? JSON.parse(editingPatientData) : null;
  
  const [isEditMode] = useState(!!editingPatient);
  const [editingPatientId] = useState<string | null>(editingPatient?.id || null);

  const [formData, setFormData] = useState({
    firstName: editingPatient?.firstName || '',
    middleName: editingPatient?.middleName || '',
    lastName: editingPatient?.lastName || '',
    age: editingPatient?.age?.toString() || '',
    sex: (editingPatient?.sex || 'Male') as 'Male' | 'Female',
    street: editingPatient?.street || '',
    barangay: editingPatient?.barangay || '',
    city: editingPatient?.city || '',
    province: editingPatient?.province || '',
    contactNumber: editingPatient?.contactNumber || '',
    serviceCodes: editingPatient?.serviceCodes || [] as string[],
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Clear session storage on mount
  useEffect(() => {
    if (editingPatient) {
      sessionStorage.removeItem('editingPatient');
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelection = (serviceCodes: string[]) => {
    setFormData((prev) => ({ ...prev, serviceCodes }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.firstName.trim()) newErrors.push('First name is required');
    if (!formData.lastName.trim()) newErrors.push('Last name is required');
    if (!formData.age || parseInt(formData.age) <= 0) {
      newErrors.push('Valid age is required');
    }
    if (!formData.barangay.trim()) newErrors.push('Barangay is required');
    if (!formData.city.trim()) newErrors.push('City is required');
    if (formData.serviceCodes.length === 0) {
      newErrors.push('Please select at least one service');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode && editingPatientId) {
        // Update existing patient
        updatePatient(editingPatientId, {
          firstName: formData.firstName.trim(),
          middleName: formData.middleName.trim(),
          lastName: formData.lastName.trim(),
          age: parseInt(formData.age),
          ageUnit: 'years',
          sex: formData.sex,
          street: formData.street.trim(),
          barangay: formData.barangay.trim(),
          city: formData.city.trim(),
          province: formData.province.trim(),
          contactNumber: formData.contactNumber.trim(),
          serviceCodes: formData.serviceCodes,
        });
        
        // Navigate back to records page
        navigate('/records');
      } else {
        // Create new patient
        const patient = addPatient({
          firstName: formData.firstName.trim(),
          middleName: formData.middleName.trim(),
          lastName: formData.lastName.trim(),
          age: parseInt(formData.age),
          ageUnit: 'years',
          sex: formData.sex,
          street: formData.street.trim(),
          barangay: formData.barangay.trim(),
          city: formData.city.trim(),
          province: formData.province.trim(),
          contactNumber: formData.contactNumber.trim(),
          serviceCodes: formData.serviceCodes,
        });

        // Navigate to result page with patient ID
        navigate(`/registration/result/${patient.id}`);
      }
    } catch (error) {
      setErrors([`Failed to ${isEditMode ? 'update' : 'register'} patient. Please try again.`]);
      console.error('Registration error:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      age: '',
      sex: 'Male',
      street: '',
      barangay: '',
      city: '',
      province: '',
      contactNumber: '',
      serviceCodes: [],
    });
    setErrors([]);
  };

  return (
    <div className="registration-page">
      <PageHeader title={isEditMode ? "Edit Patient Information" : "Patient Registration"} />
      <div className="registration-container">
        
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                {error}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Personal Information */}
          <section className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age (Years) *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sex">Sex *</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section className="form-section">
            <h2>Address</h2>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="street">Street / House No.</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="barangay">Barangay *</label>
                <input
                  type="text"
                  id="barangay"
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City / Municipality *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="province">Province</label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="form-section">
            <h2>Contact Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="09XX XXX XXXX"
                />
              </div>
            </div>
          </section>

          {/* Service Selection */}
          <section className="form-section">
            <h2>Services Availed *</h2>
            <ServiceSelection
              selectedServices={formData.serviceCodes}
              onSelectionChange={handleServiceSelection}
            />
          </section>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={handleReset} className="btn-secondary">
              Clear Form
            </button>
            <button type="submit" className="btn-primary">
              {isEditMode ? 'Update Patient' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
