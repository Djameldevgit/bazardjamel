// components/Video/CreateVideoWizard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge } from 'react-bootstrap';
import { 
  ArrowLeft, 
  ArrowRight,
  CloudUpload,
  Cart3,
  MusicNote,
  Briefcase,
  Star
} from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepVideoUpload from './StepVideoUpload';
import StepMusicSelection from './StepMusicSelection';
import StepVideoInfo from './StepVideoInfo';
import { createVideo } from '../../redux/actions/videoAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { videoUpload } from '../../utils/imageUpload';
import './CreateVideoWizard.css';
import HeaderVideo from '../HeaderVideo';

// ============================================
// CATÉGORIES POUR VIDÉOS COMMERCIALES
// ============================================
const commercialCategories = [
  { name: 'Véhicules', slug: 'videos-vehicules', icon: '🚗', description: 'Voitures, motos, poids lourds' },
  { name: 'Immobilier', slug: 'videos-immobilier', icon: '🏠', description: 'Appartements, maisons, terrains' },
  { name: 'Téléphones', slug: 'videos-telephones', icon: '📱', description: 'Smartphones, accessoires' },
  { name: 'Informatique', slug: 'videos-informatique', icon: '💻', description: 'PC, laptops, composants' },
  { name: 'Électroménager', slug: 'videos-electromenager', icon: '🔌', description: 'Réfrigérateurs, lave-linge' },
  { name: 'Art', slug: 'videos-art', icon: '🎨', description: 'Peintures, sculptures, artisanat' },
  { name: 'Mode & Vêtements', slug: 'videos-mode-vetements', icon: '👕', description: 'Vêtements, chaussures, accessoires' },
  { name: 'Maison & Jardin', slug: 'videos-maison-jardin', icon: '🏡', description: 'Décoration, mobilier, outils' },
  { name: 'Sport & Loisirs', slug: 'videos-sport-loisirs', icon: '⚽', description: 'Équipements sportifs' },
  { name: 'Alimentaires', slug: 'videos-alimentaires', icon: '🍔', description: 'Produits alimentaires' },
  { name: 'Meubles', slug: 'videos-meubles', icon: '🛋️', description: 'Canapés, tables, chaises' },
  { name: 'Pièces Détachées', slug: 'videos-pieces-detachees', icon: '🔧', description: 'Pièces auto, électronique' },
  { name: 'Santé & Beauté', slug: 'videos-sante-beaute', icon: '💄', description: 'Cosmétiques, bien-être' },
  { name: 'Services', slug: 'videos-services', icon: '🔨', description: 'Services professionnels' },
  { name: 'Tutoriels', slug: 'videos-tutoriels', icon: '📚', description: 'DIY, formations' },
  { name: 'Reviews', slug: 'videos-reviews', icon: '⭐', description: 'Tests et avis produits' }
];

// ============================================
// CATÉGORIES POUR VIDÉOS SOCIALES (TikTok style)
// ============================================
const socialCategories = [
  { name: 'Tendance', slug: 'tendance', icon: '🔥', description: 'Les vidéos qui buzz' },
  { name: 'Humour', slug: 'humour', icon: '😂', description: 'Funny, memes, blagues' },
  { name: 'Musique', slug: 'musique', icon: '🎵', description: 'Chants, covers, instruments' },
  { name: 'Danse', slug: 'danse', icon: '💃', description: 'Chorégraphies, challenges' },
  { name: 'Sport', slug: 'sport', icon: '⚽', description: 'Fitness, exploits' },
  { name: 'Animaux', slug: 'animaux', icon: '🐕', description: 'Pets, animaux mignons' },
  { name: 'Voyage', slug: 'voyage', icon: '✈️', description: 'Destinations, aventures' },
  { name: 'Cuisine', slug: 'cuisine', icon: '🍳', description: 'Recettes, food' },
  { name: 'Beauté', slug: 'beaute', icon: '💄', description: 'Makeup, soins' },
  { name: 'Mode', slug: 'mode', icon: '👗', description: 'Style, outfits' },
  { name: 'Gaming', slug: 'gaming', icon: '🎮', description: 'Jeux vidéo, streams' },
  { name: 'Éducation', slug: 'education', icon: '📖', description: 'Savoir, astuces' },
  { name: 'Science', slug: 'science', icon: '🔬', description: 'Découvertes, expériences' },
  { name: 'Nature', slug: 'nature', icon: '🌿', description: 'Paysages, écologie' },
  { name: 'Art', slug: 'art', icon: '🎨', description: 'Créations, dessins' },
  { name: 'LifeStyle', slug: 'lifestyle', icon: '✨', description: 'Quotidien, vlogs' }
];

const getCategoryBySlug = (slug, videoType) => {
  const categories = videoType === 'commercial' ? commercialCategories : socialCategories;
  return categories.find(cat => cat.slug === slug);
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
  const [videoType, setVideoType] = useState(null); // 'commercial' ou 'social'
  const isMountedRef = useRef(true);
  
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
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (wizardData.videoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(wizardData.videoPreview);
      }
    };
  }, []);
  
  const isProActive = user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  const maxDuration = isProActive ? 60 : 30;
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
  const validateStep = (step) => {
    switch(step) {
      case 0:
      case 1:
        if (!videoType) {
          setError('Veuillez choisir le type de vidéo');
          return false;
        }
        return true;
      case 2:
        if (!wizardData.videoSource) {
          setError('Veuillez sélectionner une source vidéo');
          return false;
        }
        if (wizardData.videoSource === 'gallery' && !wizardData.videoFile) {
          setError('Veuillez sélectionner une vidéo');
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
      case 3:
        break;
      case 4:
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
    if (isMountedRef.current) {
      setWizardData(prev => ({ ...prev, ...newData }));
    }
  };
  
  const extractVideoId = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/[?&]v=([^&]+)/);
      return match ? match[1] : null;
    }
    if (url.includes('vimeo.com')) {
      const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:video\/|)(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  };
  
  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setLoading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      let videoUrl, videoId, thumbnail, videoDuration;
      
      if (wizardData.videoSource === 'gallery' || wizardData.videoSource === 'camera') {
        if (!wizardData.videoFile) {
          throw new Error('Aucun fichier vidéo');
        }
        
        const result = await videoUpload(wizardData.videoFile, (progress) => {
          if (isMountedRef.current) setUploadProgress(progress);
        });
        
        videoUrl = result.url;
        videoId = result.public_id;
        thumbnail = result.thumbnail;
        videoDuration = wizardData.videoDuration;
        
      } else if (wizardData.videoSource === 'link') {
        videoUrl = wizardData.videoUrl;
        videoId = extractVideoId(wizardData.videoUrl);
        thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        videoDuration = 0;
      } else {
        throw new Error('Source vidéo non valide');
      }
      
      const selectedCategory = getCategoryBySlug(wizardData.categorySlug, videoType);
      
      // ✅ Construire le slug en fonction du type de vidéo
      const categorySlug = videoType === 'commercial' 
        ? `commercial-${wizardData.categorySlug}`
        : `social-${wizardData.categorySlug}`;
      
      const videoData = {
        title: wizardData.title,
        description: wizardData.description,
        shortDescription: wizardData.description?.substring(0, 300),
        videoUrl,
        videoType: wizardData.videoSource === 'link' ? 'youtube' : 'local',
        videoId,
        thumbnail,
        category: selectedCategory?.name,
        categorySlug: categorySlug,
        tags: [...wizardData.tags, videoType === 'commercial' ? 'commercial' : 'social'],
        duration: videoDuration,
        isCommercial: videoType === 'commercial',
        music: wizardData.selectedMusic ? {
          id: wizardData.selectedMusic.id,
          title: wizardData.selectedMusic.title,
          volume: wizardData.musicVolume
        } : null
      };
      
      const result = await dispatch(createVideo(videoData, auth.token, auth, socket));
      
      if (result?.success && isMountedRef.current) {
        if (wizardData.videoPreview?.startsWith('blob:')) {
          URL.revokeObjectURL(wizardData.videoPreview);
        }
        
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: '🎬 Vidéo publiée avec succès !' }
        });
        
        if (onSuccess) {
          onSuccess(result.video);
        } else {
          setTimeout(() => {
            history.push(`/video/${result.video._id}`);
          }, 1500);
        }
      } else {
        setError(result?.error || 'Erreur lors de la publication');
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setUploadProgress(0);
      }
    }
  };
  
  // ✅ Sélection du type de vidéo
  if (!videoType) {
    return (
      <div className="create-video-wizard">
        <Card className="border-0 shadow-lg">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <h3 className="cw-header-title">🎬 Créer une vidéo</h3>
              <p className="text-muted">Choisissez le type de contenu que vous souhaitez partager</p>
            </div>
            
            <div className="video-type-selector">
              {/* Option Commerciale */}
              <div 
                className="video-type-card"
                onClick={() => setVideoType('commercial')}
              >
                <div className="video-type-icon commercial">
                  <Briefcase size={32} />
                </div>
                <h4>Vidéo Commerciale</h4>
                <p>Publiez une vidéo pour vendre un produit ou service</p>
                <div className="video-type-features">
                  <span>🛍️ Marketplace</span>
                  <span>🏷️ Catégories produits</span>
                  <span>📦 Mise en avant boutique</span>
                </div>
                <Button variant="primary" className="mt-3">
                  Choisir <ArrowRight size={14} className="ms-2" />
                </Button>
              </div>
              
              {/* Option Sociale */}
              <div 
                className="video-type-card"
                onClick={() => setVideoType('social')}
              >
                <div className="video-type-icon social">
                  <MusicNote size={32} />
                </div>
                <h4>Vidéo Sociale</h4>
                <p>Partagez du contenu divertissant style TikTok/Reels</p>
                <div className="video-type-features">
                  <span>🎵 Musique tendance</span>
                  <span>🔥 Challenges viraux</span>
                  <span>💬 Communauté active</span>
                </div>
                <Button variant="primary" className="mt-3">
                  Choisir <ArrowRight size={14} className="ms-2" />
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <Button variant="outline-secondary" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
  
  const categories = videoType === 'commercial' ? commercialCategories : socialCategories;
  const stepLabels = videoType === 'commercial' 
    ? ['Type', 'Vidéo', 'Musique', 'Infos']
    : ['Type', 'Vidéo', 'Musique', 'Détails'];
  
  return (
    <div className="create-video-wizard">
      <Card className="border-0 shadow-lg">
       
          <div className="cw-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div>
                <h3 className="cw-header-title">
                  {videoType === 'commercial' ? '🛍️ Vidéo Commerciale' : '🎵 Vidéo Sociale'}
                </h3>
                <Badge bg={videoType === 'commercial' ? 'info' : 'success'} className="mt-1">
                  {videoType === 'commercial' ? 'Marketplace' : 'Style TikTok'}
                </Badge>
              </div>
              {!isProActive ? (
                <Badge bg="warning" text="dark" className="p-2">
                  ⚡ {maxDuration}s max
                </Badge>
              ) : (
                <Badge bg="primary" className="p-2">
                  ⭐ Pro: {maxDuration}s
                </Badge>
              )}
              <Button 
                variant="link" 
                size="sm" 
                className="text-muted"
                onClick={() => setVideoType(null)}
              >
                ← Changer de type
              </Button>
            </div>
            <StepIndicator currentStep={currentStep} totalSteps={4} labels={stepLabels} />
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
                videoType={videoType}
              />
            )}
            
            {currentStep === 2 && (
              <StepMusicSelection 
                wizardData={wizardData}
                updateData={updateWizardData}
                videoType={videoType}
              />
            )}
            
            {currentStep === 3 && (
              <StepVideoInfo 
                wizardData={wizardData}
                updateData={updateWizardData}
                videoCategories={categories}
                videoType={videoType}
              />
            )}
          </div>
          
          <div className="cw-footer">
            <Button
              variant="outline-secondary"
              className="cw-btn cw-btn-secondary"
              onClick={prevStep}
              disabled={loading}
            >
              <ArrowLeft className="me-2" />
              Retour
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
        <HeaderVideo/>
      </Card>
     
    </div>
  );
};

export default CreateVideoWizard;