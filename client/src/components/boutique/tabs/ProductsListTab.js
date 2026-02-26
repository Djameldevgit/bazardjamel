// components/boutique/tabs/ProductsListTab.jsx
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Badge, Form, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaFilter, FaSync } from 'react-icons/fa';
import { getBoutiquePosts } from '../../../redux/actions/boutiquePostAction';

const ProductsListTab = ({ boutique }) => { // 👈 No necesitamos isOwner como prop
  const history = useHistory();
  const dispatch = useDispatch();
  const { boutiqueProducts, loadingProducts } = useSelector(state => state.boutique);
  const { auth } = useSelector(state => state);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Verificar si es dueño (podemos calcularlo aquí también)
  const isOwner = auth.user?._id === boutique?.user;

  console.log('🔍 ProductsListTab - isOwner:', isOwner);
  console.log('👤 auth.user?._id:', auth.user?._id);
  console.log('🏪 boutique.user:', boutique?.user);

  useEffect(() => {
    if (boutique?._id) {
      dispatch(getBoutiquePosts(boutique._id, page, 12));
    }
  }, [dispatch, boutique?._id, page]);

  const products = boutiqueProducts?.[boutique?._id]?.products || [];
  const total = boutiqueProducts?.[boutique?._id]?.total || 0;
  const hasMore = boutiqueProducts?.[boutique?._id]?.hasMore || false;

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge bg="success">Actif</Badge> : 
      <Badge bg="secondary">Inactif</Badge>;
  };

  const filteredProducts = products.filter(product => 
    product.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewProduct = () => {
    if (!boutique?._id) {
      console.error('❌ ID de boutique manquant');
      return;
    }
    console.log('🔗 Navigation vers:', `/boutique/${boutique._id}/products/new`);
    history.push(`/boutique/${boutique._id}/products/new`);
  };

  const handleViewProduct = (productId) => {
    history.push(`/post/${productId}`);
  };

  const handleEditProduct = (productId) => {
    history.push(`/boutique/${boutique._id}/products/edit/${productId}`, {
      postData: products.find(p => p._id === productId),
      isEdit: true
    });
  };

  if (loadingProducts && products.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="products-list-tab">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Gestion des produits</h4>
          <small className="text-muted">
            Total: {total} produit{total > 1 ? 's' : ''}
          </small>
        </div>
        
        {/* 👇 BOTÓN VISIBLE PARA EL DUEÑO */}
        {isOwner && (
          <Button 
            variant="primary" 
            onClick={handleNewProduct}
            style={{
              backgroundColor: boutique?.couleur_theme || '#6366F1',
              borderColor: boutique?.couleur_theme || '#6366F1'
            }}
          >
            <FaPlus className="me-2" /> Nouveau produit
          </Button>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" className="w-100">
            Exporter
          </Button>
        </Col>
      </Row>

      {/* Tabla de productos */}
      <Table responsive hover className="align-middle">
        <thead className="bg-light">
          <tr>
            <th>Image</th>
            <th>Nom du produit</th>
            <th>Prix (DA)</th>
            <th>Catégorie</th>
            <th>Vues</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <tr key={product._id}>
                <td>
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0].url || product.images[0]} 
                      alt={product.title}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <div className="bg-light" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                  )}
                </td>
                <td>
                  <strong>{product.title}</strong>
                  <br />
                  <small className="text-muted">{product.description?.substring(0, 30)}...</small>
                </td>
                <td><strong>{product.price?.toLocaleString() || 0} DA</strong></td>
                <td>
                  <small>{product.subCategory || product.categorie}</small>
                </td>
                <td>{product.views || 0}</td>
                <td>{getStatusBadge(product.isActive)}</td>
                <td>
                  <small>{new Date(product.createdAt).toLocaleDateString()}</small>
                </td>
                <td>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-info p-0 me-2"
                    onClick={() => handleViewProduct(product._id)}
                    title="Voir"
                  >
                    <FaEye />
                  </Button>
                  
                  {/* 👇 Botones de edición SOLO para dueño */}
                  {isOwner && (
                    <>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-primary p-0 me-2"
                        onClick={() => handleEditProduct(product._id)}
                        title="Modifier"
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-danger p-0"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-5">
                {searchTerm ? (
                  <>
                    <p className="text-muted mb-2">Aucun produit trouvé pour "{searchTerm}"</p>
                    <Button variant="outline-secondary" size="sm" onClick={() => setSearchTerm('')}>
                      Effacer la recherche
                    </Button>
                  </>
                ) : (
                  <>
                    <FaPlus size={48} className="text-muted mb-3" />
                    <p className="text-muted mb-2">Aucun produit dans cette boutique</p>
                    {/* 👇 Botón SOLO para dueño cuando no hay productos */}
                    {isOwner && (
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={handleNewProduct}
                        style={{
                          backgroundColor: boutique?.couleur_theme || '#6366F1',
                          borderColor: boutique?.couleur_theme || '#6366F1'
                        }}
                      >
                        <FaPlus className="me-2" /> Ajouter votre premier produit
                      </Button>
                    )}
                  </>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {hasMore && (
        <div className="text-center mt-3">
          <Button 
            variant="outline-primary" 
            onClick={() => setPage(prev => prev + 1)}
            disabled={loadingProducts}
          >
            {loadingProducts ? (
              <>
                <Spinner size="sm" className="me-2" />
                Chargement...
              </>
            ) : (
              <>
                <FaSync className="me-2" />
                Charger plus de produits
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsListTab;