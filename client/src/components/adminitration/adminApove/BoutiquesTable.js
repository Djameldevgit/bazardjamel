// components/admin/BoutiquesTable.js - VERSIÓN CORREGIDA (SIN BUCLE INFINITO)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Badge, Card, Pagination, Image, Alert, Spinner } from 'react-bootstrap';
import { FaCheck, FaTrash, FaEye, FaStore, FaPhone, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { 
  getBoutiquesPendientes, 
  aprobarBoutique, 
  rechazarBoutique,
  activatePaidBoutique
} from '../../../redux/actions/boutiqueAproveAction';
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
  const [filterPlan, setFilterPlan] = useState('tous');
  const limit = 10;
  
  // 🔥 USAR useRef para evitar llamadas infinitas
  const loadingRef = useRef(loading);
  const onLoadingChangeRef = useRef(onLoadingChange);
  
  // Actualizar refs cuando cambien
  useEffect(() => {
    loadingRef.current = loading;
    onLoadingChangeRef.current = onLoadingChange;
  }, [loading, onLoadingChange]);
  
  // 🔥 CORREGIDO: useEffect con dependencia correcta
  useEffect(() => {
    if (onLoadingChangeRef.current) {
      onLoadingChangeRef.current(loadingRef.current);
    }
  }, [loading]); // Solo depende de loading, no de onLoadingChange
  
  // Filtrar SOLO planes de pago (excluir gratuitos)
  const paidBoutiques = Array.isArray(boutiques) 
    ? boutiques.filter(b => b.plan !== 'gratuit')
    : [];
  
  // Filtrar por plan específico
  const filteredBoutiques = filterPlan === 'tous' 
    ? paidBoutiques 
    : paidBoutiques.filter(b => b.plan === filterPlan);
  
  // 🔥 CORREGIDO: useCallback con dependencias correctas
  const loadBoutiques = useCallback((pageNum = 1) => {
    if (auth?.token) {
      dispatch(getBoutiquesPendientes(auth.token, pageNum, limit));
    }
  }, [dispatch, auth?.token, limit]);
  
  // 🔥 CORREGIDO: Solo cargar cuando cambia currentPage
  useEffect(() => {
    loadBoutiques(currentPage);
  }, [currentPage, loadBoutiques]); // loadBoutiques es estable por useCallback
  
  // Reset selección cuando cambian los datos
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [filteredBoutiques.length]); // Solo cuando cambia la longitud
  
  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredBoutiques.map(b => b._id));
    }
    setSelectAll(!selectAll);
  };
  
  // Mostrar mensaje temporal
  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
  };
  
  // Aprobar boutique
  const handleApprove = async (item) => {
    const confirmMsg = item.plan === 'gratuit'
      ? `Approuver la boutique gratuite "${item.nom_boutique}" ? Elle sera visible immédiatement.`
      : `Approuver la boutique "${item.nom_boutique}" ? Elle restera inactive jusqu'au paiement.`;
    
    if (!window.confirm(confirmMsg)) return;
    
    const result = await dispatch(aprobarBoutique(item._id, auth.token));
    if (result?.success) {
      showMessage(
        item.plan === 'gratuit' 
          ? 'Boutique gratuite approuvée et visible' 
          : 'Boutique approuvée. En attente de paiement pour activation.',
        'success'
      );
      loadBoutiques(currentPage);
    }
  };
  
  // Activar por pago
  const handleActivatePayment = async (item) => {
    if (item.plan === 'gratuit') {
      showMessage('Les boutiques gratuites n\'ont pas besoin d\'activation', 'warning');
      return;
    }
    
    if (!window.confirm(`Confirmer le paiement et activer la boutique "${item.nom_boutique}" ?`)) return;
    
    const result = await dispatch(activatePaidBoutique(item._id, auth.token));
    if (result?.success) {
      showMessage('Paiement confirmé. Boutique activée avec succès!', 'success');
      loadBoutiques(currentPage);
    }
  };
  
  // Rechazar boutique
  const handleReject = async (item) => {
    if (!window.confirm(`Rejeter la boutique "${item.nom_boutique}" ? Cette action est irréversible.`)) return;
    
    await dispatch(rechazarBoutique(item._id, auth.token));
    showMessage('Boutique rejetée et supprimée', 'warning');
    loadBoutiques(currentPage);
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Estadísticas
  const stats = {
    total: paidBoutiques.length,
    basique: paidBoutiques.filter(b => b.plan === 'basique').length,
    premium: paidBoutiques.filter(b => b.plan === 'premium').length,
    entreprise: paidBoutiques.filter(b => b.plan === 'entreprise').length,
  };
  
  // Loading inicial
  if (loading && paidBoutiques.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des boutiques payantes...</p>
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
      
      {/* Banner informativo */}
      <Card className="border-0 shadow-sm mb-3 bg-info bg-opacity-10">
        <Card.Body className="py-2">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <FaMoneyBillWave className="text-info" size={20} />
              <small className="text-muted">
                <strong>Boutiques payantes uniquement</strong> — Les boutiques gratuites sont gérées dans l'onglet "Approbation"
              </small>
            </div>
            <div className="d-flex gap-2">
              <Badge bg="primary" pill>Basique: {stats.basique}</Badge>
              <Badge bg="warning" pill>Premium: {stats.premium}</Badge>
              <Badge bg="success" pill>Entreprise: {stats.entreprise}</Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Filtro por plan */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body className="py-2">
          <div className="d-flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant={filterPlan === 'tous' ? 'primary' : 'outline-secondary'}
              onClick={() => setFilterPlan('tous')}
            >
              Tous ({stats.total})
            </Button>
            <Button 
              size="sm" 
              variant={filterPlan === 'basique' ? 'primary' : 'outline-secondary'}
              onClick={() => setFilterPlan('basique')}
            >
              Basique ({stats.basique})
            </Button>
            <Button 
              size="sm" 
              variant={filterPlan === 'premium' ? 'primary' : 'outline-secondary'}
              onClick={() => setFilterPlan('premium')}
            >
              Premium ({stats.premium})
            </Button>
            <Button 
              size="sm" 
              variant={filterPlan === 'entreprise' ? 'primary' : 'outline-secondary'}
              onClick={() => setFilterPlan('entreprise')}
            >
              Entreprise ({stats.entreprise})
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Barra de selección múltiple */}
      {selectedItems.length > 0 && (
        <Card className="border-0 shadow-sm mb-3 bg-light">
          <Card.Body className="p-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className="fw-semibold">
                <FaCheck className="me-2 text-success" />
                {selectedItems.length} boutique(s) sélectionnée(s)
              </span>
              <div className="d-flex gap-2">
                <Button 
                  size="sm" 
                  variant="success" 
                  onClick={() => {
                    selectedItems.forEach(id => {
                      const boutique = filteredBoutiques.find(b => b._id === id);
                      if (boutique) handleApprove(boutique);
                    });
                  }}
                >
                  <FaCheck className="me-1" /> Approuver sélection
                </Button>
                <Button 
                  size="sm" 
                  variant="info" 
                  onClick={() => {
                    selectedItems.forEach(id => {
                      const boutique = filteredBoutiques.find(b => b._id === id);
                      if (boutique) handleActivatePayment(boutique);
                    });
                  }}
                >
                  <FaMoneyBillWave className="me-1" /> Activer paiement
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
      
      {/* Tabla principal */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="mb-0 fw-bold">
                <FaStore className="me-2" style={{ color: '#EC4899' }} />
                Boutiques payantes à vérifier
              </h5>
              <small className="text-muted">
                Page {page} sur {totalPages} - Total payantes: {stats.total}
              </small>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectAll}
                onChange={handleSelectAll}
                disabled={filteredBoutiques.length === 0}
              />
              <label className="form-check-label small">Tout sélectionner</label>
            </div>
          </div>
        </Card.Header>
        
        {filteredBoutiques.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaStore className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucune boutique payante en attente</h5>
            <p className="small text-muted">
              {paidBoutiques.length === 0 
                ? "Toutes les boutiques payantes ont été traitées" 
                : `Aucune boutique avec le plan "${filterPlan}"`}
            </p>
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
                    <th>Statut</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th style={{ width: '180px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBoutiques.map(boutique => (
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
                        <Badge 
                          bg={boutique.plan === 'premium' ? 'warning' : boutique.plan === 'entreprise' ? 'success' : 'primary'} 
                          className="rounded-pill"
                        >
                          {boutique.plan}
                        </Badge>
                      </td>
                      <td>
                        {boutique.pendiente ? (
                          <Badge bg="warning" className="rounded-pill">
                            <FaClock className="me-1" size={10} /> En attente
                          </Badge>
                        ) : boutique.isActive ? (
                          <Badge bg="success" className="rounded-pill">
                            <FaCheck className="me-1" size={10} /> Active
                          </Badge>
                        ) : (
                          <Badge bg="secondary" className="rounded-pill">
                            <FaClock className="me-1" size={10} /> En attente paiement
                          </Badge>
                        )}
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
                        <div className="d-flex gap-1 flex-wrap">
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
                            title="Approuver la boutique"
                            disabled={!boutique.pendiente}
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleActivatePayment(boutique)}
                            title="Confirmer paiement et activer"
                            disabled={boutique.pendiente || boutique.isActive}
                          >
                            <FaMoneyBillWave />
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
                    {[...Array(Math.min(totalPages, 10))].map((_, idx) => (
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