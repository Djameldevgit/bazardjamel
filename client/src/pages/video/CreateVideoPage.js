// components/Video/CreateVideoPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Alert, Spinner, Card, Tabs, Tab, ProgressBar, Badge } from 'react-bootstrap';
import { createVideo } from '../../redux/actions/videoAction';
import { checkVideo, videoUpload } from '../../utils/imageUpload';

const CreateVideoPage = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { user } = auth;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('url');
  
  // Verificar si es usuario Pro
  const isProActive = user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  
  // Límites según tipo de usuario
  const maxDuration = isProActive ? 100 : 100;
  const maxSize = isProActive ? 100 : 100;
  
  // Estado para URL
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoType: 'youtube',
    categorySlug: '',
    tags: ''
  });
  
  // Estado para archivo local
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Categorías de videos
  const videoCategories = [
    { name: 'Véhicules', slug: 'videos-vehicules' },
    { name: 'Immobilier', slug: 'videos-immobilier' },
    { name: 'Téléphones', slug: 'videos-telephones' },
    { name: 'Informatique', slug: 'videos-informatique' },
    { name: 'Électroménager', slug: 'videos-electromenager' },
    { name: 'Mode & Vêtements', slug: 'videos-mode-vetements' },
    { name: 'Maison & Jardin', slug: 'videos-maison-jardin' },
    { name: 'Sport & Loisirs', slug: 'videos-sport-loisirs' },
    { name: 'Alimentaires', slug: 'videos-alimentaires' },
    { name: 'Meubles', slug: 'videos-meubles' },
    { name: 'Pièces Détachées', slug: 'videos-pieces-detachees' },
    { name: 'Santé & Beauté', slug: 'videos-sante-beaute' },
    { name: 'Services', slug: 'videos-services' },
    { name: 'Emploi', slug: 'videos-emploi' },
    { name: 'Voyages', slug: 'videos-voyages' },
    { name: 'Boutiques', slug: 'videos-boutiques' },
    { name: 'Tutoriels', slug: 'videos-tutoriels' },
    { name: 'Reviews', slug: 'videos-reviews' }
  ];

  // Extraer ID de YouTube
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Extraer ID de Vimeo
  const getVimeoId = (url) => {
    const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Validar duración del video local
  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        if (duration > maxDuration) {
          reject(`La vidéo ne doit pas dépasser ${maxDuration} secondes (actuelle: ${Math.round(duration)}s)`);
        } else {
          resolve(duration);
        }
      };
      video.onerror = () => {
        reject('Erreur lors de la lecture de la vidéo');
      };
      video.src = URL.createObjectURL(file);
    });
  };

  // Manejar selección de archivo local
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setValidationError(null);
    
    // Validar usando checkVideo
    const validationErr = checkVideo(file, isProActive);
    if (validationErr) {
      setValidationError(validationErr);
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }
    
    setError(null);
    setVideoFile(file);
    
    // Crear preview
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    
    // Validar duración
    try {
      const duration = await validateVideoDuration(file);
      setVideoDuration(duration);
    } catch (err) {
      setValidationError(err);
      setVideoFile(null);
      setVideoPreview(null);
    }
  };

  // Manejar cambios en formulario URL
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Subir video local a Cloudinary
  const handleSubmitLocal = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      setError('Veuillez sélectionner une vidéo');
      return;
    }
    
    if (!formData.categorySlug) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }
    
    if (!formData.title.trim()) {
      setError('Veuillez saisir un titre');
      return;
    }
    
    setError(null);
    setLoading(true);
    setUploadProgress(0);
    
    try {
      // 1. Subir video a Cloudinary
      const videoResult = await videoUpload(videoFile, (progress) => {
        setUploadProgress(progress);
      });
      
      console.log('Video subido:', videoResult);
      
      const selectedCategory = videoCategories.find(c => c.slug === formData.categorySlug);
      
      // 2. Crear registro en base de datos
      const videoData = {
        title: formData.title,
        description: formData.description,
        videoUrl: videoResult.url,
        videoType: 'local',
        videoId: videoResult.public_id,
        thumbnail: videoResult.thumbnail || videoResult.url,
        category: selectedCategory?.name,
        categorySlug: formData.categorySlug,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        duration: videoDuration
      };
      
      console.log('Enviando a API:', videoData);
      
      const result = await dispatch(createVideo(videoData, auth.token));
      
      if (result?.success) {
        resetForm();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Error en submit:', err);
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Subir video por URL (YouTube/Vimeo)
  const handleSubmitUrl = async (e) => {
    e.preventDefault();
    
    let videoId = null;
    if (formData.videoType === 'youtube') {
      videoId = getYoutubeId(formData.videoUrl);
    } else if (formData.videoType === 'vimeo') {
      videoId = getVimeoId(formData.videoUrl);
    }
    
    if (!videoId) {
      setError('URL de vidéo invalide');
      return;
    }
    
    if (!formData.categorySlug) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }
    
    if (!formData.title.trim()) {
      setError('Veuillez saisir un titre');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    const selectedCategory = videoCategories.find(c => c.slug === formData.categorySlug);
    
    const videoData = {
      title: formData.title,
      description: formData.description,
      videoUrl: formData.videoUrl,
      videoType: formData.videoType,
      videoId: videoId,
      thumbnail: formData.videoType === 'youtube' ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '',
      category: selectedCategory?.name,
      categorySlug: formData.categorySlug,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      duration: 0
    };
    
    const result = await dispatch(createVideo(videoData, auth.token));
    if (result?.success) {
      resetForm();
      if (onSuccess) onSuccess();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', videoUrl: '', videoType: 'youtube',
      categorySlug: '', tags: ''
    });
    setVideoFile(null);
    setVideoPreview(null);
    setVideoDuration(0);
    setValidationError(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Obtener miniatura de YouTube para preview
  const getYoutubeThumbnail = () => {
    if (formData.videoType === 'youtube' && formData.videoUrl) {
      const videoId = getYoutubeId(formData.videoUrl);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">🎬 Créer une vidéo</h4>
          {!isProActive && (
            <Badge bg="warning" text="dark">
              ⚡ Vidéo limitée à 10 secondes
            </Badge>
          )}
          {isProActive && (
            <Badge bg="primary">
              ⭐ Pro: jusqu'à 20 secondes
            </Badge>
          )}
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {validationError && <Alert variant="warning">{validationError}</Alert>}
        
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="url" title="🔗 Lien YouTube/Vimeo" />
          <Tab eventKey="local" title="📁 Uploader une vidéo" />
        </Tabs>
        
        {/* TAB URL */}
        <Form onSubmit={handleSubmitUrl} style={{ display: activeTab === 'url' ? 'block' : 'none' }}>
          <Form.Group className="mb-3">
            <Form.Label>Titre *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type de vidéo</Form.Label>
            <Form.Select
              name="videoType"
              value={formData.videoType}
              onChange={handleChange}
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL de la vidéo *</Form.Label>
            <Form.Control
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <Form.Text className="text-muted">
              Collez l'URL de votre vidéo YouTube ou Vimeo
            </Form.Text>
          </Form.Group>

          {/* Preview miniatura YouTube */}
          {getYoutubeThumbnail() && (
            <div className="mb-3">
              <Form.Label>Prévisualisation</Form.Label>
              <div className="border rounded p-2" style={{ width: '200px' }}>
                <img 
                  src={getYoutubeThumbnail()} 
                  alt="Preview" 
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Catégorie *</Form.Label>
            <Form.Select
              name="categorySlug"
              value={formData.categorySlug}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {videoCategories.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (séparés par des virgules)</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="voiture, occasion, algerie"
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : '🎬 Publier la vidéo'}
          </Button>
        </Form>
        
        {/* TAB LOCAL */}
        <Form onSubmit={handleSubmitLocal} style={{ display: activeTab === 'local' ? 'block' : 'none' }}>
          <Form.Group className="mb-3">
            <Form.Label>Titre *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fichier vidéo *</Form.Label>
            <Form.Control
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
              onChange={handleFileSelect}
              ref={fileInputRef}
              required
            />
            <Form.Text className="text-muted">
              {`Format: MP4, MOV, AVI, WEBM. Taille max: ${maxSize}MB. Durée max: ${maxDuration} secondes`}
            </Form.Text>
          </Form.Group>

          {/* Preview del video */}
          {videoPreview && (
            <div className="mb-3">
              <Form.Label>Prévisualisation</Form.Label>
              <video
                ref={videoRef}
                src={videoPreview}
                controls
                style={{ width: '100%', maxHeight: '300px', borderRadius: '8px' }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setVideoDuration(videoRef.current.duration);
                  }
                }}
              />
              {videoDuration > 0 && (
                <div className="mt-2 text-muted small">
                  Durée: {Math.round(videoDuration)} secondes
                  {videoDuration > maxDuration && (
                    <span className="text-danger ms-2">
                      ⚠️ Dépasse la limite de {maxDuration} secondes
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-3">
              <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} striped animated />
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Catégorie *</Form.Label>
            <Form.Select
              name="categorySlug"
              value={formData.categorySlug}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {videoCategories.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (séparés par des virgules)</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="voiture, occasion, algerie"
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !videoFile || (videoDuration > maxDuration && videoDuration > 0)}
          >
            {loading ? <Spinner size="sm" /> : '🎬 Uploader la vidéo'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateVideoPage;