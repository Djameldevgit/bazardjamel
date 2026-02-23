// components/boutique/tabs/ProductsListTab.jsx
import React, { useState } from 'react';
import { Table, Button, Badge, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaFilter } from 'react-icons/fa';

const ProductsListTab = ({ boutique }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Datos de ejemplo (reemplazar con datos reales)
  const products = [
    { id: 1, name: 'Produit 1', price: 1500, status: 'active', stock: 10, views: 45 },
    { id: 2, name: 'Produit 2', price: 2500, status: 'active', stock: 5, views: 23 },
    { id: 3, name: 'Produit 3', price: 800, status: 'inactive', stock: 0, views: 12 },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge bg="success">Actif</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactif</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || product.status === filterStatus)
  );

  return (
    <div className="products-list-tab">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestion des produits</h4>
        <Button variant="primary">
          <FaPlus className="me-2" /> Nouveau produit
        </Button>
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
            <th>ID</th>
            <th>Nom du produit</th>
            <th>Prix (DA)</th>
            <th>Stock</th>
            <th>Vues</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <tr key={product.id}>
                <td>#{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString()} DA</td>
                <td>
                  <Badge bg={product.stock > 0 ? 'info' : 'warning'}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                  </Badge>
                </td>
                <td>{product.views}</td>
                <td>{getStatusBadge(product.status)}</td>
                <td>
                  <Button variant="link" size="sm" className="text-info p-0 me-2">
                    <FaEye />
                  </Button>
                  <Button variant="link" size="sm" className="text-primary p-0 me-2">
                    <FaEdit />
                  </Button>
                  <Button variant="link" size="sm" className="text-danger p-0">
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                Aucun produit trouvé
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Resumen */}
      <div className="bg-light p-3 rounded mt-3">
        <Row>
          <Col md={4}>
            <small className="text-muted d-block">Total produits</small>
            <strong>{products.length}</strong>
          </Col>
          <Col md={4}>
            <small className="text-muted d-block">Produits actifs</small>
            <strong>{products.filter(p => p.status === 'active').length}</strong>
          </Col>
          <Col md={4}>
            <small className="text-muted d-block">Stock total</small>
            <strong>{products.reduce((acc, p) => acc + p.stock, 0)}</strong>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductsListTab;