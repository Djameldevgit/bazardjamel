import React from 'react';
import { Container } from 'react-bootstrap';

const VideoHeader = ({ boutique }) => {
  const videoItem = boutique?.header?.media?.find(m => m.type === 'video') || {
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Vidéo de présentation'
  };
  
  return (
    <div className="boutique-header-video position-relative">
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={videoItem.url}
          title={videoItem.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      {/* Info overlay */}
      <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white" 
           style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', zIndex: 10 }}>
        <Container>
          <h2>{boutique.nom_boutique}</h2>
          {boutique.slogan_boutique && <p>{boutique.slogan_boutique}</p>}
        </Container>
      </div>
    </div>
  );
};

export default VideoHeader;