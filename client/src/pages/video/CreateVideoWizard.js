// pages/video/CreateVideoWizard.jsx - VERSIÓN SIMPLIFICADA
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge } from 'react-bootstrap';
import { 
  ArrowLeft, 
  ArrowRight,
  CloudUpload,
  MusicNote,
  Image as ImageIcon,
  Camera,
  X,
  CheckCircle
} from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepMusicSelection from './StepMusicSelection';
import { createVideo } from '../../redux/actions/videoAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { videoUpload } from '../../utils/imageUpload';
import './CreateVideoWizard.css';

const CreateVideoWizard = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const { user } = auth;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const isMountedRef = useRef(true);
  
  const [wizardData, setWizardData] = useState({
    videoSource: null,      // 'gallery' ou 'camera'
    videoFile: null,
    videoPreview: null,
    videoDuration: 0,
    selectedMusic: null,
    musicVolume: 70,
    originalAudio: true,
    title: '',
    description: ''
  });
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  
  const isProActive = user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  const maxDuration = isProActive ? 60 : 30;
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (wizardData.videoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(wizardData.videoPreview);
      }
    };
  }, [wizardData.videoPreview]);
  
  // Validaciones simplificadas
  const isStep1Valid = useMemo(() => {
    if (!wizardData.videoSource) return false;
    if (!wizardData.videoFile && !wizardData.videoPreview) return false;
    if (wizardData.videoDuration > maxDuration) return false;
    return true;
  }, [wizardData.videoSource, wizardData.videoFile, wizardData.videoPreview, wizardData.videoDuration, maxDuration]);
  
  const isStep3Valid = useMemo(() => {
    if (!wizardData.title.trim()) return false;
    return true;
  }, [wizardData.title]);
  
  const handleGallerySelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  const handleCameraSelect = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);
  
  const handleFileChange = useCallback(async (e, isCamera = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      setError('Veuillez sélectionner un fichier vidéo valide');
      return;
    }
    
    // Preview immédiate
    const previewUrl = URL.createObjectURL(file);
    
    // Vérifier la durée
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      const duration = video.duration;
      
      if (duration > maxDuration) {
        setError(`La vidéo ne doit pas dépasser ${maxDuration} secondes`);
        URL.revokeObjectURL(previewUrl);
        return;
      }
      
      setWizardData(prev => ({
        ...prev,
        videoSource: isCamera ? 'camera' : 'gallery',
        videoFile: file,
        videoPreview: previewUrl,
        videoDuration: duration
      }));
      
      setError(null);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      setError('Erreur lors du chargement de la vidéo');
    };
    video.src = URL.createObjectURL(file);
  }, [maxDuration]);
  
  const clearVideo = useCallback(() => {
    if (wizardData.videoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(wizardData.videoPreview);
    }
    setWizardData(prev => ({
      ...prev,
      videoSource: null,
      videoFile: null,
      videoPreview: null,
      videoDuration: 0
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, [wizardData.videoPreview]);
  
  const nextStep = useCallback(() => {
    if (currentStep === 1 && !isStep1Valid) {
      setError('Veuillez sélectionner une vidéo');
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
      return;
    }
    if (currentStep === 3 && !isStep3Valid) {
      setError('Veuillez ajouter un titre');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
    setError(null);
    window.scrollTo(0, 0);
  }, [currentStep, isStep1Valid, isStep3Valid]);
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
    window.scrollTo(0, 0);
  }, []);
  
  const updateWizardData = useCallback((newData) => {
    if (isMountedRef.current) {
      setWizardData(prev => ({ ...prev, ...newData }));
    }
  }, []);
  
  const handleSubmit = useCallback(async () => {
    if (!isStep3Valid) {
      setError('Veuillez ajouter un titre');
      return;
    }
    
    if (!wizardData.videoFile) {
      setError('Aucune vidéo sélectionnée');
      return;
    }
    
    setLoading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      let videoUrl, videoId, thumbnail, videoDuration;
      
      // Upload vers Cloudinary
      const result = await videoUpload(wizardData.videoFile, (progress) => {
        if (isMountedRef.current) setUploadProgress(progress);
      });
      
      videoUrl = result.url;
      videoId = result.public_id;
      thumbnail = result.thumbnail;
      videoDuration = wizardData.videoDuration;
      
      // Préparer les données pour Redux
      const videoData = {
        title: wizardData.title,
        description: wizardData.description,
        shortDescription: wizardData.description?.substring(0, 300),
        videoUrl,
        videoType: 'local',
        videoId,
        thumbnail,
        duration: videoDuration,
        music: wizardData.selectedMusic ? {
          id: wizardData.selectedMusic.id,
          title: wizardData.selectedMusic.title,
          volume: wizardData.musicVolume
        } : null
      };
      
      const resultAction = await dispatch(createVideo(videoData, auth.token, auth, socket));
      
      if (resultAction?.success && isMountedRef.current) {
        // Nettoyer le preview
        if (wizardData.videoPreview?.startsWith('blob:')) {
          URL.revokeObjectURL(wizardData.videoPreview);
        }
        
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: '🎬 Vidéo publiée avec succès !' }
        });
        
        if (onSuccess) {
          onSuccess(resultAction.video);
        } else {
          setTimeout(() => {
            history.push(`/video/${resultAction.video._id}`);
          }, 1500);
        }
      } else {
        setError(resultAction?.error || 'Erreur lors de la publication');
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err.message || "Erreur lors de l'upload");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setUploadProgress(0);
      }
    }
  }, [wizardData, isStep3Valid, dispatch, auth, socket, onSuccess, history]);
  
  // RENDER STEP 1 - Deux icônes + preview plein écran
  const renderStep1 = () => (
    <div className="step1-container" style={{ 
      padding: '0 8px',
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Deux icônes sur la même ligne */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        marginBottom: '30px',
        padding: '10px 0'
      }}>
        {/* Icône Galerie */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleGallerySelect}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '60px',
              width: '70px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            <ImageIcon size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff', fontWeight: 500 }}>
            Galerie
          </div>
        </div>
        
        {/* Icône Caméra */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleCameraSelect}
            style={{
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              border: 'none',
              borderRadius: '60px',
              width: '70px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(240, 147, 251, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(240, 147, 251, 0.3)';
            }}
          >
            <Camera size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff', fontWeight: 500 }}>
            Caméra
          </div>
        </div>
      </div>
      
      {/* Inputs cachés */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/mp4,video/quicktime,video/webm"
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e, false)}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="video/mp4,video/quicktime,video/webm"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e, true)}
      />
      
      {/* PREVIEW VIDÉO - occupe tout l'espace restant */}
      {wizardData.videoPreview && (
        <div className="video-preview-full" style={{ 
          flex: 1,
          marginTop: '20px',
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#000',
          minHeight: '400px'
        }}>
          <video
            src={wizardData.videoPreview}
            controls
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '60vh',
              objectFit: 'contain',
              background: '#000'
            }}
            autoPlay={false}
            controlsList="nodownload"
          />
          
          {/* Badge durée */}
          {wizardData.videoDuration > 0 && (
            <Badge 
              bg="dark" 
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                opacity: 0.8,
                fontSize: '12px',
                padding: '4px 8px'
              }}
            >
              ⏱️ {Math.floor(wizardData.videoDuration)}s
            </Badge>
          )}
          
          {/* Bouton changer */}
          <Button 
            variant="danger" 
            size="sm" 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              borderRadius: '30px',
              opacity: 0.9
            }}
            onClick={clearVideo}
          >
            <X size={14} className="me-1" />
            Changer
          </Button>
        </div>
      )}
      
      {/* Message si pas de vidéo */}
      {!wizardData.videoPreview && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          marginTop: '20px',
          minHeight: '300px',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div>
            <Camera size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
            <p>Sélectionnez une vidéo depuis<br />votre galerie ou votre caméra</p>
            <small style={{ opacity: 0.6 }}>Max {maxDuration} secondes</small>
          </div>
        </div>
      )}
    </div>
  );
  
  // RENDER STEP 3 - Titre et description seulement
  const renderStep3 = () => (
    <div className="step3-container" style={{ padding: '20px' }}>
      <h5 className="mb-4" style={{ color: 'white', fontWeight: 'bold' }}>
        📝 Détails de la vidéo
      </h5>
      
      <div className="mb-4">
        <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>
          Titre *
        </label>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Donnez un titre à votre vidéo..."
          value={wizardData.title}
          onChange={(e) => updateWizardData({ title: e.target.value })}
          maxLength="100"
          style={{ 
            borderRadius: '12px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: 'white'
          }}
          autoFocus
        />
        <small className="text-muted mt-1 d-block">
          {wizardData.title.length}/100 caractères
        </small>
      </div>
      
      <div className="mb-4">
        <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>
          Description
        </label>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Décrivez votre vidéo..."
          value={wizardData.description}
          onChange={(e) => updateWizardData({ description: e.target.value })}
          maxLength="500"
          style={{ 
            borderRadius: '12px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            resize: 'none'
          }}
        />
        <small className="text-muted mt-1 d-block">
          {wizardData.description.length}/500 caractères
        </small>
      </div>
      
      {/* Mini aperçu de la vidéo */}
      {wizardData.videoPreview && (
        <div className="mt-4 p-3" style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px'
        }}>
          <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>
            Aperçu
          </label>
          <video
            src={wizardData.videoPreview}
            controls
            style={{
              width: '100%',
              maxHeight: '200px',
              borderRadius: '8px'
            }}
          />
          {wizardData.videoDuration > 0 && (
            <div className="mt-2 text-muted small">
              Durée: {Math.floor(wizardData.videoDuration / 60)}:
              {Math.floor(wizardData.videoDuration % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  const stepLabels = ['Vidéo', 'Musique', 'Infos'];
  
  return (
    <div className="create-video-wizard" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '16px'
    }}>
      <Card className="border-0 shadow-lg" style={{ 
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px'
      }}>
        <Card.Body className="p-4">
          {/* Header avec titre et progression */}
          <div className="cw-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h3 className="cw-header-title" style={{ color: 'white', fontWeight: 'bold' }}>
                🎬 Nouvelle vidéo
              </h3>
              {!isProActive ? (
                <Badge bg="warning" text="dark" className="p-2">
                  ⚡ {maxDuration}s max
                </Badge>
              ) : (
                <Badge bg="primary" className="p-2">
                  ⭐ Pro: {maxDuration}s
                </Badge>
              )}
            </div>
            <StepIndicator currentStep={currentStep} totalSteps={3} labels={stepLabels} />
          </div>
          
          {/* Messages d'erreur */}
          {error && (
            <Alert 
              variant="danger" 
              className="mt-3" 
              onClose={() => setError(null)} 
              dismissible
              style={{ borderRadius: '12px' }}
            >
              {error}
            </Alert>
          )}
          
          {/* Contenu des steps */}
          <div className="cw-step-content mt-4">
            {currentStep === 1 && renderStep1()}
            
            {currentStep === 2 && (
              <StepMusicSelection 
                wizardData={wizardData}
                updateData={updateWizardData}
                videoType="video"
              />
            )}
            
            {currentStep === 3 && renderStep3()}
          </div>
          
          {/* Boutons de navigation */}
          <div className="cw-footer mt-4 d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={prevStep}
              disabled={loading || currentStep === 1}
              style={{ 
                borderRadius: '40px', 
                padding: '10px 24px',
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'white'
              }}
            >
              <ArrowLeft className="me-2" />
              Retour
            </Button>
            
            {currentStep < 3 ? (
              <Button
                variant="primary"
                onClick={nextStep}
                disabled={loading || (currentStep === 1 && !isStep1Valid)}
                style={{ 
                  borderRadius: '40px', 
                  padding: '10px 24px', 
                  background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                  border: 'none',
                  fontWeight: 'bold'
                }}
              >
                Suivant
                <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={loading || !isStep3Valid}
                style={{ 
                  borderRadius: '40px', 
                  padding: '10px 24px', 
                  background: 'linear-gradient(135deg, #28a745, #20c997)', 
                  border: 'none',
                  fontWeight: 'bold'
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {uploadProgress > 0 ? `Upload ${uploadProgress}%...` : 'Publication...'}
                  </>
                ) : (
                  <>
                    <CloudUpload className="me-2" />
                    Publier
                  </>
                )}
              </Button>
            )}
          </div>
          
          {/* Barre de progression upload */}
          {loading && uploadProgress > 0 && (
            <ProgressBar 
              now={uploadProgress} 
              label={`${uploadProgress}%`} 
              striped 
              animated 
              className="mt-3"
              style={{ borderRadius: '20px', height: '8px' }}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateVideoWizard;