// components/Video/CreateVideoWizard.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge } from 'react-bootstrap';
import { 
  ArrowLeft, 
  ArrowRight,
  CloudUpload,
  Briefcase,
  MusicNote,
  Image as ImageIcon,
  Camera,
  Link45deg,
  X
} from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepMusicSelection from './StepMusicSelection';
import StepVideoUpload from './StepVideoUpload';
import StepVideoInfo from './StepVideoInfo';
import { createVideo } from '../../redux/actions/videoAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { videoUpload } from '../../utils/imageUpload';
import './CreateVideoWizard.css';
import HeaderVideo from '../HeaderVideo';



 
// ============================================
// CATÉGORIES (commerciales y sociales)
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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const isMountedRef = useRef(true);
  
  const [wizardData, setWizardData] = useState({
    videoType: null,
    videoSource: null,
    videoFile: null,
    videoUrl: '',
    videoPreview: null,
    videoDuration: 0,
    videoId: null,
    selectedMusic: null,
    musicVolume: 70,
    originalAudio: true,
    title: '',
    description: '',
    categorySlug: '',
    tags: []
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
  
  const isStep1Valid = useMemo(() => {
    if (!wizardData.videoType) return false;
    if (!wizardData.videoSource) return false;
    if (wizardData.videoSource === 'link' && !wizardData.videoUrl) return false;
    if ((wizardData.videoSource === 'gallery' || wizardData.videoSource === 'camera') && !wizardData.videoFile) return false;
    if (wizardData.videoDuration > maxDuration && wizardData.videoSource !== 'link') return false;
    return true;
  }, [wizardData.videoType, wizardData.videoSource, wizardData.videoUrl, wizardData.videoFile, wizardData.videoDuration, maxDuration]);
  
  const isStep3Valid = useMemo(() => {
    if (!wizardData.title.trim()) return false;
    if (!wizardData.categorySlug) return false;
    return true;
  }, [wizardData.title, wizardData.categorySlug]);
  
  const handleSelectVideoType = useCallback((type) => {
    setWizardData(prev => ({ ...prev, videoType: type }));
  }, []);
  
  const handleGallerySelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  const handleCameraSelect = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);
  
  const handleLinkSelect = useCallback(() => {
    const url = prompt('📎 Entrez le lien de la vidéo (YouTube, Vimeo, etc.) :');
    if (url && url.trim()) {
      processVideoFromLink(url.trim());
    }
  }, []);
  
  const processVideoFromLink = useCallback((url) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Lien non reconnu. Utilisez YouTube ou Vimeo');
      return;
    }
    
    const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    
    setWizardData(prev => ({
      ...prev,
      videoSource: 'link',
      videoUrl: url,
      videoPreview: thumbnail,
      videoDuration: 0,
      videoFile: null,
      videoId: videoId
    }));
    
    setError(null);
  }, []);
  
  const extractVideoId = useCallback((url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/[?&]v=([^&]+)/);
      return match ? match[1] : null;
    }
    if (url.includes('vimeo.com')) {
      const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:video\/|)(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  }, []);
  
  const handleFileChange = useCallback(async (e, isCamera = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      setError('Veuillez sélectionner un fichier vidéo valide');
      return;
    }
    
    // Crear preview inmediato
    const previewUrl = URL.createObjectURL(file);
    
    // Verificar duración
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
        videoDuration: duration,
        videoUrl: '',
        videoId: null
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
      videoUrl: '',
      videoId: null,
      videoDuration: 0
    }));
  }, [wizardData.videoPreview]);
  
  const nextStep = useCallback(() => {
    if (currentStep === 1 && !isStep1Valid) {
      setError('Veuillez compléter toutes les informations');
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
      return;
    }
    if (currentStep === 3 && !isStep3Valid) {
      setError('Veuillez compléter le titre et la catégorie');
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
      setError('Veuillez compléter le titre et la catégorie');
      return;
    }
    
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
        videoId = wizardData.videoId;
        thumbnail = wizardData.videoPreview;
        videoDuration = 0;
      } else {
        throw new Error('Source vidéo non valide');
      }
      
      const selectedCategory = getCategoryBySlug(wizardData.categorySlug, wizardData.videoType);
      
      const categorySlug = wizardData.videoType === 'commercial' 
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
        tags: [...wizardData.tags, wizardData.videoType === 'commercial' ? 'commercial' : 'social'],
        duration: videoDuration,
        isCommercial: wizardData.videoType === 'commercial',
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
  }, [wizardData, isStep3Valid, dispatch, auth, socket, onSuccess, history]);
  
  // Render del paso 1 con preview funcionando
  const renderUnifiedStep1 = () => (
    <div className="unified-step-1">
      {/* PRIMERA FILA: Tipo de video */}
      <div className="video-type-row">
        <div 
          className={`video-type-option ${wizardData.videoType === 'social' ? 'active' : ''}`}
          onClick={() => handleSelectVideoType('social')}
        >
          <div className="video-type-icon social-icon">
            <MusicNote size={28} />
          </div>
          <div className="video-type-text">
            <h5>Social</h5>
            <span>Style TikTok/Reels</span>
          </div>
          {wizardData.videoType === 'social' && <div className="active-check">✓</div>}
        </div>
        
        <div 
          className={`video-type-option ${wizardData.videoType === 'commercial' ? 'active' : ''}`}
          onClick={() => handleSelectVideoType('commercial')}
        >
          <div className="video-type-icon commercial-icon">
            <Briefcase size={28} />
          </div>
          <div className="video-type-text">
            <h5>Commercial</h5>
            <span>Marketplace</span>
          </div>
          {wizardData.videoType === 'commercial' && <div className="active-check">✓</div>}
        </div>
      </div>
      
      {/* SEGUNDA FILA: Fuentes de video */}
      <div className="video-source-row">
        <div 
          className={`video-source-option ${wizardData.videoSource === 'gallery' ? 'active' : ''}`}
          onClick={handleGallerySelect}
        >
          <ImageIcon size={24} />
          <span>Galería</span>
        </div>
        
        <div 
          className={`video-source-option ${wizardData.videoSource === 'camera' ? 'active' : ''}`}
          onClick={handleCameraSelect}
        >
          <Camera size={24} />
          <span>Cámara</span>
        </div>
        
        <div 
          className={`video-source-option ${wizardData.videoSource === 'link' ? 'active' : ''}`}
          onClick={handleLinkSelect}
        >
          <Link45deg size={24} />
          <span>Link</span>
        </div>
      </div>
      
      {/* Inputs ocultos */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e, false)}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="video/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e, true)}
      />
      
      {/* VISTA PREVIA DEL VIDEO - AHORA FUNCIONAL */}
      {wizardData.videoPreview && (
        <div className="video-preview-container">
          <div className="video-preview-header">
            <Badge bg={wizardData.videoSource === 'link' ? 'info' : 'success'}>
              {wizardData.videoSource === 'gallery' && '📱 Galerie'}
              {wizardData.videoSource === 'camera' && '📷 Caméra'}
              {wizardData.videoSource === 'link' && '🔗 Lien externe'}
            </Badge>
            {wizardData.videoDuration > 0 && (
              <Badge bg="secondary">
                ⏱️ {Math.floor(wizardData.videoDuration)}s
              </Badge>
            )}
          </div>
          
          {wizardData.videoSource === 'link' ? (
            <div className="youtube-preview">
              <img 
                src={wizardData.videoPreview} 
                alt="Video preview"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Preview+non+disponible';
                }}
              />
              <div className="link-info">
                <small>{wizardData.videoUrl}</small>
              </div>
            </div>
          ) : (
            <video
              src={wizardData.videoPreview}
              controls
              className="video-preview-element"
              autoPlay={false}
              controlsList="nodownload"
            />
          )}
          
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="mt-2"
            onClick={clearVideo}
          >
            <X size={16} className="me-1" />
            Changer de vidéo
          </Button>
        </div>
      )}
    </div>
  );
  
  const categories = wizardData.videoType === 'commercial' ? commercialCategories : socialCategories;
  const stepLabels = ['Contenu', 'Musique', 'Infos'];
  
  return (
    <div className="create-video-wizard">
      <Card className="border-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
        <Card.Body className="p-4">
          <div className="cw-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h3 className="cw-header-title">
                {!wizardData.videoType ? '🎬 Nouvelle vidéo' : 
                  wizardData.videoType === 'commercial' ? '🛍️ Vidéo Commerciale' : '🎵 Vidéo Sociale'}
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
          
          {error && (
            <Alert variant="danger" className="cw-alert mt-3" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          <div className="cw-step-content mt-4">
            
            {/* ✅ CORREGIDO: usa wizardData.videoType y handleSelectVideoType */}
            {currentStep === 1 && (
              <StepVideoUpload 
                wizardData={wizardData}
                updateData={updateWizardData}
                maxDuration={maxDuration}
                isProActive={isProActive}
                videoType={wizardData.videoType}
                onVideoTypeChange={handleSelectVideoType}
              />
            )}
            
            {currentStep === 2 && (
              <StepMusicSelection 
                wizardData={wizardData}
                updateData={updateWizardData}
                videoType={wizardData.videoType}
              />
            )}
            
            {currentStep === 3 && (
              <StepVideoInfo 
                wizardData={wizardData}
                updateData={updateWizardData}
                videoCategories={categories}
                videoType={wizardData.videoType}
              />
            )}
          </div>
          
          <div className="cw-footer mt-4 d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={prevStep}
              disabled={loading || currentStep === 1}
              style={{ borderRadius: '40px', padding: '10px 24px' }}
            >
              <ArrowLeft className="me-2" />
              Retour
            </Button>
            
            {currentStep < 3 ? (
              <Button
                variant="primary"
                onClick={nextStep}
                disabled={loading || (currentStep === 1 && !isStep1Valid)}
                style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
              >
                Suivant
                <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={loading || !isStep3Valid}
                style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none' }}
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
        </Card.Body> 
        
      </Card>
    
    </div>
  );
};

export default CreateVideoWizard;