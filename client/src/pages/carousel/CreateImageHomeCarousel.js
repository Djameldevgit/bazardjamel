// frontend/src/pages/admin/CreateImageHomeCarousel.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Badge,
  Tabs,
  Tab
} from 'react-bootstrap';
import {
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaImage,
  FaLink
} from 'react-icons/fa';
import {
  createCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
  getAllCarouselImages
} from '../../redux/actions/carouselHomeAction';
import ImagesStepCarouselHome from '../../components/CATEGORIES/camposComun/ImagesStep';

const CreateImageHomeCarousel = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const isEditMode = !!id;

  const authState = useSelector(state => state.auth);
  const { allImages, loading } = useSelector(state => state.carousel || { allImages: [], loading: false });
  
  const auth = authState?.auth || authState;
  const token = auth?.token || authState?.token;
  const user = auth?.user || authState?.user;

  // 🔥 FORMULARIO SIMPLIFICADO - solo 4 campos
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    linkType: 'none'
  });
  
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImageData, setExistingImageData] = useState(null);
  const [activeTab, setActiveTab] = useState('create');

  // Cargar imágenes existentes
  useEffect(() => {
    if (token) {
      dispatch(getAllCarouselImages());
    }
  }, [dispatch, token]);

  // Cargar datos en modo edición
  useEffect(() => {
    if (isEditMode && allImages && allImages.length > 0) {
      const imageToEdit = allImages.find(img => img._id === id);
      if (imageToEdit) {
        setFormData({
          title: imageToEdit.title,
          description: imageToEdit.description || '',
          link: imageToEdit.link || '',
          linkType: imageToEdit.linkType || 'none'
        });
        setExistingImageData(imageToEdit.image);
        setImages([{
          url: imageToEdit.image.url,
          public_id: imageToEdit.image.public_id,
          isExisting: true,
          file: null
        }]);
      }
    }
  }, [isEditMode, allImages, id]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (images.length === 0 && !existingImageData) {
      newErrors.image = 'Debes seleccionar una imagen';
    }

    if (formData.linkType === 'external' && !formData.link) {
      newErrors.link = 'Debes ingresar una URL para enlace externo';
    }

    if (formData.linkType === 'internal' && formData.link && !formData.link.startsWith('/')) {
      newErrors.link = 'Las rutas internas deben comenzar con "/"';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, images, existingImageData]);

  const handleSave = useCallback(async (e) => {
    e?.preventDefault?.();
    
    if (!token) {
      alert('Error de autenticación');
      return;
    }
    
    if (!validateForm()) return;

    let imageToSubmit = null;
    
    if (images.length > 0) {
      imageToSubmit = images[0];
    } else if (existingImageData) {
      imageToSubmit = {
        url: existingImageData.url,
        public_id: existingImageData.public_id,
        isExisting: true
      };
    }

    if (!imageToSubmit) {
      setErrors(prev => ({ ...prev, image: 'Debes seleccionar una imagen' }));
      return;
    }

    setIsSubmitting(true);

    const dataToSubmit = {
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      link: formData.link?.trim() || '',
      linkType: formData.linkType,
      imageFile: imageToSubmit
    };

    const authObject = { token, user };
    
    let result;
    if (isEditMode) {
      result = await dispatch(updateCarouselImage(id, dataToSubmit, authObject));
    } else {
      result = await dispatch(createCarouselImage(dataToSubmit, authObject));
    }

    if (result?.success) {
      if (!isEditMode) {
        setFormData({ title: '', description: '', link: '', linkType: 'none' });
        setImages([]);
        setExistingImageData(null);
      }
      
      dispatch(getAllCarouselImages());
      
      if (isEditMode) {
        setTimeout(() => history.push('/admin/carousel'), 1500);
      } else {
        alert('✅ Imagen creada exitosamente');
      }
    }
    
    setIsSubmitting(false);
  }, [formData, images, existingImageData, isEditMode, id, token, user, dispatch, validateForm, history]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('¿Eliminar esta imagen?')) return;
    if (!token) return;

    const result = await dispatch(deleteCarouselImage(id, { token, user }));
    if (result?.success) {
      history.push('/admin/carousel');
    }
  }, [id, token, user, dispatch, history]);

  const handleCancel = useCallback(() => {
    history.push('/admin/carousel');
  }, [history]);

  // 🔥 RENDERIZAR LISTA DE IMÁGENES (SOLO CARRUSEL PRINCIPAL)
  const renderImageList = () => {
    if (!allImages || allImages.length === 0) {
      return <Alert variant="info">No hay imágenes en el carrusel</Alert>;
    }

    return (
      <div className="mt-4">
        <Row>
          {allImages.map(img => (
            <Col md={6} lg={4} key={img._id} className="mb-3">
              <Card className="h-100">
                <div style={{ height: '150px', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={img.image?.url}
                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="h6">{img.title}</Card.Title>
                  <Card.Text className="small text-muted">
                    {img.description?.substring(0, 60)}...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <Badge bg={img.linkType === 'none' ? 'secondary' : 'info'}>
                      {img.linkType === 'internal' ? 'Enlace interno' : img.linkType === 'external' ? 'Enlace externo' : 'Sin enlace'}
                    </Badge>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => history.push(`/admin/carousel/edit/${img._id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={async () => {
                          if (window.confirm('¿Eliminar esta imagen?')) {
                            if (!token) return;
                            await dispatch(deleteCarouselImage(img._id, { token, user }));
                            dispatch(getAllCarouselImages());
                          }
                        }}
                      >
                        <FaTrash size={12} />
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  if (!token) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error de autenticación</Alert.Heading>
          <p>Por favor, inicia sesión nuevamente.</p>
          <Button variant="danger" onClick={() => history.push('/login')}>Ir a login</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={12}>
          <div className="d-flex align-items-center mb-4">
            <Button variant="outline-secondary" className="me-3" onClick={handleCancel}>
              <FaArrowLeft className="me-2" /> Volver
            </Button>
            <h2 className="mb-0">
              <FaImage className="me-2 text-primary" />
              {isEditMode ? 'Editar Imagen del Carrusel' : 'Crear Imagen del Carrusel'}
            </h2>
          </div>

          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Tab eventKey="create" title={isEditMode ? '✏️ Editar' : '➕ Crear'}>
              <Card>
                <Card.Body>
                  <Form onSubmit={handleSave}>
                    {/* Título */}
                    <Form.Group className="mb-3">
                      <Form.Label>Título *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ej: Nuevos Productos 2024"
                        isInvalid={!!errors.title}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Descripción */}
                    <Form.Group className="mb-3">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Breve descripción del contenido..."
                      />
                    </Form.Group>

                    {/* 🔥 COMPONENTE IMAGES STEP */}
                    <div className="mb-4">
                      <ImagesStepCarouselHome
                        images={images}
                        setImages={setImages}
                        onComplete={handleSave}
                        onBack={() => {}}
                      />
                    </div>

                    {errors.image && (
                      <Form.Text className="text-danger d-block mb-3">{errors.image}</Form.Text>
                    )}

                    {/* Enlace */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaLink className="me-1" /> Enlace (opcional)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="/boutique/123 o https://ejemplo.com"
                        isInvalid={!!errors.link}
                      />
                      <Form.Text className="text-muted">
                        Puede ser una URL externa o ruta interna de la app
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">{errors.link}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Tipo de enlace */}
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de enlace</Form.Label>
                      <Form.Select
                        name="linkType"
                        value={formData.linkType}
                        onChange={handleChange}
                      >
                        <option value="none">Sin enlace</option>
                        <option value="internal">Interno (ruta de la app)</option>
                        <option value="external">Externo (URL completa)</option>
                      </Form.Select>
                    </Form.Group>

                    {/* Botones */}
                    <div className="d-flex gap-2 mt-4">
                      <Button type="submit" variant="success" disabled={loading || isSubmitting}>
                        <FaSave className="me-2" />
                        {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar')}
                      </Button>

                      {isEditMode && (
                        <Button type="button" variant="danger" onClick={handleDelete} disabled={loading}>
                          <FaTrash className="me-2" /> Eliminar
                        </Button>
                      )}

                      <Button type="button" variant="secondary" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="list" title="📋 Lista de Imágenes">
              {renderImageList()}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateImageHomeCarousel;