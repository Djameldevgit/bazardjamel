// components/boutique/tabs/InfoTab.jsx
import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Image } from 'react-bootstrap';
import { FaSave, FaEdit, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';

const InfoTab = ({ boutique }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom_boutique: boutique.nom_boutique || '',
    slogan_boutique: boutique.slogan_boutique || '',
    description_boutique: boutique.description_boutique || '',
    categorie: boutique.categorie || '',
    proprietaire: {
      nom: boutique.proprietaire?.nom || '',
      email: boutique.proprietaire?.email || '',
      telephone: boutique.proprietaire?.telephone || '',
      wilaya: boutique.proprietaire?.wilaya || '',
      adresse: boutique.proprietaire?.adresse || ''
    },
    couleur_theme: boutique.couleur_theme || '#2563eb'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('proprietaire.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        proprietaire: {
          ...formData.proprietaire,
          [field]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', formData);
    setEditing(false);
  };

  return (
    <div className="info-tab">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Informations de la boutique</h4>
        {!editing ? (
          <Button variant="outline-primary" onClick={() => setEditing(true)}>
            <FaEdit className="me-2" /> Modifier
          </Button>
        ) : (
          <Button variant="outline-secondary" onClick={() => setEditing(false)}>
            Annuler
          </Button>
        )}
      </div>

      {!editing ? (
        // Vista de solo lectura
        <div className="boutique-info-view">
          <Row className="mb-4">
            <Col md={8}>
              <h5 className="border-bottom pb-2 mb-3">Général</h5>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td style={{ width: '200px' }}><strong>Nom:</strong></td>
                    <td>{boutique.nom_boutique}</td>
                  </tr>
                  <tr>
                    <td><strong>Slogan:</strong></td>
                    <td>{boutique.slogan_boutique || '—'}</td>
                  </tr>
                  <tr>
                    <td><strong>Catégorie:</strong></td>
                    <td>{boutique.categorie}</td>
                  </tr>
                  <tr>
                    <td><strong>Description:</strong></td>
                    <td>{boutique.description_boutique}</td>
                  </tr>
                  <tr>
                    <td><strong>Couleur thème:</strong></td>
                    <td>
                      <span 
                        style={{ 
                          display: 'inline-block', 
                          width: '20px', 
                          height: '20px', 
                          backgroundColor: boutique.couleur_theme,
                          borderRadius: '4px',
                          marginRight: '8px',
                          verticalAlign: 'middle'
                        }}
                      ></span>
                      {boutique.couleur_theme}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col md={4}>
              <h5 className="border-bottom pb-2 mb-3">Statut</h5>
              <div className="bg-light p-3 rounded">
                <p className="mb-2">
                  <strong>Plan:</strong> {boutique.plan}
                </p>
                <p className="mb-2">
                  <strong>Vérifié:</strong> {boutique.isVerified ? 'Oui' : 'Non'}
                </p>
                <p className="mb-2">
                  <strong>Membre depuis:</strong> {new Date(boutique.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Col>
          </Row>

          <h5 className="border-bottom pb-2 mb-3">Propriétaire</h5>
          <Row>
            <Col md={6}>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td style={{ width: '150px' }}><FaUser className="me-2 text-primary" /> Nom:</td>
                    <td>{boutique.proprietaire?.nom || '—'}</td>
                  </tr>
                  <tr>
                    <td><FaEnvelope className="me-2 text-danger" /> Email:</td>
                    <td>{boutique.proprietaire?.email || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col md={6}>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td style={{ width: '150px' }}><FaPhone className="me-2 text-primary" /> Téléphone:</td>
                    <td>{boutique.proprietaire?.telephone || '—'}</td>
                  </tr>
                  <tr>
                    <td><FaMapMarkerAlt className="me-2 text-danger" /> Wilaya:</td>
                    <td>{boutique.proprietaire?.wilaya || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          {boutique.proprietaire?.adresse && (
            <p><strong>Adresse complète:</strong> {boutique.proprietaire.adresse}</p>
          )}
        </div>
      ) : (
        // Vista de edición
        <Form onSubmit={handleSubmit}>
          <h5 className="border-bottom pb-2 mb-3">Général</h5>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom de la boutique *</Form.Label>
                <Form.Control
                  type="text"
                  name="nom_boutique"
                  value={formData.nom_boutique}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Slogan</Form.Label>
                <Form.Control
                  type="text"
                  name="slogan_boutique"
                  value={formData.slogan_boutique}
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
              name="description_boutique"
              value={formData.description_boutique}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Catégorie</Form.Label>
                <Form.Control
                  type="text"
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  disabled
                />
                <Form.Text className="text-muted">
                  La catégorie ne peut pas être modifiée
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Couleur du thème</Form.Label>
                <Form.Control
                  type="color"
                  name="couleur_theme"
                  value={formData.couleur_theme}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="border-bottom pb-2 mb-3 mt-4">Propriétaire</h5>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom du propriétaire</Form.Label>
                <Form.Control
                  type="text"
                  name="proprietaire.nom"
                  value={formData.proprietaire.nom}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="proprietaire.email"
                  value={formData.proprietaire.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="tel"
                  name="proprietaire.telephone"
                  value={formData.proprietaire.telephone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Wilaya</Form.Label>
                <Form.Control
                  type="text"
                  name="proprietaire.wilaya"
                  value={formData.proprietaire.wilaya}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Adresse complète</Form.Label>
            <Form.Control
              type="text"
              name="proprietaire.adresse"
              value={formData.proprietaire.adresse}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="primary" type="submit">
              <FaSave className="me-2" /> Enregistrer les modifications
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default InfoTab;