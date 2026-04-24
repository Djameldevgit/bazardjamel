// components/Video/CreateVideoWizard.jsx - CON CSS DEDICADO
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge } from 'react-bootstrap';
import { 
  
  ArrowLeft, 
  ArrowRight,
  CloudUpload 
} from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepVideoUpload from './StepVideoUpload';
import StepMusicSelection from './StepMusicSelection';
import StepVideoInfo from './StepVideoInfo';
import { createVideo } from '../../redux/actions/videoAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { videoUpload } from '../../utils/imageUpload';

// ✅ IMPORTAR CSS DEDICADO
import './CreateVideoWizard.css';

// Categorías
const videoCategories = [
  { name: 'Véhicules', slug: 'videos-vehicules', icon: '🚗' },
  { name: 'Immobilier', slug: 'videos-immobilier', icon: '🏠' },
  { name: 'Téléphones', slug: 'videos-telephones', icon: '📱' },
  { name: 'Informatique', slug: 'videos-informatique', icon: '💻' },
  { name: 'Électroménager', slug: 'videos-electromenager', icon: '🔌' },
  { name: 'Art', slug: 'videos-art', icon: '🎨' },
  { name: 'Mode & Vêtements', slug: 'videos-mode-vetements', icon: '👕' },
  { name: 'Maison & Jardin', slug: 'videos-maison-jardin', icon: '🏡' },
  { name: 'Sport & Loisirs', slug: 'videos-sport-loisirs', icon: '⚽' },
  { name: 'Alimentaires', slug: 'videos-alimentaires', icon: '🍔' },
  { name: 'Meubles', slug: 'videos-meubles', icon: '🛋️' },
  { name: 'Pièces Détachées', slug: 'videos-pieces-detachees', icon: '🔧' },
  { name: 'Santé & Beauté', slug: 'videos-sante-beaute', icon: '💄' },
  { name: 'Services', slug: 'videos-services', icon: '🔨' },
  { name: 'Tutoriels', slug: 'videos-tutoriels', icon: '📚' },
  { name: 'Reviews', slug: 'videos-reviews', icon: '⭐' }
];

const getCategoryBySlug = (slug) => {
  return videoCategories.find(cat => cat.slug === slug);
};

const CreateVideoWizard = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const { user } = auth;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [wizardData, setWizardData] = useState({
    videoSource: null,
    videoFile: null,
    videoUrl: '',
    videoType: 'local',
    videoId: null,
    videoPreview: null,
    videoDuration: 0,
    selectedMusic: null,
    musicVolume: 70,
    originalAudio: true,
    title: '',
    description: '',
    categorySlug: '',
    tags: []
  });
  
  const isProActive = user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  const maxDuration = isProActive ? 30 : 20;
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
  const validateStep = (step) => {
    switch(step) {
      case 1:
        if (!wizardData.videoSource) {
          setError('Veuillez sélectionner une source vidéo');
          return false;
        }
        if (wizardData.videoSource === 'gallery' && !wizardData.videoFile) {
          setError('Veuillez sélectionner une vidéo de votre galerie');
          return false;
        }
        if (wizardData.videoSource === 'camera' && !wizardData.videoFile) {
          setError('Veuillez enregistrer une vidéo');
          return false;
        }
        if (wizardData.videoSource === 'link' && !wizardData.videoUrl) {
          setError('Veuillez entrer un lien valide');
          return false;
        }
        if (wizardData.videoDuration > maxDuration && wizardData.videoSource !== 'link') {
          setError(`La vidéo ne doit pas dépasser ${maxDuration} secondes`);
          return false;
        }
        break;
      case 2:
        break;
      case 3:
        if (!wizardData.title.trim()) {
          setError('Veuillez ajouter un titre');
          return false;
        }
        if (!wizardData.categorySlug) {
          setError('Veuillez sélectionner une catégorie');
          return false;
        }
        break;
      default:
        return true;
    }
    setError(null);
    return true;
  };
  
  const updateWizardData = (newData) => {
    setWizardData(prev => ({ ...prev, ...newData }));
  };
  
  const extractVideoId = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/[?&]v=([^&]+)/);
      return match ? match[1] : null;
    }
    if (url.includes('vimeo.com')) {
      const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
      return match ? match[1] : null;
    }
    return null;
  };
  
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      let videoUrl, videoId, thumbnail, videoDuration;
      
      if (wizardData.videoSource === 'gallery' || wizardData.videoSource === 'camera') {
        if (!wizardData.videoFile) {
          throw new Error('No hay archivo de video');
        }
        
        const result = await videoUpload(wizardData.videoFile, (progress) => {
          setUploadProgress(progress);
        });
        
        videoUrl = result.url;
        videoId = result.public_id;
        thumbnail = result.thumbnail;
        videoDuration = wizardData.videoDuration;
        
      } else if (wizardData.videoSource === 'link') {
        videoUrl = wizardData.videoUrl;
        videoId = extractVideoId(wizardData.videoUrl);
        thumbnail = wizardData.videoType === 'youtube' 
          ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
          : '';
        videoDuration = 0;
      } else {
        throw new Error('Source de vidéo non valide');
      }
      
      const selectedCategory = getCategoryBySlug(wizardData.categorySlug);
      
      const videoData = {
        title: wizardData.title,
        description: wizardData.description,
        shortDescription: wizardData.description?.substring(0, 300),
        videoUrl,
        videoType: wizardData.videoSource === 'link' ? wizardData.videoType : 'local',
        videoId,
        thumbnail,
        category: selectedCategory?.name,
        categorySlug: wizardData.categorySlug,
        tags: wizardData.tags,
        duration: videoDuration,
        music: wizardData.selectedMusic ? {
          id: wizardData.selectedMusic.id,
          title: wizardData.selectedMusic.title,
          volume: wizardData.musicVolume
        } : null
      };
      
      const result = await dispatch(createVideo(videoData, auth.token, auth, socket));
      
      if (result?.success) {
        if (wizardData.videoPreview && wizardData.videoPreview.startsWith('blob:')) {
          URL.revokeObjectURL(wizardData.videoPreview);
        }
        
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: '🎬 Vidéo créée avec succès !' }
        });
        
        if (onSuccess) {
          onSuccess(result.video);
        } else {
          setTimeout(() => {
            history.push(`/video/${result.video._id}`);
          }, 2000);
        }
      } else {
        setError(result?.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error('❌ Error en handleSubmit:', err);
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="create-video-wizard">
      <Card className="border-0 shadow-lg">
        <Card.Body className="p-4">
          <div className="cw-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h3 className="cw-header-title">🎬 Créer une vidéo</h3>
              {!isProActive ? (
                <Badge bg="warning" text="dark" className="p-2">
                  ⚡ {maxDuration} secondes max
                </Badge>
              ) : (
                <Badge bg="primary" className="p-2">
                  ⭐ Pro: {maxDuration} secondes
                </Badge>
              )}
            </div>
            <StepIndicator currentStep={currentStep} />
          </div>
          
          {error && (
            <Alert variant="danger" className="cw-alert" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          <div className="cw-step-content">
            {currentStep === 1 && (
              <StepVideoUpload 
                wizardData={wizardData}
                updateData={updateWizardData}
                maxDuration={maxDuration}
                isProActive={isProActive}
              />
            )}
            
            {currentStep === 2 && (
              <StepMusicSelection 
                wizardData={wizardData}
                updateData={updateWizardData}
              />
            )}
            
            {currentStep === 3 && (
              <StepVideoInfo 
                wizardData={wizardData}
                updateData={updateWizardData}
                videoCategories={videoCategories}
              />
            )}
          </div>
          
          <div className="cw-footer">
            <Button
              variant="outline-secondary"
              className="cw-btn cw-btn-secondary"
              onClick={currentStep === 1 ? onCancel : prevStep}
              disabled={loading}
            >
              <ArrowLeft className="me-2" />
              {currentStep === 1 ? 'Annuler' : 'Retour'}
            </Button>
            
            {currentStep < 3 ? (
              <Button
                variant="primary"
                className="cw-btn cw-btn-primary"
                onClick={nextStep}
                disabled={loading}
              >
                Suivant
                <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button
                variant="success"
                className="cw-btn cw-btn-success"
                onClick={handleSubmit}
                disabled={loading}
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
          
          {loading && uploadProgress > 0 && (
            <ProgressBar 
              now={uploadProgress} 
              label={`${uploadProgress}%`} 
              striped 
              animated 
              className="cw-progress mt-3"
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateVideoWizard;