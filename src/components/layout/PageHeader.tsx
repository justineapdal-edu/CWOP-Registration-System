import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, showBack }) => {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      {showBack && (
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      )}
      <div className="page-header-content">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
