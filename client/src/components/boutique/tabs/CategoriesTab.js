 // components/boutique/tabs/CategoriesTab.jsx
import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, Table, Badge, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaFolder, FaFolderOpen, FaChevRight, FaChevDown } from 'react-icons/fa';

const CategoriesTab = ({ boutique }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentCategory: '',
    icon: '',
    image: '',
    order: 0,
    isActive: true
  });

  // Datos de ejemplo para categorías
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Électronique',
      slug: 'electronique',
      description: 'Produits électroniques',
      icon: '📱',
      image: null,
      order: 1,
      isActive: true,
      productCount: 15,
      subcategories: [
        {
          id: 11,
          name: 'Téléphones',
          slug: 'telephones',
          description: 'Smartphones et accessoires',
          icon: '📞',
          order: 1,
          isActive: true,
          productCount: 8,
          subcategories: [
            {
              id: 111,
              name: 'iPhone',
              slug: 'iphone',
              description: 'Apple iPhone',
              icon: '📱',
              order: 1,
              isActive: true,
              productCount: 3
            },
            {
              id: 112,
              name: 'Samsung',
              slug: 'samsung',
              description: 'Samsung Galaxy',
              icon: '📱',
              order: 2,
              isActive: true,
              productCount: 5
            }
          ]
        },
        {
          id: 12,
          name: 'Ordinateurs',
          slug: 'ordinateurs',
          description: 'PC et laptops',
          icon: '💻',
          order: 2,
          isActive: true,
          productCount: 7
        }
      ]
    },
    {
      id: 2,
      name: 'Vêtements',
      slug: 'vetements',
      description: 'Mode et accessoires',
      icon: '👕',
      order: 2,
      isActive: true,
      productCount: 23,
      subcategories: [
        {
          id: 21,
          name: 'Hommes',
          slug: 'hommes',
          description: 'Mode homme',
          icon: '👔',
          order: 1,
          isActive: true,
          productCount: 12
        },
        {
          id: 22,
          name: 'Femmes',
          slug: 'femmes',
          description: 'Mode femme',
          icon: '👗',
          order: 2,
          isActive: true,
          productCount: 11
        }
      ]
    }
  ]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentCategory: category.parentId || '',
      icon: category.icon || '',
      image: category.image || '',
      order: category.order || 0,
      isActive: category.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      // Aquí iría la lógica para eliminar
      console.log('Eliminar categoría:', categoryId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Guardando categoría:', formData);
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentCategory: '',
      icon: '',
      image: '',
      order: 0,
      isActive: true
    });
  };

  // Función recursiva para renderizar categorías
  const renderCategoryRow = (category, level = 0) => (
    <React.Fragment key={category.id}>
      <tr>
        <td>
          <div style={{ marginLeft: `${level * 30}px` }} className="d-flex align-items-center">
            {category.subcategories && category.subcategories.length > 0 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 me-2"
                onClick={() => toggleCategory(category.id)}
              >
                {expandedCategories.includes(category.id) ? 'djamel' : 'djamel2'}
              </Button>
            )}
            {category.subcategories && category.subcategories.length > 0 ? (
              <FaFolderOpen className="me-2 text-warning" />
            ) : (
              <FaFolder className="me-2 text-info" />
            )}
            <span>{category.icon && `${category.icon} `}{category.name}</span>
          </div>
        </td>
        <td>{category.slug}</td>
        <td className="text-center">{category.productCount}</td>
        <td className="text-center">
          <Badge bg={category.isActive ? 'success' : 'secondary'}>
            {category.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </td>
        <td className="text-center">{category.order}</td>
        <td className="text-center">
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary p-0 me-2"
            onClick={() => handleEdit(category)}
          >
            <FaEdit />
          </Button>
          <Button 
            variant="link" 
            size="sm" 
            className="text-danger p-0"
            onClick={() => handleDelete(category.id)}
          >
            <FaTrash />
          </Button>
        </td>
      </tr>
      {category.subcategories && expandedCategories.includes(category.id) && 
        category.subcategories.map(sub => renderCategoryRow(sub, level + 1))
      }
    </React.Fragment>
  );

  // Obtener todas las categorías para el selector de padre
  const getAllCategoriesForSelect = (cats, level = 0) => {
    let options = [];
    cats.forEach(cat => {
      options.push({
        id: cat.id,
        name: '— '.repeat(level) + cat.name
      });
      if (cat.subcategories) {
        options = [...options, ...getAllCategoriesForSelect(cat.subcategories, level + 1)];
      }
    });
    return options;
  };

  return (
    <div className="categories-tab">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestion des catégories</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Nouvelle catégorie
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <h6>Total catégories</h6>
              <h3>{categories.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body>
              <h6>Catégories actives</h6>
              <h3>{categories.filter(c => c.isActive).length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body>
              <h6>Sous-catégories</h6>
              <h3>5</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body>
              <h6>Produits catégorisés</h6>
              <h3>38</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de categorías */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="bg-light">
              <tr>
                <th>Nom</th>
                <th>Slug</th>
                <th className="text-center">Produits</th>
                <th className="text-center">Statut</th>
                <th className="text-center">Ordre</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => renderCategoryRow(category))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para crear/editar categoría */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Catégorie parente</Form.Label>
                  <Form.Select
                    value={formData.parentCategory}
                    onChange={(e) => setFormData({...formData, parentCategory: e.target.value})}
                  >
                    <option value="">Aucune (catégorie racine)</option>
                    {getAllCategoriesForSelect(categories).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Icône</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="📱"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Ordre d'affichage</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Catégorie active"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {editingCategory ? 'Modifier' : 'Créer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesTab;