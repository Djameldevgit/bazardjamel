// components/Video/StepVideoUpload.jsx
import React, { useState, useRef } from 'react';
import { Button, Alert, Form, Card } from 'react-bootstrap';
import { Images, Camera, Link, Trash } from 'react-bootstrap-icons';
import { checkVideo } from '../../utils/imageUpload';

const StepVideoUpload = ({ wizardData, updateData, maxDuration, isProActive }) => {
  const [linkError, setLinkError] = useState(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // ========== MANEJO DE ARCHIVOS (Galería / Cámara) ==========
  const handleVideoFile = (file) => {
    if (!file) return;

    const validationErr = checkVideo(file, isProActive);
    if (validationErr) {
      alert(validationErr);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (duration > maxDuration) {
        alert(`La vidéo ne doit pas dépasser ${maxDuration} secondes`);
        URL.revokeObjectURL(previewUrl);
        return;
      }
      updateData({
        videoFile: file,
        videoPreview: previewUrl,
        videoDuration: duration,
        videoSource: fileInputRef.current?.getAttribute('data-source') || 'gallery',
        videoUrl: '',
        videoId: null,
        videoType: 'local'
      });
      setShowLinkInput(false);
    };
    video.onerror = () => {
      alert('Erreur lors de la lecture de la vidéo');
      URL.revokeObjectURL(previewUrl);
    };
    video.src = previewUrl;
  };
/**
 * Detecta si un archivo de video tiene una pista de audio significativa.
 * @param {File} videoFile - El archivo de video subido por el usuario.
 * @returns {Promise<boolean>} - Promise que resuelve a `true` si detecta audio, `false` en caso contrario.
 */
 const hasSignificantAudioTrack = (videoFile) => {
  return new Promise((resolve) => {
    // 1. Crear un contexto de audio y una fuente desde el archivo
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      try {
        // Decodificar el buffer del archivo a datos de audio sin procesar
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // 2. Obtener los datos de audio del canal izquierdo (por simplicidad)
        const channelData = audioBuffer.getChannelData(0);
        
        // 3. Calcular la amplitud máxima y el RMS (Root Mean Square)
        let maxAmplitude = 0;
        let sumSquares = 0;
        for (let i = 0; i < channelData.length; i++) {
          const amplitude = Math.abs(channelData[i]);
          if (amplitude > maxAmplitude) maxAmplitude = amplitude;
          sumSquares += amplitude * amplitude;
        }
        const rms = Math.sqrt(sumSquares / channelData.length);
        
        // 4. Definir un umbral. Si supera este valor, consideramos que hay audio.
        const AMPLITUDE_THRESHOLD = 0.01; // Ajusta este valor según tus pruebas.
        
        const hasAudio = maxAmplitude > AMPLITUDE_THRESHOLD && rms > AMPLITUDE_THRESHOLD / 2;
        console.log(`Análisis de audio: Amplitud Máx: ${maxAmplitude.toFixed(4)}, RMS: ${rms.toFixed(4)}. ¿Tiene audio? ${hasAudio}`);
        
        resolve(hasAudio);
      } catch (error) {
        console.error("Error al decodificar el audio del video:", error);
        resolve(false); // Si hay error, asumimos que no tiene audio.
      } finally {
        audioContext.close(); // Limpiar el contexto de audio
      }
    };

    fileReader.onerror = () => {
      console.error("Error al leer el archivo de video.");
      resolve(false);
    };

    // Leer el archivo como un ArrayBuffer para poder procesarlo
    fileReader.readAsArrayBuffer(videoFile);
  });
};
  const handleFileSelect = (e, source = 'gallery') => {
    const file = e.target.files[0];
    if (file) {
      fileInputRef.current?.setAttribute('data-source', source);
      handleVideoFile(file);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      cameraInputRef.current?.setAttribute('data-source', 'camera');
      handleVideoFile(file);
    }
  };

  // ========== MANEJO DE LINK ==========
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
      videoType,
      videoId,
      videoSource: 'link',
      videoPreview: isYoutube ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '',
      videoDuration: 0,
      videoFile: null
    });
  };

  // ========== LIMPIAR PREVIEW ==========
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
    setShowLinkInput(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="step-video-upload" style={{ padding: '0 8px' }}>
      <h5 className="mb-4 text-center">Choisissez votre vidéo</h5>

      {/* === FILA DE TRES ICONOS (estilo Android) === */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Icono Galería */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '60px',
              width: '70px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: '0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e0e0e0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f0f0f0'}
          >
            <Images size={36} color="#555" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>Galerie</div>
        </div>

        {/* Icono Cámara */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            style={{
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '60px',
              width: '70px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            <Camera size={36} color="#555" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>Caméra</div>
        </div>

        {/* Icono Link */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setShowLinkInput(!showLinkInput)}
            style={{
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '60px',
              width: '70px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            <Link size={36} color="#555" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>Lien</div>
        </div>
      </div>

      {/* Inputs ocultos para galería y cámara */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'gallery')}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleCameraCapture}
      />

      {/* === INPUT DE LINK (solo si se seleccionó) === */}
      {showLinkInput && (
        <div className="link-input-area" style={{ marginBottom: '24px' }}>
          <Form.Group>
            <Form.Label>Lien YouTube ou Vimeo</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
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

      {/* === PREVIEW DEL VIDEO (justo debajo de los iconos) === */}
      {wizardData.videoPreview && (
        <div className="video-preview mt-3">
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
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StepVideoUpload;