// components/Video/StepMusicSelection.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { MusicNote, Play, Pause, VolumeUp } from 'react-bootstrap-icons';

const StepMusicSelection = ({ wizardData, updateData }) => {
  const [musicLibrary, setMusicLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(null);
  const audioRef = React.useRef(null);
  
  // Biblioteca de música (puedes conectar a una API real)
  useEffect(() => {
    // Música libre de derechos para marketplace argelino
    const library = [
      { id: 1, title: 'Électro Algérien', artist: 'DJ Mesta', duration: '3:45', genre: 'Électro' },
      { id: 2, title: 'Chaabi Moderne', artist: 'Cheb Momo', duration: '4:12', genre: 'Chaabi' },
      { id: 3, title: 'Rap Oranais', artist: 'MC Blida', duration: '3:30', genre: 'Rap' },
      { id: 4, title: 'Ambiance Café', artist: 'Groupe Tizi', duration: '5:00', genre: 'Acoustique' },
      { id: 5, title: 'Sahara Sunset', artist: 'Karim DZ', duration: '4:45', genre: 'Ambient' },
      { id: 6, title: 'Raï Moderne', artist: 'Cheb Bilal', duration: '3:55', genre: 'Raï' }
    ];
    setMusicLibrary(library);
  }, []);
  
  const handlePlayMusic = (music) => {
    if (playingMusic === music.id) {
      audioRef.current?.pause();
      setPlayingMusic(null);
    } else {
      // En producción, aquí cargarías el audio real
      setPlayingMusic(music.id);
      // Simular reproducción
    }
  };
  
  const handleSelectMusic = (music) => {
    updateData({ 
      selectedMusic: music,
      musicVolume: wizardData.musicVolume || 70
    });
  };
  
  return (
    <div className="step-music-selection">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Ajoutez une musique</h5>
        <Form.Check
          type="switch"
          label="Conserver l'audio original"
          checked={wizardData.originalAudio}
          onChange={(e) => updateData({ originalAudio: e.target.checked })}
        />
      </div>
      
      <p className="text-muted mb-4">
        Choisissez une musique pour accompagner votre vidéo
      </p>
      
      {wizardData.selectedMusic && (
        <Card className="mb-4 bg-light">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <MusicNote className="me-2" />
                <strong>{wizardData.selectedMusic.title}</strong>
                <small className="text-muted ms-2">- {wizardData.selectedMusic.artist}</small>
              </div>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => updateData({ selectedMusic: null })}
              >
                Retirer
              </Button>
            </div>
            
            {wizardData.selectedMusic && (
              <Form.Group className="mt-3">
                <Form.Label>
                  <VolumeUp className="me-1" size={14} />
                  Volume musique: {wizardData.musicVolume}%
                </Form.Label>
                <Form.Range
                  value={wizardData.musicVolume}
                  onChange={(e) => updateData({ musicVolume: parseInt(e.target.value) })}
                  min={0}
                  max={100}
                />
              </Form.Group>
            )}
          </Card.Body>
        </Card>
      )}
      
      <div className="music-library">
        <h6 className="mb-3">Bibliothèque musicale</h6>
        <div className="music-list">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            musicLibrary.map(music => (
              <div
                key={music.id}
                className={`music-item ${wizardData.selectedMusic?.id === music.id ? 'selected' : ''}`}
                onClick={() => handleSelectMusic(music)}
              >
                <div className="music-info">
                  <MusicNote size={24} />
                  <div className="ms-3">
                    <div className="fw-bold">{music.title}</div>
                    <small className="text-muted">{music.artist} • {music.duration}</small>
                  </div>
                </div>
                <div className="music-actions">
                  <Badge bg="secondary" className="me-2">{music.genre}</Badge>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayMusic(music);
                    }}
                  >
                    {playingMusic === music.id ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default StepMusicSelection;