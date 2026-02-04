// Service Selection Component
import React from 'react';
import { MEDICAL_SERVICES } from '../../config/services';
import './ServiceSelection.css';

interface ServiceSelectionProps {
  selectedServices: string[];
  onSelectionChange: (serviceCodes: string[]) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedServices,
  onSelectionChange,
}) => {
  const handleToggleService = (serviceCode: string) => {
    if (selectedServices.includes(serviceCode)) {
      // Remove service
      onSelectionChange(selectedServices.filter((code) => code !== serviceCode));
    } else {
      // Add service
      onSelectionChange([...selectedServices, serviceCode]);
    }
  };

  return (
    <div className="service-selection">
      <div className="services-grid">
        {MEDICAL_SERVICES.map((service) => (
          <div
            key={service.code}
            className={`service-card ${
              selectedServices.includes(service.code) ? 'selected' : ''
            }`}
            onClick={() => handleToggleService(service.code)}
          >
            <div className="service-header">
              <input
                type="checkbox"
                checked={selectedServices.includes(service.code)}
                onChange={() => handleToggleService(service.code)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="service-code">{service.code}</span>
            </div>
            <div className="service-name">{service.name}</div>
            <div className="service-description">{service.description}</div>
          </div>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <div className="selected-services-summary">
          <h3>Selected Services ({selectedServices.length}):</h3>
          <div className="selected-tags">
            {selectedServices.map((code) => {
              const service = MEDICAL_SERVICES.find((s) => s.code === code);
              return (
                <span key={code} className="service-tag">
                  {code} - {service?.name}
                  <button
                    type="button"
                    onClick={() => handleToggleService(code)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
