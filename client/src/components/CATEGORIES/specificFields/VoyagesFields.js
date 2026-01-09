// 📂 specificFields/VoyagesFields.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const VoyagesFields = ({ postData, handleChangeInput, subCategory, articleType }) => {
  
  const renderDatesFields = () => (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Date de départ</Form.Label>
          <Form.Control
            type="date"
            name="date_depart"
            value={postData.date_depart || ''}
            onChange={handleChangeInput}
          />
        </Form.Group>
      </Col>
      
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Date de retour</Form.Label>
          <Form.Control
            type="date"
            name="date_retour"
            value={postData.date_retour || ''}
            onChange={handleChangeInput}
          />
        </Form.Group>
      </Col>
    </Row>
  );
  
  const renderDestinationDureeFields = () => (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Destination</Form.Label>
          <Form.Control
            type="text"
            name="destination"
            value={postData.destination || ''}
            onChange={handleChangeInput}
            placeholder="Ex: Paris, Istanbul, Dubaï..."
          />
        </Form.Group>
      </Col>
      
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Durée</Form.Label>
          <Form.Control
            type="text"
            name="duree"
            value={postData.duree || ''}
            onChange={handleChangeInput}
            placeholder="Ex: 7 jours, 2 semaines..."
          />
        </Form.Group>
      </Col>
    </Row>
  );
  
  const renderVoyageOrganiseFields = () => (
    <>
      {renderDestinationDureeFields()}
      {renderDatesFields()}
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de personnes</Form.Label>
            <Form.Control
              type="number"
              name="nombre_personnes"
              value={postData.nombre_personnes || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 1, 2, 4..."
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Transport</Form.Label>
            <Form.Select
              name="transport"
              value={postData.transport || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="avion">Avion</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="voiture">Voiture</option>
              <option value="mixte">Mixte</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Type d'hébergement</Form.Label>
        <Form.Control
          type="text"
          name="hebergement"
          value={postData.hebergement || ''}
          onChange={handleChangeInput}
          placeholder="Ex: Hôtel 4*, Riad, Appartement..."
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Activités incluses</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="activites_incluses"
          value={postData.activites_incluses || ''}
          onChange={handleChangeInput}
          placeholder="Visites guidées, excursions, repas..."
        />
      </Form.Group>
    </>
  );
  
  const renderLocationVacancesFields = () => (
    <>
      {renderDestinationDureeFields()}
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Type d'hébergement</Form.Label>
            <Form.Select
              name="type_hebergement"
              value={postData.type_hebergement || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="appartement">Appartement</option>
              <option value="villa">Villa</option>
              <option value="maison">Maison</option>
              <option value="studio">Studio</option>
              <option value="riad">Riad</option>
              <option value="chalet">Chalet</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Capacité (personnes)</Form.Label>
            <Form.Control
              type="number"
              name="capacite"
              value={postData.capacite || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 2, 4, 6..."
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Équipements</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="equipements"
          value={postData.equipements || ''}
          onChange={handleChangeInput}
          placeholder="WiFi, piscine, climatisation, parking..."
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Proximité</Form.Label>
        <Form.Control
          type="text"
          name="proximite"
          value={postData.proximite || ''}
          onChange={handleChangeInput}
          placeholder="Ex: Centre ville 5min, Plage 200m..."
        />
      </Form.Group>
    </>
  );
  
  const renderHajjOmraFields = () => (
    <>
      {renderDatesFields()}
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Type de pèlerinage</Form.Label>
            <Form.Select
              name="type_pelerinage"
              value={postData.type_pelerinage || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="hajj">Hajj</option>
              <option value="omra">Omra</option>
              <option value="hajj_omra">Hajj + Omra</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Groupe</Form.Label>
            <Form.Select
              name="groupe"
              value={postData.groupe || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="individuel">Individuel</option>
              <option value="famille">Famille</option>
              <option value="groupe_organise">Groupe organisé</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Hôtel à Makkah</Form.Label>
            <Form.Control
              type="text"
              name="hotel_makkah"
              value={postData.hotel_makkah || ''}
              onChange={handleChangeInput}
              placeholder="Nom et catégorie"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Hôtel à Madinah</Form.Label>
            <Form.Control
              type="text"
              name="hotel_madinah"
              value={postData.hotel_madinah || ''}
              onChange={handleChangeInput}
              placeholder="Nom et catégorie"
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Vols inclus</Form.Label>
        <Form.Select
          name="vols"
          value={postData.vols || ''}
          onChange={handleChangeInput}
        >
          <option value="">Sélectionner</option>
          <option value="aller_retour">Aller-retour inclus</option>
          <option value="non_inclus">Vols non inclus</option>
          <option value="optionnel">Optionnel</option>
        </Form.Select>
      </Form.Group>
    </>
  );
  
  const renderSpecificFields = () => {
    switch(subCategory) {
      case 'voyage_organise':
        return renderVoyageOrganiseFields();
        
      case 'location_vacances':
        return renderLocationVacancesFields();
        
      case 'hajj_omra':
        return renderHajjOmraFields();
        
      case 'sejour':
        return (
          <>
            {renderDestinationDureeFields()}
            {renderDatesFields()}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type de séjour</Form.Label>
                  <Form.Select
                    name="type_sejour"
                    value={postData.type_sejour || ''}
                    onChange={handleChangeInput}
                  >
                    <option value="">Sélectionner</option>
                    <option value="detente">Détente</option>
                    <option value="decouverte">Découverte</option>
                    <option value="aventure">Aventure</option>
                    <option value="culturel">Culturel</option>
                    <option value="balneaire">Balnéaire</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Catégorie d'hôtel</Form.Label>
                  <Form.Select
                    name="categorie_hotel"
                    value={postData.categorie_hotel || ''}
                    onChange={handleChangeInput}
                  >
                    <option value="">Sélectionner</option>
                    <option value="2_etoiles">2 étoiles</option>
                    <option value="3_etoiles">3 étoiles</option>
                    <option value="4_etoiles">4 étoiles</option>
                    <option value="5_etoiles">5 étoiles</option>
                    <option value="luxe">Luxe</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </>
        );
        
      case 'croisiere':
        return (
          <>
            {renderDestinationDureeFields()}
            {renderDatesFields()}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du bateau</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom_bateau"
                    value={postData.nom_bateau || ''}
                    onChange={handleChangeInput}
                    placeholder="Nom de la croisière"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type de cabine</Form.Label>
                  <Form.Select
                    name="cabine"
                    value={postData.cabine || ''}
                    onChange={handleChangeInput}
                  >
                    <option value="">Sélectionner</option>
                    <option value="interieur">Intérieure</option>
                    <option value="exterieur">Extérieure</option>
                    <option value="balcon">Avec balcon</option>
                    <option value="suite">Suite</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </>
        );
        
      default:
        return (
          <>
            {renderDestinationDureeFields()}
            {renderDatesFields()}
            
            <Form.Group className="mb-3">
              <Form.Label>Type de voyage</Form.Label>
              <Form.Select
                name="type_voyage"
                value={postData.type_voyage || ''}
                onChange={handleChangeInput}
              >
                <option value="">Sélectionner</option>
                <option value="affaires">Voyage d'affaires</option>
                <option value="touristique">Touristique</option>
                <option value="familial">Familial</option>
                <option value="romantique">Romantique</option>
                <option value="gastronomique">Gastronomique</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Compagnie/Agence</Form.Label>
              <Form.Control
                type="text"
                name="compagnie"
                value={postData.compagnie || ''}
                onChange={handleChangeInput}
                placeholder="Nom de la compagnie ou agence"
              />
            </Form.Group>
          </>
        );
    }
  };
  
  return (
    <div className="voyages-fields">
      <h6 className="mb-3">✈️ Détails du voyage</h6>
      {renderSpecificFields()}
    </div>
  );
};

export default VoyagesFields;