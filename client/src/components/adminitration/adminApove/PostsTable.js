// 📂 components/admin/PostsTable.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Card, Button, Badge, Table, Pagination, Alert, Spinner, Form, Image
} from 'react-bootstrap';
import { 
  FaCheck, FaTrash, FaEye, FaClipboardList, FaCheckDouble, FaCheckCircle
} from 'react-icons/fa';
 import { getPostsPendientes , aprovarPostPendiente} from '../../../redux/actions/postAproveAction';
 
import { deletePost } from '../../../redux/actions/postAction';

const PostsTable = ({ selectedCategory, onLoadingChange }) => {
  const dispatch = useDispatch();
  const { postsPendientes, loading, total, page, totalPages } = useSelector(state => state.postAprove);
  const { auth, socket } = useSelector(state => state);
  
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showMessage, setShowMessage] = useState({ show: false, text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  
// 📂 components/admin/PostsTable.js - VERIFICAR el useEffect

// 📂 components/admin/PostsTable.js - Actualizar useEffect

useEffect(() => {
  const filters = {};
  
  // Si hay una categoría seleccionada
  if (selectedCategory) {
    // Usar categorie si existe (para subcategorías)
    if (selectedCategory.categorie) {
      filters.categorie = selectedCategory.categorie;
      console.log('🔍 Filtrando por categoría padre:', selectedCategory.categorie);
    }
    
    // Usar slug si es categoría principal
    if (selectedCategory.slug && !selectedCategory.categorie) {
      filters.categorie = selectedCategory.slug;
      console.log('🔍 Filtrando por categoría:', selectedCategory.slug);
    }
    
    // Filtrar por subcategoría
    if (selectedCategory.subCategory) {
      filters.subCategory = selectedCategory.subCategory;
      console.log('🔍 Filtrando por subcategoría:', selectedCategory.subCategory);
    }
  }
  
  console.log('🔍 Dispatch con filtros:', filters);
  
  dispatch(getPostsPendientes(auth.token, currentPage, postsPerPage, filters));
}, [dispatch, auth.token, currentPage, selectedCategory]);
  
  useEffect(() => {
    setSelectedPosts([]);
    setSelectAll(false);
  }, [postsPendientes, selectedCategory]);
  
  useEffect(() => {
    if (onLoadingChange) onLoadingChange(loading);
  }, [loading, onLoadingChange]);
  
  const handleSelectPost = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(postsPendientes.map(post => post._id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleApproveSelected = () => {
    if (selectedPosts.length === 0) {
      setShowMessage({ show: true, text: 'Sélectionnez au moins un post', type: 'warning' });
      setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 3000);
      return;
    }
    
    if (window.confirm(`Approuver ${selectedPosts.length} post(s) sélectionné(s) ?`)) {
      selectedPosts.forEach(postId => {
        const post = postsPendientes.find(p => p._id === postId);
        if (post) {
          dispatch(aprovarPostPendiente({ post, estado: 'aprobado', auth, socket }));
        }
      });
      setShowMessage({ show: true, text: `${selectedPosts.length} post(s) approuvé(s)`, type: 'success' });
      setSelectedPosts([]);
      setSelectAll(false);
      setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 3000);
    }
  };
  
  const handleAprobar = (post) => {
    if (window.confirm(`Approuver le post "${post.title}" ?`)) {
      dispatch(aprovarPostPendiente({ post, estado: 'aprobado', auth, socket }));
      setShowMessage({ show: true, text: 'Post approuvé', type: 'success' });
      setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 2000);
    }
  };
  
  const handleDeletePost = (post) => {
    if (window.confirm(`Supprimer le post "${post.title}" ?`)) {
      dispatch(deletePost({ post, auth, socket }));
      setShowMessage({ show: true, text: 'Post supprimé', type: 'success' });
      setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 2000);
    }
  };
  
  if (loading && postsPendientes.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des posts...</p>
      </Card>
    );
  }
  
  return (
    <>
      {showMessage.show && (
        <Alert 
          variant={showMessage.type} 
          dismissible 
          onClose={() => setShowMessage({ show: false, text: '', type: '' })}
          className="mb-4"
        >
          {showMessage.text}
        </Alert>
      )}
      
      {selectedPosts.length > 0 && (
        <Card className="border-0 shadow-sm mb-4 bg-light">
          <Card.Body className="p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0">
                <FaCheckCircle className="me-2 text-success" />
                {selectedPosts.length} post(s) sélectionné(s)
              </h6>
              <Button variant="success" size="sm" onClick={handleApproveSelected}>
                <FaCheckDouble className="me-2" /> Approuver la sélection
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">
                <FaClipboardList className="me-2 text-primary" />
                Posts en Attente
                {selectedCategory && selectedCategory.name && selectedCategory.name !== 'posts' && (
                  <Badge bg="info" className="ms-2">
                    {selectedCategory.name}
                  </Badge>
                )}
              </h5>
              <small className="text-muted">
                Page {page} sur {totalPages} - Total: {total} posts
              </small>
            </div>
            <Form.Check
              type="checkbox"
              label="Tout sélectionner"
              checked={selectAll}
              onChange={handleSelectAll}
              className="fw-semibold"
              disabled={postsPendientes.length === 0}
            />
          </div>
        </Card.Header>
        
        {postsPendientes.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaClipboardList className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucun post en attente</h5>
            <p className="small text-muted">Tous les posts ont été vérifiés</p>
          </Card.Body>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }} className="text-center">
                      <Form.Check type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th style={{ width: '60px' }}>Image</th>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Utilisateur</th>
                    <th>Prix</th>
                    <th>Date</th>
                    <th style={{ width: '120px' }} className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {postsPendientes.map((post) => (
                    <tr key={post._id} className={selectedPosts.includes(post._id) ? 'table-primary' : ''}>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={selectedPosts.includes(post._id)}
                          onChange={() => handleSelectPost(post._id)}
                        />
                      </td>
                      <td>
                        {post.images?.[0]?.url ? (
                          <Image 
                            src={post.images[0].url} 
                            width="50"
                            height="50"
                            className="rounded-3"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                            <small>No img</small>
                          </div>
                        )}
                      </td>
                      <td>
                        <Link to={`/post/${post._id}`} className="text-decoration-none fw-medium">
                          {post.title?.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                        </Link>
                      </td>
                      <td>
                        <Badge bg="info" className="rounded-pill">
                          {post.categorie}
                        </Badge>
                      </td>
                      <td>
                        <small className="text-muted">{post.user?.username}</small>
                      </td>
                      <td className="fw-bold text-primary">
                        {post.price?.toLocaleString()} DA
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button 
                            as={Link} 
                            to={`/post/${post._id}`}
                            variant="outline-primary" 
                            size="sm"
                            title="Voir détails"
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleAprobar(post)}
                            title="Approuver"
                          >
                            <FaCheck />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeletePost(post)}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <Card.Footer className="bg-white border-0 py-3">
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (totalPages <= 7 || 
                          pageNum === 1 || 
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)) {
                        return (
                          <Pagination.Item 
                            key={pageNum}
                            active={pageNum === currentPage}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                        return <Pagination.Ellipsis key={pageNum} />;
                      }
                      return null;
                    })}
                    <Pagination.Next 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </Card.Footer>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default PostsTable;