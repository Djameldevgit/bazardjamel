// components/boutique/BoutiqueHeader.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Container, Row, Col, Badge, Button, Dropdown, Image, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaStore, FaEye, FaBoxOpen, FaStar, FaRegStar, 
  FaPlus, FaImages, FaTags, FaFileAlt,
  FaCheckCircle, FaShare, FaHeart, FaRegHeart,
  FaFacebook, FaTwitter, FaWhatsapp, FaLink,
  FaChevronLeft, FaChevronRight, FaCamera, FaTrash,
  FaUpload, FaTimes, FaPhotoVideo, FaEllipsisV,
  FaEdit, FaChartLine
} from 'react-icons/fa';
import { incrementBoutiqueView, updateBoutiqueHeaderImages, deleteBoutiqueHeaderImage } from '../../redux/actions/boutiqueAction';
import '../../styles/BoutiqueHeader.css';

const RatingStars = React.memo(({ rating = 0 }) => {
  const stars = useMemo(() => {
    const result = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        result.push(<FaStar key={i} className="text-warning" size={12} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        result.push(
          <div key={i} className="position-relative d-inline-block">
            <FaRegStar className="text-secondary" size={12} />
            <FaStar className="text-warning position-absolute top-0 start-0" style={{ clipPath: 'inset(0 50% 0 0)' }} size={12} />
          </div>
        );
      } else {
        result.push(<FaRegStar key={i} className="text-secondary" size={12} />);
      }
    }
    return result;
  }, [rating]);

  return <div className="boutique-rating-stars">{stars}</div>;
});

RatingStars.displayName = 'RatingStars';

const BoutiqueHeader = ({ boutique }) => {
  const dispatch = useDispatch();
  
  // Estados de autenticación
  const authState = useSelector(state => state.auth);
  const { token, user } = authState || {};
  const isAuthenticated = !!token;
  const isOwner = user?._id === boutique?.user?._id || user?._id === boutique?.user;
  
  // Estados del componente
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1247);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [headerImages, setHeaderImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [themeColor, setThemeColor] = useState('#2563eb');

  // Definición de clases CSS como strings
  const headerContainer = "boutique-header-container";
  const heroSection = "boutique-hero-section";
  const overlay = "boutique-overlay";
  const carouselControl = "boutique-carousel-control";
  const carouselControlLeft = "boutique-carousel-control-left";
  const carouselControlRight = "boutique-carousel-control-right";
  const carouselIndicators = "boutique-carousel-indicators";
  const indicatorDot = "boutique-indicator-dot";
  const indicatorDotActive = "boutique-indicator-dot-active";
  const logoCorner = "boutique-logo-corner";
  const actionBarMetrics = "boutique-action-bar-metrics";
  const actionButton = "boutique-action-button";
  const actionButtonIcon = "boutique-action-button-icon";
  const actionButtonLabel = "boutique-action-button-label";
  const actionButtonCount = "boutique-action-button-count";
  const dropdownMenuCustom = "boutique-dropdown-menu";
  const dropdownItem = "boutique-dropdown-item";
  const dropdownHeader = "boutique-dropdown-header";
  const headerContent = "boutique-header-content";
  const boutiqueInfo = "boutique-info";
  const boutiqueTitle = "boutique-title";
  const verifiedBadge = "boutique-verified-badge";
  const slogan = "boutique-slogan";
  const description = "boutique-description";
  const quickStats = "boutique-quick-stats";
  const categoryBadge = "boutique-category-badge";
  const ratingContainer = "boutique-rating-container";
  const ratingCount = "boutique-rating-count";
  const actionBar = "boutique-action-bar";
  const actionBarContent = "boutique-action-bar-content";
  const actionButtonBar = "boutique-action-button-bar";
  const imageThumbnail = "boutique-image-thumbnail";
  const modalCustom = "boutique-modal";
  const modalHeader = "boutique-modal-header";
  const modalBody = "boutique-modal-body";
  const modalFooter = "boutique-modal-footer";
  const imageGrid = "boutique-image-grid";
  const imageCard = "boutique-image-card";
  const deleteImageBtn = "boutique-delete-image-btn";
  const activeBadge = "boutique-active-badge";
  const shareIconOnly = "boutique-share-icon-only";
  const publishButtonFull = "boutique-publish-button-full";

  // Obtener datos actualizados de Redux
  const reduxBoutique = useSelector(state =>
    state.boutique.boutiques?.find(b => b._id === boutique._id)
  );
  const currentBoutique = reduxBoutique || boutique;

  // Destructurar datos de la boutique
  const {
    _id,
    nom_boutique,
    slogan_boutique,
    description_boutique,
    header_images = [],
    images = [],
    categorie,
    isVerified,
    stats = { vues: 0, produits: 0, notes: 0, avis: 0 },
    couleur_theme = '#2563eb',
    createdAt
  } = currentBoutique;

  const logoImage = images.length > 0 ? images[0] : null;

  // Manejar follow
  const handleFollow = () => {
    if (!isFollowing) {
      setFollowersCount(prev => prev + 1);
    } else {
      setFollowersCount(prev => prev - 1);
    }
    setIsFollowing(!isFollowing);
  };

  // Actualizar headerImages
  useEffect(() => {
    if (header_images && header_images.length > 0) {
      setHeaderImages(header_images);
    }
  }, [header_images]);

  // Actualizar color de tema
  useEffect(() => {
    setThemeColor(couleur_theme);
    document.documentElement.style.setProperty('--theme-color', couleur_theme);
  }, [couleur_theme]);

  // Auto-play del carousel
  useEffect(() => {
    if (headerImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % headerImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [headerImages.length]);

  // Incrementar vistas al montar
  useEffect(() => {
    if (_id) {
      dispatch(incrementBoutiqueView(_id));
    }
  }, [_id, dispatch]);

  // Navegación del carousel
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % headerImages.length);
  }, [headerImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + headerImages.length) % headerImages.length);
  }, [headerImages.length]);

  // Manejar selección de archivos
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidType) alert('Format non supporté');
      if (!isValidSize) alert('Image trop volumineuse (max 5MB)');
      return isValidType && isValidSize;
    });

    setSelectedFiles(validFiles);
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  }, []);

  // Subir imágenes
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    if (!token) {
      alert('❌ Vous devez être connecté pour modifier les images');
      return;
    }

    setUploading(true);
    try {
      const imagesToUpload = selectedFiles.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        isExisting: false,
        file: file
      }));
      
      const result = await dispatch(updateBoutiqueHeaderImages({
        boutiqueId: _id,
        images: imagesToUpload,
        auth: authState
      }));

      if (result?.success) {
        setHeaderImages(result.header_images);
        setShowImageModal(false);
        setSelectedFiles([]);
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        alert('✅ Images téléchargées avec succès!');
      } else {
        throw new Error(result?.error || 'Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('❌ Erreur: ' + error.message);
    } finally {
      setUploading(false);
    }
  }, [selectedFiles, token, _id, authState, dispatch, previewUrls]);

  // Eliminar imagen
  const handleDeleteImage = useCallback(async () => {
    if (imageToDelete === null) return;
    
    if (!token) {
      alert('❌ Vous devez être connecté pour supprimer des images');
      return;
    }
  
    try {
      const imageId = headerImages[imageToDelete]._id || headerImages[imageToDelete].public_id;
      
      const result = await dispatch(deleteBoutiqueHeaderImage({
        boutiqueId: _id,
        imageId: imageId,
        auth: authState
      }));
  
      if (result && result.success) {
        const newImages = headerImages.filter((_, index) => index !== imageToDelete);
        setHeaderImages(newImages);
        if (currentSlide >= newImages.length) {
          setCurrentSlide(Math.max(0, newImages.length - 1));
        }
        setShowDeleteConfirm(false);
        setImageToDelete(null);
        alert('✅ Image supprimée avec succès');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Erreur lors de la suppression de l\'image');
    }
  }, [imageToDelete, token, _id, headerImages, currentSlide, authState, dispatch]);

  const confirmDelete = useCallback((index) => {
    setImageToDelete(index);
    setShowDeleteConfirm(true);
  }, []);

  const handleCancel = useCallback(() => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setShowImageModal(false);
  }, [previewUrls]);

  // Renderizar fondo del header
  const headerBackgroundStyle = useMemo(() => {
    if (headerImages.length === 0) {
      return {
        background: `linear-gradient(135deg, ${themeColor} 0%, ${adjustColor(themeColor, 30)} 100%)`
      };
    }
    return {
      backgroundImage: `url(${headerImages[currentSlide]?.url || headerImages[currentSlide]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-image 0.5s ease-in-out'
    };
  }, [headerImages, currentSlide, themeColor]);

  // Compartir en redes sociales
  const shareUrl = useMemo(() => window.location.href, []);
  const shareTitle = `Découvrez ${nom_boutique} sur notre marketplace`;

  const handleShare = useCallback((platform) => {
    let url = '';
    switch(platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
        return;
      default:
        return;
    }
    window.open(url, '_blank', 'width=600,height=400');
  }, [shareUrl, shareTitle]);

  // Helper para ajustar color
  function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
  }

  // Formatear números (ej: 1.2k, 1.5M)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className={headerContainer}>
      {/* Sección hero con fondo - altura reducida en móvil */}
      <div 
        className={heroSection} 
        style={{ 
          ...headerBackgroundStyle, 
          minHeight: '200px'
        }}
      >
        <div className={overlay} />
        
        {/* Controles del carousel */}
        {headerImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className={`${carouselControl} ${carouselControlLeft}`}
              aria-label="Image précédente"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className={`${carouselControl} ${carouselControlRight}`}
              aria-label="Image suivante"
            >
              <FaChevronRight size={16} />
            </button>

            <div className={carouselIndicators}>
              {headerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`${indicatorDot} ${index === currentSlide ? indicatorDotActive : ''}`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Logo */}
        {logoImage && (
          <div className={logoCorner}>
            <img
              src={logoImage.url || logoImage}
              alt={nom_boutique}
              loading="lazy"
            />
          </div>
        )}

        {/* Contenido principal */}
        <Container className={headerContent}>
          <Row className="align-items-end">
            <Col xs={12}>
              <div className={boutiqueInfo}>
                <h1 className={boutiqueTitle}>
                  {nom_boutique}
                </h1>
                {isVerified && (
                  <Badge className={verifiedBadge}>
                    <FaCheckCircle size={10} /> 
                    <span className="d-none d-sm-inline">Vérifiée</span>
                  </Badge>
                )}
              </div>
              
              {slogan_boutique && (
                <p className={slogan}>
                  {slogan_boutique}
                </p>
              )}
              
              {description_boutique && (
                <p className={description}>
                  {description_boutique.substring(0, 100)}
                  {description_boutique.length > 100 && '...'}
                </p>
              )}

              <div className={quickStats}>
                <Badge className={categoryBadge}>
                  <FaStore className="me-1" size={10} /> 
                  <span>{categorie}</span>
                </Badge>
                
                <div className={ratingContainer}>
                  <RatingStars rating={stats.notes} />
                  <span className={ratingCount}>
                    ({stats.avis})
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* BARRA DE ACCIONES - Dos filas en móvil */}
      <div className={actionBarMetrics}>
        <Container>
          {/* Primera fila: métricas + compartir + tres puntos */}
          <Row className="g-2 mb-2">
            <Col xs={12}>
              <div className="d-flex justify-content-between align-items-center">
                {/* Grupo de métricas */}
                <div className="d-flex gap-3 gap-md-4">
                  {/* Like con contador */}
                  <button 
                    className={actionButton}
                    onClick={handleFollow}
                  >
                    <span className={actionButtonIcon}>
                      {isFollowing ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                    </span>
                    <span className={actionButtonLabel}>
                      {isFollowing ? 'Suivi' : 'Suivre'}
                    </span>
                    <span className={actionButtonCount}>
                      {formatNumber(followersCount)}
                    </span>
                  </button>

                  {/* Productos con contador */}
                  <div className={actionButton}>
                    <span className={actionButtonIcon}>
                      <FaBoxOpen />
                    </span>
                    <span className={actionButtonLabel}>
                      Produits
                    </span>
                    <span className={actionButtonCount}>
                      {formatNumber(stats.produits || 0)}
                    </span>
                  </div>

                  {/* Vistas con contador */}
                  <div className={actionButton}>
                    <span className={actionButtonIcon}>
                      <FaEye />
                    </span>
                    <span className={actionButtonLabel}>
                      Vues
                    </span>
                    <span className={actionButtonCount}>
                      {formatNumber(stats.vues || 0)}
                    </span>
                  </div>
                </div>

                {/* Grupo de acciones: compartir y tres puntos */}
                <div className="d-flex gap-2">
                  {/* Botón Compartir - solo icono */}
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className={shareIconOnly}
                    >
                      <FaShare />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={dropdownMenuCustom} align="end">
                      <Dropdown.Item onClick={() => handleShare('facebook')} className={dropdownItem}>
                        <FaFacebook className="text-primary" size={16} /> Facebook
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleShare('twitter')} className={dropdownItem}>
                        <FaTwitter className="text-info" size={16} /> Twitter
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleShare('whatsapp')} className={dropdownItem}>
                        <FaWhatsapp className="text-success" size={16} /> WhatsApp
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleShare('copy')} className={dropdownItem}>
                        <FaLink size={16} /> Copier le lien
                        {showShareTooltip && (
                          <Badge bg="success" className="ms-2">Copié!</Badge>
                        )}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Icono de tres puntos con acciones adicionales */}
                  {isOwner && (
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        size="sm"
                        className="boutique-actions-button"
                      >
                        <FaEllipsisV />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className={dropdownMenuCustom} align="end">
                        <Dropdown.Header className={dropdownHeader}>
                          <FaCamera className="me-2" /> Gérer la boutique
                        </Dropdown.Header>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => setShowImageModal(true)} className={dropdownItem}>
                          <FaUpload className="text-primary" size={14} /> Changer l'image de fond
                        </Dropdown.Item>
                        <Dropdown.Item href={`/boutique/${_id}/edit`} className={dropdownItem}>
                          <FaEdit className="text-warning" size={14} /> Modifier les infos
                        </Dropdown.Item>
                        <Dropdown.Item href={`/boutique/${_id}/dashboard`} className={dropdownItem}>
                          <FaChartLine className="text-info" size={14} /> Tableau de bord
                        </Dropdown.Item>
                        {headerImages.length > 0 && (
                          <>
                            <Dropdown.Divider />
                            <Dropdown.Header className={dropdownHeader}>
                              Images actuelles
                            </Dropdown.Header>
                            {headerImages.map((img, index) => (
                              <Dropdown.Item 
                                key={index}
                                className={dropdownItem}
                                onClick={() => confirmDelete(index)}
                              >
                                <Image src={img.url || img} className={imageThumbnail} />
                                <span className="flex-grow-1">Image {index + 1}</span>
                                <FaTrash className="text-danger" size={12} />
                              </Dropdown.Item>
                            ))}
                          </>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* Segunda fila: botón Publier - ocupa todo el ancho */}
          {isOwner && (
            <Row className="g-2">
              <Col xs={12}>
                <Dropdown className="w-100">
                  <Dropdown.Toggle
                    variant="primary"
                    className={publishButtonFull}
                    style={{ backgroundColor: themeColor, borderColor: themeColor }}
                  >
                    <FaPlus className="me-2" /> Publier une annonce
                  </Dropdown.Toggle>

                  <Dropdown.Menu className={`${dropdownMenuCustom} w-100`}>
                    <Dropdown.Header className={dropdownHeader}>
                      <FaBoxOpen className="me-2" /> Nouvelle annonce
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item href={`/boutique/${_id}/products/new`} className={dropdownItem}>
                      <FaFileAlt className="text-primary" size={14} /> Produit standard
                    </Dropdown.Item>
                    <Dropdown.Item href={`/boutique/${_id}/products/new?type=promo`} className={dropdownItem}>
                      <FaTags className="text-success" size={14} /> Promotion
                    </Dropdown.Item>
                    <Dropdown.Item href={`/boutique/${_id}/gallery/new`} className={dropdownItem}>
                      <FaImages className="text-warning" size={14} /> Album photo
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      {/* Modal para gestionar imágenes */}
      <Modal 
        show={showImageModal} 
        onHide={handleCancel} 
        size="lg" 
        centered
        className={modalCustom}
      >
        <Modal.Header closeButton className={modalHeader}>
          <Modal.Title>
            <FaImages className="me-2 text-primary" />
            Gérer les images de fond
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalBody}>
          {/* Imágenes actuales */}
          {headerImages.length > 0 && (
            <div className="mb-4">
              <h6 className="mb-3 fw-bold">Images actuelles ({headerImages.length})</h6>
              <div className={imageGrid}>
                {headerImages.map((img, index) => (
                  <div key={index} className={imageCard}>
                    <img
                      src={img.url || img}
                      alt={`Image ${index + 1}`}
                      loading="lazy"
                    />
                    <button
                      className={deleteImageBtn}
                      onClick={() => confirmDelete(index)}
                      aria-label="Supprimer"
                    >
                      <FaTimes size={12} />
                    </button>
                    {index === currentSlide && (
                      <span className={activeBadge}>
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subir nuevas imágenes */}
          <div>
            <h6 className="mb-3 fw-bold">Ajouter des images</h6>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Choisir des images (max 5MB par image)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="py-2"
              />
              <Form.Text className="text-muted">
                Formats acceptés: JPG, PNG, GIF, WEBP
              </Form.Text>
            </Form.Group>

            {/* Previsualización */}
            {previewUrls.length > 0 && (
              <div className="mt-3">
                <p className="mb-2 fw-semibold">Prévisualisation ({previewUrls.length} images)</p>
                <div className={imageGrid}>
                  {previewUrls.map((url, index) => (
                    <div key={index} className={imageCard}>
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className={modalFooter}>
          <Button variant="secondary" onClick={handleCancel} disabled={uploading}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            style={{ backgroundColor: themeColor, borderColor: themeColor }}
          >
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Téléchargement...
              </>
            ) : (
              <>
                <FaUpload className="me-2" />
                Télécharger {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal 
        show={showDeleteConfirm} 
        onHide={() => setShowDeleteConfirm(false)} 
        centered 
        size="sm"
        className={modalCustom}
      >
        <Modal.Header closeButton className={modalHeader}>
          <Modal.Title className="text-danger">
            <FaTrash className="me-2" />
            Confirmer la suppression
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalBody}>
          <p>Voulez-vous vraiment supprimer cette image ?</p>
          <p className="text-muted small mb-0">Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer className={modalFooter}>
          <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
            Annuler
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteImage}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default React.memo(BoutiqueHeader);