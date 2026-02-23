// components/boutique/tabs/ImagesTab.jsx
import React, { useState } from 'react';
import { Row, Col, Card, Button, Image, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaTrash, FaStar, FaEdit, FaExpand } from 'react-icons/fa';

const ImagesTab = ({ boutique, activeImage, setActiveImage }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const images = boutique.images || [];
  const headerImage = boutique.header_image; // Si existe
  const logoImage = images.length > 0 ? images[0] : null; // Primera imagen = logo
  const galleryImages = images.slice(1); // Resto de imágenes = galería

  const handleImageClick = (index) => {
    setSelectedImage(images[index]);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSetAsMain = (index) => {
    setActiveImage(index);
    // Aquí iría la lógica para guardar en el backend
  };

  const handleDeleteImage = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      // Aquí iría la lógica para eliminar la imagen
      console.log('Eliminar imagen:', index);
    }
  };

  return (
    <div className="images-tab">
      <h4 className="mb-4">Gestion des images</h4>

      {/* Sección de imágenes principales */}
      <Row className="mb-5">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3">
                <FaStar className="me-2 text-warning" />
                Logo de la boutique
              </h5>
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="logo-preview me-3"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#f8f9fa',
                    overflow: 'hidden',
                    border: `3px solid ${boutique.couleur_theme}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {logoImage ? (
                    <Image 
                      src={logoImage.url || logoImage}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <FaStore size={40} color={boutique.couleur_theme} />
                  )}
                </div>
                <div>
                  <p className="mb-1"><strong>Logo actuel</strong></p>
                  <small className="text-muted">Première image du tableau</small>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm">
                  <FaPlus className="me-2" /> Changer le logo
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3">
                <FaStar className="me-2 text-warning" />
                Image d'en-tête
              </h5>
              <div 
                className="header-image-preview mb-3"
                style={{
                  height: '100px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {headerImage ? (
                  <Image 
                    src={headerImage}
                    fluid
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    Aucune image d'en-tête
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm">
                  <FaPlus className="me-2" /> Ajouter
                </Button>
                {headerImage && (
                  <Button variant="outline-danger" size="sm">
                    <FaTrash className="me-2" /> Supprimer
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Galería de imágenes */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Galerie d'images</h5>
            <Button variant="primary" size="sm">
              <FaPlus className="me-2" /> Ajouter des images
            </Button>
          </div>

          {galleryImages.length > 0 ? (
            <Row className="g-3">
              {galleryImages.map((img, index) => (
                <Col xs={6} md={4} lg={3} key={index}>
                  <div 
                    className="image-item position-relative"
                    style={{
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: activeImage === index + 1 ? `3px solid ${boutique.couleur_theme}` : '3px solid transparent'
                    }}
                  >
                    <Image 
                      src={img.url || img}
                      fluid
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      onClick={() => handleImageClick(index + 1)}
                    />
                    
                    {/* Overlay con acciones */}
                    <div 
                      className="image-actions position-absolute bottom-0 start-0 end-0 p-2"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        opacity: 0,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                    >
                      <div className="d-flex justify-content-center gap-2">
                        <Button 
                          size="sm" 
                          variant="light"
                          onClick={() => handleSetAsMain(index + 1)}
                          title="Définir comme image principale"
                        >
                          <FaStar color={activeImage === index + 1 ? '#ffc107' : '#6c757d'} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="light"
                          onClick={() => handleImageClick(index + 1)}
                          title="Agrandir"
                        >
                          <FaExpand />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="light"
                          onClick={() => handleDeleteImage(index + 1)}
                          title="Supprimer"
                        >
                          <FaTrash color="#dc3545" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <FaPlus size={48} className="text-muted" />
              </div>
              <h6 className="text-muted">Aucune image dans la galerie</h6>
              <p className="text-muted small">Cliquez sur "Ajouter des images" pour commencer</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal para ver imagen ampliada */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Aperçu de l'image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage && (
            <Image 
              src={selectedImage.url || selectedImage}
              fluid
              style={{ maxHeight: '70vh' }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ImagesTab;