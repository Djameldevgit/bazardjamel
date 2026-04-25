// components/Video/StepIndicator.jsx
import React from 'react';
import { 
  Grid, 
  Image, 
  MusicNote, 
  FileText,
  Briefcase,
  MusicNoteBeamed
} from 'react-bootstrap-icons';

const StepIndicator = ({ currentStep, videoType = null, totalSteps = 4 }) => {
  // Definir los pasos según el tipo de video
  const getSteps = () => {
    if (videoType === null) {
      // Paso 0: Selección de tipo
      return [
        { number: 0, title: 'Type', icon: Grid },
        { number: 1, title: 'Vidéo', icon: Image },
        { number: 2, title: 'Musique', icon: MusicNote },
        { number: 3, title: 'Infos', icon: FileText }
      ];
    }
    
    // Pasos normales después de seleccionar tipo
    return [
      { number: 1, title: 'Vidéo', icon: Image },
      { number: 2, title: 'Musique', icon: MusicNote },
      { number: 3, title: 'Infos', icon: FileText }
    ];
  };
  
  // Si no hay tipo seleccionado, mostrar solo paso 0
  if (videoType === null) {
    return (
      <div className="step-indicator">
        <div className="steps-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className={`step-item active`}>
            <div className="step-circle" style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
            }}>
              <Grid size={22} color="white" />
            </div>
            <div className="step-label" style={{ fontWeight: '600', color: '#667eea' }}>
              Choisissez le type
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const steps = getSteps();
  const isCommercial = videoType === 'commercial';
  
  // Modificar los textos según el tipo
  const stepTitles = {
    1: { commercial: 'Vidéo produit', social: 'Vidéo créative', icon: Image },
    2: { commercial: 'Musique', social: 'Son', icon: MusicNoteBeamed },
    3: { commercial: 'Infos vente', social: 'Détails', icon: FileText }
  };
  
  return (
    <div className="step-indicator">
      <div className="steps-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {steps.map((step, index) => {
          const isActive = currentStep >= step.number;
          const isCompleted = currentStep > step.number;
          const stepInfo = stepTitles[step.number];
          const title = stepInfo 
            ? (isCommercial ? stepInfo.commercial : stepInfo.social)
            : step.title;
          const Icon = stepInfo?.icon || step.icon;
          
          return (
            <React.Fragment key={step.number}>
              <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="step-circle">
                  {isCompleted ? (
                    <span className="step-check">✓</span>
                  ) : (
                    <Icon size={18} />
                  )}
                </div>
                <div className="step-label">{title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Estilos CSS inline para asegurar funcionamiento */}
      <style>{`
        .step-indicator {
          padding: 10px 0;
          width: 100%;
        }
        
        .steps-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }
        
        .step-item {
          flex: 1;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        
        .step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          transition: all 0.3s ease;
          color: #999;
          font-weight: bold;
          font-size: 14px;
        }
        
        .step-item.active .step-circle {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .step-item.completed .step-circle {
          background: #10b981;
          color: white;
        }
        
        .step-label {
          font-size: 11px;
          font-weight: 500;
          color: #999;
          transition: all 0.3s ease;
        }
        
        .step-item.active .step-label {
          color: #667eea;
          font-weight: 600;
        }
        
        .step-item.completed .step-label {
          color: #10b981;
        }
        
        .step-line {
          flex: 1;
          height: 2px;
          background: #e0e0e0;
          margin: 0 8px;
          margin-bottom: 32px;
          transition: all 0.3s ease;
        }
        
        .step-line.completed {
          background: linear-gradient(90deg, #10b981, #667eea);
        }
        
        .step-check {
          font-size: 16px;
          font-weight: bold;
        }
        
        /* Responsive */
        @media (max-width: 480px) {
          .step-circle {
            width: 36px;
            height: 36px;
          }
          
          .step-label {
            font-size: 9px;
          }
          
          .step-line {
            margin-bottom: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default StepIndicator;