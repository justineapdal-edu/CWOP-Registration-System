// Home Page / Dashboard
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import { useVitals } from '../../context/VitalsContext';
import PageHeader from '../../components/layout/PageHeader';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getAllPatients } = usePatient();
  const { getAllVitals } = useVitals();

  const totalPatients = getAllPatients().length;
  const totalVitals = getAllVitals().length;

  return (
    <div className="home-page">
      <PageHeader title="Dashboard" subtitle="Medical Mission Registration System Overview" />
      <div className="home-container">
        {/* Statistics */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{totalPatients}</div>
            <div className="stat-label">Registered Patients</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalVitals}</div>
            <div className="stat-label">Vitals Recorded</div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="main-actions">
          <div className="action-card">
            <h3>Registration Booth</h3>
            <p>Register new patients and generate Patient IDs</p>
            <button className="btn-primary" onClick={() => navigate('/registration')}>
              Start Registration
            </button>
          </div>

          <div className="action-card">
            <h3>Vitals Recording Booth</h3>
            <p>Record blood pressure and weight measurements</p>
            <button className="btn-primary" onClick={() => navigate('/vitals')}>
              Record Vitals
            </button>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="quick-guide">
          <h3>System Workflow</h3>
          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Register Patient</h4>
                <p>Enter patient details and select services to generate Patient IDs</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Record Vitals</h4>
                <p>Use Patient ID to look up and record vital signs</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Print RX</h4>
                <p>Generate and print prescription-style record for the patient</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="features-section">
          <h3>System Features</h3>
          <div className="features-list">
            <div className="feature-item">Offline-capable operation</div>
            <div className="feature-item">Multi-booth support</div>
            <div className="feature-item">Service-based Patient IDs</div>
            <div className="feature-item">RX-style printing</div>
            <div className="feature-item">Medical validation</div>
            <div className="feature-item">Local data storage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
