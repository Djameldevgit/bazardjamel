// components/admin/BoutiquesTable.js - USANDO LAS NUEVAS PROPS

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Badge, Card, Pagination, Image, Alert, Spinner } from 'react-bootstrap';
import { FaCheck, FaTrash, FaEye, FaStore, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getBoutiquesPendientes, aprobarBoutique, rechazarBoutique } from '../../../redux/actions/boutiqueAproveAction';

const BoutiquesTable = ({ onLoadingChange }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { 
    boutiques = [], 
    loading = false, 
    total = 0, 
    page = 1, 
    totalPages = 1 
  } = useSelector(state => state.boutiqueAprove || {});
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const loadBoutiques = useCallback((pageNum = 1) => {
    if (auth?.token) {
      dispatch(getBoutiquesPendientes(auth.token, pageNum, limit));
    }
  }, [dispatch, auth?.token, limit]);
  
  useEffect(() => {
    loadBoutiques(currentPage);
  }, [loadBoutiques, currentPage]);
  
  useEffect(() => {
    if (onLoadingChange) onLoadingChange(loading);
  }, [loading, onLoadingChange]);
  
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [boutiques]);
  
  const safeBoutiques = Array.isArray(boutiques) ? boutiques : [];
  
  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(safeBoutiques.map(b => b._id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleApprove = async (item) => {
    if (window.confirm(`Approuver la boutique "${item.nom_boutique}" ?`)) {
      await dispatch(aprobarBoutique(item._id, auth.token));
      setMessage({ show: true, text: 'Boutique approuvée', type: 'success' });
      setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
    }
  };
  
  const handleReject = async (item) => {
    if (!window.confirm(`Rejeter la boutique "${item.nom_boutique}" ?`)) return;
    
    await dispatch(rechazarBoutique(item._id, auth.token));
    setMessage({ show: true, text: 'Boutique rejetée', type: 'warning' });
    setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  if (loading && safeBoutiques.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des boutiques...</p>
      </Card>
    );
  }
  
  return (
    <>
      {message.show && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ show: false, text: '', type: '' })}>
          {message.text}
        </Alert>
      )}
      
      {selectedItems.length > 0 && (
        <Card className="border-0 shadow-sm mb-3 bg-light">
          <Card.Body className="p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">
                <FaCheck className="me-2 text-success" />
                {selectedItems.length} boutique(s) sélectionnée(s)
              </span>
              <Button size="sm" variant="success" onClick={() => selectedItems.forEach(id => handleApprove({ _id: id }))}>
                <FaCheck className="me-1" /> Approuver la sélection
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="mb-0 fw-bold">
                <FaStore className="me-2" style={{ color: '#EC4899' }} />
                Boutiques à vérifier
              </h5>
              <small className="text-muted">
                Page {page} sur {totalPages} - Total: {total}
              </small>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectAll}
                onChange={handleSelectAll}
                disabled={safeBoutiques.length === 0}
              />
              <label className="form-check-label small">Tout sélectionner</label>
            </div>
          </div>
        </Card.Header>
        
        {safeBoutiques.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaStore className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucune boutique en attente</h5>
            <p className="small text-muted">Toutes les boutiques ont été vérifiées</p>
          </Card.Body>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th style={{ width: '60px' }}>Logo</th>
                    <th>Boutique</th>
                    <th>Propriétaire</th>
                    <th>Catégorie</th>
                    <th>Plan</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safeBoutiques.map(boutique => (
                    <tr key={boutique._id} className={selectedItems.includes(boutique._id) ? 'table-primary' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(boutique._id)}
                          onChange={() => handleSelectItem(boutique._id)}
                        />
                      </td>
                      <td>
                        {boutique.images?.[0]?.url ? (
                          <Image
                            src={boutique.images[0].url}
                            width="45"
                            height="45"
                            className="rounded-3"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                            <FaStore className="text-muted" />
                          </div>
                        )}
                      </td>
                      <td>
                        <Link to={`/boutique/${boutique._id}`} className="text-decoration-none fw-medium">
                          {boutique.nom_boutique}
                        </Link>
                        <br />
                        <small className="text-muted">{boutique.domaine_boutique}</small>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="small fw-medium">{boutique.user?.username || 'N/A'}</span>
                          <small className="text-muted">{boutique.user?.email}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info" className="rounded-pill">
                          {boutique.categorie}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={boutique.plan === 'premium' ? 'warning' : 'secondary'} className="rounded-pill">
                          {boutique.plan || 'gratuit'}
                        </Badge>
                      </td>
                      <td>
                        <div className="small">
                          {boutique.proprietaire?.telephone && (
                            <div><FaPhone className="me-1" size={10} /> {boutique.proprietaire.telephone}</div>
                          )}
                          {boutique.proprietaire?.wilaya && (
                            <div className="text-muted">{boutique.proprietaire.wilaya}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(boutique.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            as={Link}
                            to={`/boutique/${boutique._id}`}
                            variant="outline-primary"
                            size="sm"
                            title="Voir détails"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleApprove(boutique)}
                            title="Approuver"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleReject(boutique)}
                            title="Rejeter"
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
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    />
                    {[...Array(totalPages)].slice(0, 10).map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={page === idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
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

export default BoutiquesTable;