// components/boutique/tabs/AddProductTab.jsx
import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Image, Alert } from 'react-bootstrap';
import { FaSave, FaPlus, FaTrash, FaUpload } from 'react-icons/fa';

const AddProductTab = ({ boutique }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    subCategory: '',
    brand: '',
    condition: 'new',
    stock: '',
    sku: '',
    tags: '',
    status: 'draft'
  });

  const [images, setImages] = useState([]);
  const [variations, setVariations] = useState([]);
  const [shipping, setShipping] = useState({
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    shippingCost: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const addVariation = () => {
    setVariations([...variations, { type: '', value: '', price: '', stock: '' }]);
  };

  const updateVariation = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
  };

  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Guardando producto:', { ...formData, images, variations, shipping });
    // Aquí iría la lógica para guardar en el backend
  };

  return (
    <div className="add-product-tab">
      <h4 className="mb-4">Ajouter un nouveau produit</h4>

      <Form onSubmit={handleSubmit}>
        {/* Información básica */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">Informations de base</h5>
            
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du produit *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Catégorie *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option value="electronique">Électronique</option>
                    <option value="vetements">Vêtements</option>
                    <option value="maison">Maison</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Sous-catégorie</Form.Label>
                  <Form.Select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner...</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Marque</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>État *</Form.Label>
                  <Form.Select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  >
                    <option value="new">Neuf</option>
                    <option value="like-new">Comme neuf</option>
                    <option value="good">Bon état</option>
                    <option value="fair">État correct</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="séparés par des virgules"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Prix et stock */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">Prix et stock</h5>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix (DA) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Ancien prix (DA)</Form.Label>
                  <Form.Control
                    type="number"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Brouillon"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Publié"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Images */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">Images du produit</h5>
            
            <div className="image-upload-area mb-3">
              <Form.Group>
                <Form.Label className="btn btn-outline-primary">
                  <FaUpload className="me-2" /> Choisir des images
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </Form.Label>
              </Form.Group>
            </div>

            {images.length > 0 && (
              <Row className="g-3">
                {images.map((img, index) => (
                  <Col xs={6} md={3} key={index}>
                    <div className="position-relative">
                      <Image 
                        src={img.preview}
                        fluid
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-1"
                        onClick={() => removeImage(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>

        {/* Variations */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Variations</h5>
              <Button variant="outline-primary" size="sm" onClick={addVariation}>
                <FaPlus className="me-2" /> Ajouter une variation
              </Button>
            </div>

            {variations.length > 0 ? (
              variations.map((variation, index) => (
                <Card key={index} className="bg-light mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <h6>Variation {index + 1}</h6>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger p-0"
                        onClick={() => removeVariation(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    <Row>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Type</Form.Label>
                          <Form.Select
                            size="sm"
                            value={variation.type}
                            onChange={(e) => updateVariation(index, 'type', e.target.value)}
                          >
                            <option value="">Sélectionner...</option>
                            <option value="size">Taille</option>
                            <option value="color">Couleur</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Valeur</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={variation.value}
                            onChange={(e) => updateVariation(index, 'value', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Prix</Form.Label>
                          <Form.Control
                            size="sm"
                            type="number"
                            value={variation.price}
                            onChange={(e) => updateVariation(index, 'price', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Stock</Form.Label>
                          <Form.Control
                            size="sm"
                            type="number"
                            value={variation.stock}
                            onChange={(e) => updateVariation(index, 'stock', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p className="text-muted text-center py-3">
                Aucune variation. Cliquez sur "Ajouter une variation" pour commencer.
              </p>
            )}
          </Card.Body>
        </Card>

        {/* Boutons d'action */}
        <div className="text-end">
          <Button variant="secondary" className="me-2">
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            <FaSave className="me-2" /> Enregistrer le produit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddProductTab;