// components/Video/VideoActions.jsx - Estilo TikTok
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import { ThreeDotsVertical, Pencil, Trash2, Flag } from 'react-bootstrap-icons';
import { updateVideo, deleteVideo } from '../../redux/actions/videoAction';

const VideoActions = ({ video, onVideoUpdate, onVideoDelete }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para edición
  const [editData, setEditData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    tags: video?.tags?.join(', ') || '',
    categorySlug: video?.categorySlug || ''
  });
  
  // Categorías
  const videoCategories = [
    { name: 'Véhicules', slug: 'videos-vehicules' },
    { name: 'Immobilier', slug: 'videos-immobilier' },
    { name: 'Téléphones', slug: 'videos-telephones' },
    { name: 'Informatique', slug: 'videos-informatique' },
    { name: 'Électroménager', slug: 'videos-electromenager' },
    { name: 'Mode & Vêtements', slug: 'videos-mode-vetements' },
    { name: 'Maison & Jardin', slug: 'videos-maison-jardin' },
    { name: 'Sport & Loisirs', slug: 'videos-sport-loisirs' },
    { name: 'Tutoriels', slug: 'videos-tutoriels' },
    { name: 'Reviews', slug: 'videos-reviews' }
  ];
  
  const handleEdit = async () => {
    setLoading(true);
    const result = await dispatch(updateVideo(video._id, {
      title: editData.title,
      description: editData.description,
      tags: editData.tags.split(',').map(t => t.trim()).filter(t => t),
      categorySlug: editData.categorySlug
    }, auth.token));
    
    if (result.success) {
      setShowEditModal(false);
      if (onVideoUpdate) onVideoUpdate(result.video);
    }
    setLoading(false);
  };
  
  const handleDelete = async () => {
    setLoading(true);
    const result = await dispatch(deleteVideo(video._id, auth.token));
    
    if (result.success) {
      setShowDeleteModal(false);
      if (onVideoDelete) onVideoDelete(video._id);
      history.push('/videos/1');
    }
    setLoading(false);
  };
  
  const handleReport = () => {
    alert('Video reportado a los administradores');
  };
  
  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle 
          variant="link" 
          className="tiktok-action-btn p-0"
          style={{ 
            textDecoration: 'none', 
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            color: 'white'
          }}
        >
          <ThreeDotsVertical size={24} />
        </Dropdown.Toggle>
        
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowEditModal(true)}>
            <Pencil size={16} className="me-2" /> Modifier
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowDeleteModal(true)} className="text-danger">
            <Trash2 size={16} className="me-2" /> Supprimer
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleReport}>
            <Flag size={16} className="me-2" /> Signaler
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
      {/* Modales... (igual que antes) */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modifier la vidéo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                maxLength={200}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                maxLength={2000}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Catégorie</Form.Label>
              <Form.Select
                value={editData.categorySlug}
                onChange={(e) => setEditData({ ...editData, categorySlug: e.target.value })}
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
                value={editData.tags}
                onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                placeholder="voiture, occasion, algerie"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleEdit} disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer la vidéo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer cette vidéo ?</p>
          <p className="text-muted small">Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VideoActions;