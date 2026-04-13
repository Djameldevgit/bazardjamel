// components/Video/CreateVideoWizard.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge } from 'react-bootstrap';
import { 
  Image, 
  Camera, 
  Link, 
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
import './css/CreateVideoWizard.css';

// Categorías
const videoCategories = [
  { name: 'Véhicules', slug: 'videos-vehicules', icon: '🚗' },
  { name: 'Immobilier', slug: 'videos-immobilier', icon: '🏠' },
  { name: 'Téléphones', slug: 'videos-telephones', icon: '📱' },
  { name: 'Informatique', slug: 'videos-informatique', icon: '💻' },
  { name: 'Électroménager', slug: 'videos-electromenager', icon: '🔌' },
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
  const { auth } = useSelector(state => state);
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
  const maxDuration = isProActive ? 60 : 15;
  
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
  
  // ✅ FUNCIÓN PRINCIPAL DE ENVÍO USANDO videoUpload
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      let videoUrl, videoId, thumbnail, videoDuration;
      
      // 🔥 SUBIR VIDEO A CLOUDINARY USANDO videoUpload
      if (wizardData.videoSource === 'gallery' || wizardData.videoSource === 'camera') {
        if (!wizardData.videoFile) {
          throw new Error('No hay archivo de video');
        }
        
        console.log('📹 Subiendo video a Cloudinary usando videoUpload...');
        console.log('Archivo:', wizardData.videoFile.name, `${(wizardData.videoFile.size / 1024 / 1024).toFixed(2)} MB`);
        
        // ✅ Usar la función videoUpload importada
        const result = await videoUpload(wizardData.videoFile, (progress) => {
          console.log(`📊 Progreso de subida: ${progress}%`);
          setUploadProgress(progress);
        });
        
        console.log('✅ Video subido exitosamente a Cloudinary:', result);
        
        videoUrl = result.url;
        videoId = result.public_id;
        thumbnail = result.thumbnail;
        videoDuration = wizardData.videoDuration;
        
      } else if (wizardData.videoSource === 'link') {
        // Video por link (YouTube/Vimeo)
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
      
      console.log('📤 Enviando a API:', videoData);
      
      const result = await dispatch(createVideo(videoData, auth.token));
      
      if (result?.success) {
        // Limpiar preview local
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
          <div className="wizard-header mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0">🎬 Créer une vidéo</h3>
              {!isProActive && (
                <Badge bg="warning" text="dark" className="p-2">
                  ⚡ {maxDuration} secondes max
                </Badge>
              )}
              {isProActive && (
                <Badge bg="primary" className="p-2">
                  ⭐ Pro: {maxDuration} secondes
                </Badge>
              )}
            </div>
            <StepIndicator currentStep={currentStep} />
          </div>
          
          {error && (
            <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          <div className="wizard-content">
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
              />
            )}
          </div>
          
          <div className="wizard-footer mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                onClick={currentStep === 1 ? onCancel : prevStep}
                disabled={loading}
              >
                <ArrowLeft className="me-2" />
                {currentStep === 1 ? 'Annuler' : 'Retour'}
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  variant="primary"
                  onClick={nextStep}
                  disabled={loading}
                  className="px-4"
                >
                  Suivant
                  <ArrowRight className="ms-2" />
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4"
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
                className="mt-3"
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateVideoWizard;