// components/Video/StepIndicator.jsx
import React from 'react';
import { Image, Camera, Link, MusicNote, FileText } from 'react-bootstrap-icons';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Vidéo', icon: Image },
    { number: 2, title: 'Musique', icon: MusicNote },
    { number: 3, title: 'Infos', icon: FileText }
  ];
  
  return (
    <div className="step-indicator">
      <div className="steps-container">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`step-item ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
              <div className="step-circle">
                {currentStep > step.number ? (
                  <span className="step-check">✓</span>
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              <div className="step-label">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;