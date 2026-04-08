// 📂 components/admin/ProductsTable.js - VERSIÓN ACTUALIZADA CON REDUX

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Badge, Card, Pagination, Image, Alert, Spinner } from 'react-bootstrap';
import { FaCheck, FaTrash, FaEye, FaBox, FaStore, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getProductsPendientes, aprobarProducto, rechazarProducto } from '../../../redux/actions/boutiqueAproveAction';

const ProductsTable = ({ selectedCategory, onLoadingChange }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { 
    products = [], 
    loading = false, 
    totalProducts = 0, 
    pageProducts = 1, 
    totalPagesProducts = 1 
  } = useSelector(state => state.boutiqueAprove || {});
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  // Cargar productos usando Redux
  const loadProducts = useCallback((page = 1) => {
    if (auth?.token) {
      const filters = {};
      if (selectedCategory?.slug && selectedCategory.slug !== 'products') {
        filters.categorie = selectedCategory.slug;
      }
      dispatch(getProductsPendientes(auth.token, page, limit, filters));
    }
  }, [dispatch, auth?.token, limit, selectedCategory]);
  
  useEffect(() => {
    loadProducts(currentPage);
  }, [loadProducts, currentPage]);
  
  useEffect(() => {
    if (onLoadingChange) onLoadingChange(loading);
  }, [loading, onLoadingChange]);
  
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [products]);
  
  const safeProducts = Array.isArray(products) ? products : [];
  
  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(safeProducts.map(p => p._id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleApprove = async (product) => {
    if (window.confirm(`Approuver le produit "${product.title}" ?`)) {
      try {
        await dispatch(aprobarProducto(product._id, auth.token));
        setMessage({ show: true, text: 'Produit approuvé', type: 'success' });
        setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
        // Recargar la página actual
        loadProducts(currentPage);
      } catch (error) {
        setMessage({ show: true, text: 'Erreur lors de l\'approbation', type: 'danger' });
      }
    }
  };
  
  const handleApproveSelected = async () => {
    if (selectedItems.length === 0) {
      setMessage({ show: true, text: 'Sélectionnez au moins un produit', type: 'warning' });
      setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
      return;
    }
    
    if (window.confirm(`Approuver ${selectedItems.length} produit(s) ?`)) {
      for (const id of selectedItems) {
        await dispatch(aprobarProducto(id, auth.token));
      }
      setMessage({ show: true, text: `${selectedItems.length} produit(s) approuvé(s)`, type: 'success' });
      setSelectedItems([]);
      setSelectAll(false);
      setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
      loadProducts(currentPage);
    }
  };
  
  const handleReject = async (product) => {
    if (!window.confirm(`Rejeter le produit "${product.title}" ?`)) return;
    
    try {
      await dispatch(rechazarProducto(product._id, auth.token));
      setMessage({ show: true, text: 'Produit rejeté', type: 'warning' });
      setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
      loadProducts(currentPage);
    } catch (error) {
      setMessage({ show: true, text: 'Erreur lors du rejet', type: 'danger' });
    }
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesProducts) {
      setCurrentPage(newPage);
    }
  };
  
  if (loading && safeProducts.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des produits...</p>
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
                {selectedItems.length} produit(s) sélectionné(s)
              </span>
              <Button size="sm" variant="success" onClick={handleApproveSelected}>
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
                <FaBox className="me-2" style={{ color: '#EC4899' }} />
                Produits de boutique à vérifier
                {selectedCategory?.name && selectedCategory.name !== 'products' && (
                  <Badge bg="info" className="ms-2">
                    {selectedCategory.name}
                  </Badge>
                )}
              </h5>
              <small className="text-muted">
                Page {pageProducts} sur {totalPagesProducts} - Total: {totalProducts}
              </small>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectAll}
                onChange={handleSelectAll}
                disabled={safeProducts.length === 0}
              />
              <label className="form-check-label small">Tout sélectionner</label>
            </div>
          </div>
        </Card.Header>
        
        {safeProducts.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaBox className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucun produit en attente</h5>
            <p className="small text-muted">Tous les produits ont été vérifiés</p>
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
                    <th style={{ width: '60px' }}>Image</th>
                    <th>Produit</th>
                    <th>Boutique</th>
                    <th>Prix</th>
                    <th>État</th>
                    <th>Catégorie</th>
                    <th>Date</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safeProducts.map(product => (
                    <tr key={product._id} className={selectedItems.includes(product._id) ? 'table-primary' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(product._id)}
                          onChange={() => handleSelectItem(product._id)}
                        />
                      </td>
                      <td>
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            width="50"
                            height="50"
                            className="rounded-3"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                            <FaBox className="text-muted" />
                          </div>
                        )}
                      </td>
                      <td>
                        <Link to={`/product/${product._id}`} className="text-decoration-none fw-medium">
                          {product.title?.length > 35 ? product.title.substring(0, 35) + '...' : product.title}
                        </Link>
                        <br />
                        <small className="text-muted">{product.subCategory}</small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <FaStore className="text-muted small" />
                          <Link to={`/boutique/${product.boutique?._id}`} className="small text-decoration-none">
                            {product.boutique?.nom_boutique || 'N/A'}
                          </Link>
                        </div>
                      </td>
                      <td className="fw-bold text-primary">
                        <FaMoneyBillWave className="me-1" />
                        {product.price?.toLocaleString()} DA
                        </td>
                      <td>
                        <Badge bg={
                          product.etat === 'neuf' ? 'success' :
                          product.etat === 'comme-neuf' ? 'info' :
                          product.etat === 'bon-etat' ? 'warning' : 'secondary'
                        } className="rounded-pill">
                          {product.etat}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg="info" className="rounded-pill">
                          {product.categorie}
                        </Badge>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            as={Link}
                            to={`/product/${product._id}`}
                            variant="outline-primary"
                            size="sm"
                            title="Voir détails"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleApprove(product)}
                            title="Approuver"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleReject(product)}
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
            
            {totalPagesProducts > 1 && (
              <Card.Footer className="bg-white border-0 py-3">
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev 
                      onClick={() => handlePageChange(pageProducts - 1)}
                      disabled={pageProducts === 1}
                    />
                    {[...Array(Math.min(totalPagesProducts, 10))].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={pageProducts === idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      onClick={() => handlePageChange(pageProducts + 1)}
                      disabled={pageProducts === totalPagesProducts}
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

export default ProductsTable;