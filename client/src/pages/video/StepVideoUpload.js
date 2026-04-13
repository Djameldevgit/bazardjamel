// components/Video/StepVideoUpload.jsx
import React, { useState, useRef, useCallback } from 'react';
import { Card, Button, Alert, Form, ProgressBar } from 'react-bootstrap';
import { Image, Camera, Link, Upload, Trash } from 'react-bootstrap-icons';
import { checkVideo, videoUpload } from '../../utils/imageUpload';

const StepVideoUpload = ({ wizardData, updateData, maxDuration, isProActive }) => {
  const [dragActive, setDragActive] = useState(false);
  const [linkError, setLinkError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleVideoFile(file);
    }
  }, []);
  
  const handleVideoFile = async (file) => {
    if (!file) return;
    
    // Validar video
    const validationErr = checkVideo(file, isProActive);
    if (validationErr) {
      alert(validationErr);
      return;
    }
    
    // Crear preview local temporal
    const previewUrl = URL.createObjectURL(file);
    
    // Validar duración
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (duration > maxDuration) {
        alert(`La vidéo ne doit pas dépasser ${maxDuration} secondes`);
        URL.revokeObjectURL(previewUrl);
        return;
      }
      
      // Guardar el archivo para subir después
      updateData({
        videoFile: file,
        videoPreview: previewUrl,
        videoDuration: duration,
        videoSource: 'gallery'
      });
    };
    video.onerror = () => {
      alert('Erreur lors de la lecture de la vidéo');
      URL.revokeObjectURL(previewUrl);
    };
    video.src = previewUrl;
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleVideoFile(file);
  };
  
  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) handleVideoFile(file);
  };
  
  const handleLinkSubmit = () => {
    const url = wizardData.videoUrl;
    if (!url) {
      setLinkError('Veuillez entrer un lien');
      return;
    }
    
    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    const isVimeo = url.includes('vimeo.com');
    
    if (!isYoutube && !isVimeo) {
      setLinkError('Seuls les liens YouTube et Vimeo sont acceptés');
      return;
    }
    
    let videoId = null;
    let videoType = null;
    
    if (isYoutube) {
      const match = url.match(/[?&]v=([^&]+)/);
      videoId = match ? match[1] : null;
      videoType = 'youtube';
    } else if (isVimeo) {
      const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
      videoId = match ? match[1] : null;
      videoType = 'vimeo';
    }
    
    if (!videoId) {
      setLinkError('Lien invalide');
      return;
    }
    
    setLinkError(null);
    updateData({
      videoUrl: url,
      videoType: videoType,
      videoId: videoId,
      videoSource: 'link',
      videoPreview: isYoutube ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null,
      videoDuration: 0
    });
  };
  
  const clearVideo = () => {
    if (wizardData.videoPreview && wizardData.videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(wizardData.videoPreview);
    }
    updateData({
      videoFile: null,
      videoPreview: null,
      videoUrl: '',
      videoId: null,
      videoSource: null,
      videoDuration: 0
    });
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };
  
  return (
    <div className="step-video-upload">
      <h5 className="mb-4">Choisissez votre vidéo</h5>
      
      {/* Opciones de origen */}
      <div className="video-source-options mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <button
              className={`source-option ${wizardData.videoSource === 'gallery' ? 'active' : ''}`}
              onClick={() => document.getElementById('gallery-input').click()}
            >
              <Image size={32} />
              <span>Galerie</span>
            </button>
          </div>
          <div className="col-md-4">
            <button
              className={`source-option ${wizardData.videoSource === 'camera' ? 'active' : ''}`}
              onClick={() => document.getElementById('camera-input').click()}
            >
              <Camera size={32} />
              <span>Caméra</span>
            </button>
          </div>
          <div className="col-md-4">
            <button
              className={`source-option ${wizardData.videoSource === 'link' ? 'active' : ''}`}
              onClick={() => document.getElementById('link-input').focus()}
            >
              <Link size={32} />
              <span>Lien</span>
            </button>
          </div>
        </div>
      </div>
      
      <input
        type="file"
        id="gallery-input"
        accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        ref={fileInputRef}
      />
      
      <input
        type="file"
        id="camera-input"
        accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleCameraCapture}
        ref={cameraInputRef}
      />
      
      {/* Área de drop */}
      {(!wizardData.videoSource || wizardData.videoSource === 'gallery') && (
        <div
          className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} className="mb-3" />
          <p>Glissez votre vidéo ici ou cliquez pour parcourir</p>
          <small className="text-muted">MP4, MOV, AVI, WEBM jusqu'à 100MB</small>
        </div>
      )}
      
      {/* Input para link */}
      {wizardData.videoSource === 'link' && (
        <div className="link-input-area">
          <Form.Group>
            <Form.Label>Lien YouTube ou Vimeo</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                id="link-input"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={wizardData.videoUrl}
                onChange={(e) => updateData({ videoUrl: e.target.value })}
              />
              <Button onClick={handleLinkSubmit} variant="primary">
                Valider
              </Button>
            </div>
            {linkError && <Alert variant="danger" className="mt-2">{linkError}</Alert>}
          </Form.Group>
        </div>
      )}
      
      {/* Preview del video */}
      {wizardData.videoPreview && (
        <div className="video-preview mt-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Aperçu</span>
              <Button variant="link" size="sm" onClick={clearVideo} className="text-danger">
                <Trash size={16} /> Supprimer
              </Button>
            </Card.Header>
            <Card.Body>
              {wizardData.videoSource === 'link' ? (
                <img src={wizardData.videoPreview} alt="Preview" className="img-fluid rounded" />
              ) : (
                <video
                  src={wizardData.videoPreview}
                  controls
                  className="w-100 rounded"
                  style={{ maxHeight: '300px' }}
                />
              )}
              {wizardData.videoDuration > 0 && (
                <div className="mt-2 text-muted small">
                  Durée: {Math.floor(wizardData.videoDuration / 60)}:
                  {Math.floor(wizardData.videoDuration % 60).toString().padStart(2, '0')}
                  {wizardData.videoDuration > maxDuration && (
                    <span className="text-danger ms-2">
                      ⚠️ Dépasse la limite de {maxDuration}s
                    </span>
                  )}
                </div>
              )}
              {isUploading && (
                <ProgressBar 
                  now={uploadProgress} 
                  label={`${uploadProgress}%`} 
                  striped 
                  animated 
                  className="mt-3"
                />
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StepVideoUpload;