// components/Video/StepMusicSelection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Card, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { MusicNote, Play, Pause, VolumeUp, Trash } from 'react-bootstrap-icons';

const StepMusicSelection = ({ wizardData, updateData }) => {
  const [musicLibrary, setMusicLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const audioContextRef = useRef(null);

  // Cargar música desde el backend
  useEffect(() => {
    const fetchMusic = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/music?q=background&limit=20');
        if (!response.ok) throw new Error('Error al cargar música');
        const data = await response.json();
        setMusicLibrary(data.hits || []);
      } catch (error) {
        console.error("Error fetching music:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, []);

  // Detener cualquier sonido al desmontar el componente
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.stop();
        currentSound.unload();
      }
    };
  }, [currentSound]);

  
  const handlePreview = (track, e) => {
    e.stopPropagation();

    // Si ya está sonando esta pista, la detenemos
    if (playingTrackId === track.id && currentSound) {
      currentSound.stop();
      setPlayingTrackId(null);
      setCurrentSound(null);
      return;
    }

    // Detener cualquier sonido en curso
    if (currentSound) {
      currentSound.stop();
      currentSound.unload();
    }

    // Crear nueva instancia de Howl con el audio
    const sound = new Howl({
      src: [track.audio],
      html5: true,                    // Usar HTML5 Audio (mejor compatibilidad)
      format: ['mp4', 'webm', 'mp3'], // Formatos que puede aceptar
      volume: wizardData.musicVolume / 100 || 0.7,
      onend: () => {
        // Al terminar, limpiamos el estado
        setPlayingTrackId(null);
        setCurrentSound(null);
      },
      onloaderror: (id, error) => {
        console.error('Error cargando audio:', error);
        setPlayingTrackId(null);
        setCurrentSound(null);
      },
      onplayerror: (id, error) => {
        console.error('Error reproduciendo:', error);
        // Reintentar con HTML5 si falla el Web Audio
        if (sound && sound._sounds && sound._sounds[0]._node) {
          sound._sounds[0]._node.play();
        }
      }
    });

    sound.play();
    setCurrentSound(sound);
    setPlayingTrackId(track.id);
  };

  // Seleccionar una canción para la mezcla
  const handleSelectTrack = (track) => {
    // Si estamos reproduciendo una vista previa, la detenemos
    if (currentSound) {
      currentSound.stop();
      setPlayingTrackId(null);
      setCurrentSound(null);
    }

    updateData({
      selectedMusic: {
        id: track.id,
        title: track.tags?.split(',')[0] || track.title || 'Sin título',
        artist: track.user || 'Artista desconocido',
        duration: track.duration || '0:00',
        url: track.audio,
      },
      musicVolume: wizardData.musicVolume || 70,
    });
  };

  // Cambiar volumen de la música seleccionada (actualiza el sonido actual si existe)
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    updateData({ musicVolume: newVolume });
    if (currentSound) {
      currentSound.volume(newVolume / 100);
    }
  };

  // Eliminar música seleccionada
  const handleRemoveMusic = () => {
    updateData({ selectedMusic: null });
    if (currentSound) {
      currentSound.stop();
      setPlayingTrackId(null);
      setCurrentSound(null);
    }
  };

  // Formatear duración (segundos a mm:ss)
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Verificar si el video original tiene audio
  const hasOriginalAudio = wizardData.hasOriginalAudio !== undefined ? wizardData.hasOriginalAudio : true;

  return (
    <div className="step-music-selection p-3">
      <h5 className="mb-4">🎵 Ajouter une musique</h5>

      {/* Opciones de audio */}
      <div className="mb-4">
        {hasOriginalAudio && (
          <Form.Check
            type="radio"
            label="Conserver l'audio original de la vidéo"
            name="audioOption"
            id="audio-original"
            checked={!wizardData.selectedMusic}
            onChange={() => {
              if (currentSound) {
                currentSound.stop();
                setPlayingTrackId(null);
                setCurrentSound(null);
              }
              updateData({ selectedMusic: null });
            }}
            className="mb-2"
          />
        )}
        <Form.Check
          type="radio"
          label="Ajouter une musique de la bibliothèque"
          name="audioOption"
          id="audio-music"
          checked={!!wizardData.selectedMusic}
          onChange={() => {}}
          className="mb-2"
        />
      </div>

      {/* Mostrar música seleccionada */}
      {wizardData.selectedMusic && (
        <Card className="mb-4 bg-light">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <MusicNote className="me-2" />
                <strong>{wizardData.selectedMusic.title}</strong>
                <small className="text-muted ms-2">- {wizardData.selectedMusic.artist}</small>
              </div>
              <Button variant="outline-danger" size="sm" onClick={handleRemoveMusic}>
                <Trash size={16} /> Retirer
              </Button>
            </div>

            {/* Control de volumen */}
            <Form.Group className="mt-3">
              <Form.Label>
                <VolumeUp className="me-1" size={14} />
                Volume musique: {wizardData.musicVolume}%
              </Form.Label>
              <Form.Range
                value={wizardData.musicVolume}
                onChange={handleVolumeChange}
                min={0}
                max={100}
              />
            </Form.Group>
          </Card.Body>
        </Card>
      )}

      {/* Biblioteca de música */}
      {(!wizardData.selectedMusic || wizardData.selectedMusic) && (
        <div className="music-library">
          <h6 className="mb-3">Choisissez une piste</h6>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" />
              <p className="mt-2 text-muted">Chargement de la bibliothèque...</p>
            </div>
          ) : musicLibrary.length === 0 ? (
            <p className="text-muted">Aucune musique trouvée. Réessayez plus tard.</p>
          ) : (
            <div className="music-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {musicLibrary.map((track) => (
                <div
                  key={track.id}
                  className={`music-item d-flex justify-content-between align-items-center p-3 mb-2 border rounded ${
                    wizardData.selectedMusic?.id === track.id ? 'bg-primary bg-opacity-10 border-primary' : ''
                  }`}
                  onClick={() => handleSelectTrack(track)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <MusicNote size={24} className="me-3 text-secondary" />
                    <div>
                      <div className="fw-bold">{track.tags?.split(',')[0] || 'Sans titre'}</div>
                      <small className="text-muted">
                        {track.user || 'Artiste'} • {formatDuration(track.duration)}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Badge bg="secondary" className="me-2">
                      {track.genre || 'Pop'}
                    </Badge>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-secondary"
                      onClick={(e) => handlePreview(track, e)}
                    >
                      {playingTrackId === track.id ? <Pause size={20} /> : <Play size={20} />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepMusicSelection;