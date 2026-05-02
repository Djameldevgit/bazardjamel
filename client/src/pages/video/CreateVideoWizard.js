import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, CloudUpload, Image, Camera, X, CheckCircle } from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepMusicSelection from './StepMusicSelection';
import { createVideo } from '../../redux/actions/videoAction';
import { videoUpload } from '../../utils/imageUpload';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import './CreateVideoWizard.css';

const CreateVideoWizard = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const { user } = auth;
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const isMountedRef = useRef(true);
  
  const [wizardData, setWizardData] = useState({
    videoSource: null,
    videoFile: null,
    videoPreview: null,
    videoDuration: 0,
    videoUrl: '',
    videoPublicId: '',
    thumbnail: '',
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
  
  // ✅ Detener audios al cambiar de step
  useEffect(() => {
    const handleStopAudio = () => {
      const audios = document.querySelectorAll('audio');
      audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
    
    // Detener al cambiar de step
    handleStopAudio();
    
    return () => {
      handleStopAudio();
    };
  }, [currentStep]);
  
  const isStep1Valid = useMemo(() => {
    if (!wizardData.videoSource) return false;
    if (!wizardData.videoUrl) return false;
    if (wizardData.videoDuration > maxDuration) return false;
    return true;
  }, [wizardData.videoSource, wizardData.videoUrl, wizardData.videoDuration, maxDuration]);
  
  const isStep3Valid = useMemo(() => {
    return !!wizardData.title.trim();
  }, [wizardData.title]);
  
  const handleGallerySelect = () => fileInputRef.current?.click();
  const handleCameraSelect = () => cameraInputRef.current?.click();
  
  const handleFileChange = useCallback(async (e, isCamera = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Veuillez sélectionner un fichier vidéo valide');
      return;
    }
    
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(tempVideo.src);
      const duration = tempVideo.duration;
      if (duration > maxDuration) {
        setError(`La vidéo ne doit pas dépasser ${maxDuration} secondes`);
        return;
      }
      setLoading(true);
      setUploadProgress(0);
      videoUpload(file, (progress) => setUploadProgress(progress))
        .then(result => {
          if (isMountedRef.current) {
            setWizardData(prev => ({
              ...prev,
              videoSource: isCamera ? 'camera' : 'gallery',
              videoFile: file,
              videoPreview: URL.createObjectURL(file),
              videoDuration: duration,
              videoUrl: result.url,
              videoPublicId: result.public_id,
              thumbnail: result.thumbnail
            }));
            setError(null);
          }
        })
        .catch(err => {
          console.error(err);
          setError('Erreur lors du téléchargement de la vidéo');
        })
        .finally(() => {
          if (isMountedRef.current) setLoading(false);
        });
    };
    tempVideo.onerror = () => {
      URL.revokeObjectURL(tempVideo.src);
      setError('Erreur lors de la lecture de la vidéo');
    };
    tempVideo.src = URL.createObjectURL(file);
  }, [maxDuration]);
  
  const clearVideo = () => {
    if (wizardData.videoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(wizardData.videoPreview);
    }
    setWizardData(prev => ({
      ...prev,
      videoSource: null,
      videoFile: null,
      videoPreview: null,
      videoDuration: 0,
      videoUrl: '',
      videoPublicId: '',
      thumbnail: ''
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };
  
  const nextStep = () => {
    if (currentStep === 1 && !isStep1Valid) {
      setError('Veuillez sélectionner et télécharger une vidéo valide');
      return;
    }
    if (currentStep === 3 && !isStep3Valid) {
      setError('Veuillez ajouter un titre');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
    setError(null);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
    window.scrollTo(0, 0);
  };
  
  const updateWizardData = useCallback((newData) => {
    if (isMountedRef.current) setWizardData(prev => ({ ...prev, ...newData }));
  }, []);
  
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    
    console.log("📦 selectedMusic completo:", wizardData.selectedMusic);
    
    const payload = {
      title: wizardData.title,
      description: wizardData.description,
      videoUrl: wizardData.videoUrl,
      videoPublicId: wizardData.videoPublicId,
      thumbnail: wizardData.thumbnail,
      duration: wizardData.videoDuration,
      music: wizardData.selectedMusic ? {
        id: wizardData.selectedMusic.id,
        title: wizardData.selectedMusic.title,
        artist: wizardData.selectedMusic.artist,
        audioUrl: wizardData.selectedMusic.audioUrl,
        audioPublicId: wizardData.selectedMusic.audioPublicId || wizardData.selectedMusic.publicId,
        volume: wizardData.musicVolume
      } : null
    };
    
    console.log("📤 Payload a enviar:", JSON.stringify(payload, null, 2));
    
    try {
      const res = await dispatch(createVideo(payload, auth.token));
      if (res?.success) {
        const isAdmin = auth.user?.role === 'admin';
        if (isAdmin) {
          dispatch({ type: GLOBALTYPES.ALERT, payload: { success: '✅ Vidéo publiée avec succès !' } });
          history.push('/');
        } else {
          dispatch({ type: GLOBALTYPES.ALERT, payload: { success: '📹 Vidéo envoyée ! Elle sera publiée après approbation.' } });
          history.push('/');
        }
      } else {
        setError(res?.message || 'Erreur lors de la création de la vidéo');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur réseau, veuillez réessayer');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Render Step1
  const renderStep1 = () => (
    <div className="step1-container" style={{ padding: '0 8px', minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '30px', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={handleGallerySelect} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '60px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
            <Image size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff', fontWeight: 500 }}>Galerie</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={handleCameraSelect} style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', border: 'none', borderRadius: '60px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)' }}>
            <Camera size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff', fontWeight: 500 }}>Caméra</div>
        </div>
      </div>
      <input type="file" ref={fileInputRef} accept="video/mp4,video/quicktime,video/webm" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, false)} />
      <input type="file" ref={cameraInputRef} accept="video/mp4,video/quicktime,video/webm" capture="environment" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, true)} />
      
      {loading && uploadProgress > 0 && (
        <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} striped animated className="mt-3" style={{ borderRadius: '20px', height: '8px' }} />
      )}
      
      {wizardData.videoPreview && (
        <div className="video-preview-full" style={{ flex: 1, marginTop: '20px', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000', minHeight: '400px' }}>
          <video src={wizardData.videoPreview} controls style={{ width: '100%', height: 'auto', maxHeight: '60vh', objectFit: 'contain', background: '#000' }} autoPlay={false} controlsList="nodownload" />
          <Badge bg="dark" style={{ position: 'absolute', bottom: '10px', right: '10px', opacity: 0.8, fontSize: '12px', padding: '4px 8px' }}>
            ⏱️ {Math.floor(wizardData.videoDuration)}s
          </Badge>
          <Button variant="danger" size="sm" style={{ position: 'absolute', top: '10px', right: '10px', borderRadius: '30px', opacity: 0.9 }} onClick={clearVideo}>
            <X size={14} className="me-1" /> Changer
          </Button>
        </div>
      )}
      
      {!wizardData.videoPreview && !loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', marginTop: '20px', minHeight: '300px', color: '#fff', textAlign: 'center' }}>
          <div>
            <Camera size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
            <p>Sélectionnez une vidéo depuis<br />votre galerie ou votre caméra</p>
            <small style={{ opacity: 0.6 }}>Max {maxDuration} secondes</small>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderStep3 = () => (
    <div className="step3-container" style={{ padding: '20px' }}>
      <h5 className="mb-4" style={{ color: 'white', fontWeight: 'bold' }}>📝 Détails de la vidéo</h5>
      <div className="mb-4">
        <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>Titre *</label>
        <input type="text" className="form-control form-control-lg" placeholder="Donnez un titre à votre vidéo..." value={wizardData.title} onChange={(e) => updateWizardData({ title: e.target.value })} maxLength="100" style={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }} autoFocus />
        <small className="text-muted mt-1 d-block">{wizardData.title.length}/100 caractères</small>
      </div>
      <div className="mb-4">
        <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>Description</label>
        <textarea className="form-control" rows="4" placeholder="Décrivez votre vidéo..." value={wizardData.description} onChange={(e) => updateWizardData({ description: e.target.value })} maxLength="500" style={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', resize: 'none' }} />
        <small className="text-muted mt-1 d-block">{wizardData.description.length}/500 caractères</small>
      </div>
      {wizardData.videoPreview && (
        <div className="mt-4 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>Aperçu</label>
          <video src={wizardData.videoPreview} controls style={{ width: '100%', maxHeight: '200px', borderRadius: '8px' }} />
          <div className="mt-2 text-muted small">Durée: {Math.floor(wizardData.videoDuration / 60)}:{Math.floor(wizardData.videoDuration % 60).toString().padStart(2, '0')}</div>
        </div>
      )}
    </div>
  );
  
  const stepLabels = ['Vidéo', 'Musique', 'Infos'];
  
  return (
    <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px' }}>
      <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '24px' }}>
        <Card.Body className="p-4">
          <div className="cw-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h3 className="cw-header-title" style={{ color: 'white', fontWeight: 'bold' }}>🎬 Nouvelle vidéo</h3>
              {!isProActive ? <Badge bg="warning" text="dark" className="p-2">⚡ {maxDuration}s max</Badge> : <Badge bg="primary" className="p-2">⭐ Pro: {maxDuration}s</Badge>}
            </div>
            <StepIndicator currentStep={currentStep} totalSteps={3} labels={stepLabels} />
          </div>
          
          {error && <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible style={{ borderRadius: '12px' }}>{error}</Alert>}
          
          <div className="cw-step-content mt-4">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && <StepMusicSelection wizardData={wizardData} updateData={updateWizardData} />}
            {currentStep === 3 && renderStep3()}
          </div>
          
          <div className="cw-footer mt-4 d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={prevStep} disabled={loading || submitting || currentStep === 1} style={{ borderRadius: '40px', padding: '10px 24px', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <ArrowLeft className="me-2" /> Retour
            </Button>
            {currentStep < 3 ? (
              <Button variant="primary" onClick={nextStep} disabled={loading || (currentStep === 1 && !isStep1Valid)} style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', fontWeight: 'bold' }}>
                Suivant <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit} disabled={submitting || !isStep3Valid} style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none', fontWeight: 'bold' }}>
                {submitting ? <><Spinner size="sm" className="me-2" /> Publication en cours...</> : <><CloudUpload className="me-2" /> Publier</>}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateVideoWizard;