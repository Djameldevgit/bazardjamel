// 📂 specificFields/EmploiFields.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const EmploiFields = ({ postData, handleChangeInput, subCategory, articleType }) => {
  
  const renderOffreEmploiFields = () => (
    <>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Poste proposé</Form.Label>
            <Form.Control
              type="text"
              name="poste"
              value={postData.poste || ''}
              onChange={handleChangeInput}
              placeholder="Ex: Développeur web, Commercial, Comptable..."
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Type de contrat</Form.Label>
            <Form.Select
              name="type_contrat"
              value={postData.type_contrat || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="cdi">CDI</option>
              <option value="cdd">CDD</option>
              <option value="interim">Intérim</option>
              <option value="stage">Stage</option>
              <option value="alternance">Alternance</option>
              <option value="freelance">Freelance/Indépendant</option>
              <option value="temps_partiel">Temps partiel</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Secteur d'activité</Form.Label>
            <Form.Select
              name="secteur_activite"
              value={postData.secteur_activite || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="informatique">Informatique / IT</option>
              <option value="commerce">Commerce / Vente</option>
              <option value="industrie">Industrie</option>
              <option value="batiment">Bâtiment / Construction</option>
              <option value="sante">Santé / Social</option>
              <option value="education">Éducation / Formation</option>
              <option value="tourisme">Tourisme / Hôtellerie</option>
              <option value="finance">Finance / Comptabilité</option>
              <option value="marketing">Marketing / Communication</option>
              <option value="logistique">Logistique / Transport</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Expérience requise</Form.Label>
            <Form.Control
              type="text"
              name="experience_requise"
              value={postData.experience_requise || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 2 ans minimum, Débutant accepté..."
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Niveau d'études</Form.Label>
        <Form.Select
          name="niveau_etudes"
          value={postData.niveau_etudes || ''}
          onChange={handleChangeInput}
        >
          <option value="">Sélectionner</option>
          <option value="bac">Bac</option>
          <option value="bac_2">Bac+2 (BTS, DUT)</option>
          <option value="bac_3">Bac+3 (Licence)</option>
          <option value="bac_5">Bac+5 (Master, Ingénieur)</option>
          <option value="doctorat">Doctorat</option>
          <option value="aucun">Aucun diplôme requis</option>
        </Form.Select>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Compétences requises</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="competences"
          value={postData.competences || ''}
          onChange={handleChangeInput}
          placeholder="Listez les compétences techniques et soft skills nécessaires..."
        />
      </Form.Group>
    </>
  );
  
  const renderDemandeEmploiFields = () => (
    <>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nom du candidat</Form.Label>
            <Form.Control
              type="text"
              name="nom_candidat"
              value={postData.nom_candidat || ''}
              onChange={handleChangeInput}
              placeholder="Nom et prénom"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Poste recherché</Form.Label>
            <Form.Control
              type="text"
              name="poste"
              value={postData.poste || ''}
              onChange={handleChangeInput}
              placeholder="Ex: Développeur web, Commercial..."
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Secteur d'activité</Form.Label>
            <Form.Select
              name="secteur_activite"
              value={postData.secteur_activite || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="informatique">Informatique / IT</option>
              <option value="commerce">Commerce / Vente</option>
              <option value="industrie">Industrie</option>
              <option value="batiment">Bâtiment / Construction</option>
              <option value="sante">Santé / Social</option>
              <option value="education">Éducation / Formation</option>
              <option value="tourisme">Tourisme / Hôtellerie</option>
              <option value="finance">Finance / Comptabilité</option>
              <option value="marketing">Marketing / Communication</option>
              <option value="logistique">Logistique / Transport</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Expérience</Form.Label>
            <Form.Control
              type="text"
              name="experience_requise"
              value={postData.experience_requise || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 3 ans en développement web..."
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Disponibilité</Form.Label>
            <Form.Select
              name="disponibilite"
              value={postData.disponibilite || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="immediate">Immédiate</option>
              <option value="15_jours">15 jours</option>
              <option value="1_mois">1 mois</option>
              <option value="3_mois">3 mois</option>
              <option value="a_discuter">À discuter</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Mobilité géographique</Form.Label>
            <Form.Select
              name="mobilite"
              value={postData.mobilite || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="local">Local uniquement</option>
              <option value="regional">Régional</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Prétentions salariales</Form.Label>
        <Form.Control
          type="text"
          name="pretentions_salariales"
          value={postData.pretentions_salariales || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 60.000 DA/mois, Négociable..."
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Compétences</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="competences"
          value={postData.competences || ''}
          onChange={handleChangeInput}
          placeholder="Décrivez vos compétences, formations, langues..."
        />
      </Form.Group>
    </>
  );
  
  const renderSalaireAvantagesFields = () => (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Salaire</Form.Label>
          <Form.Control
            type="text"
            name="salaire"
            value={postData.salaire || ''}
            onChange={handleChangeInput}
            placeholder="Ex: 80.000 DA, Négociable..."
          />
        </Form.Group>
      </Col>
      
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Unité</Form.Label>
          <Form.Select
            name="unite_salaire"
            value={postData.unite_salaire || ''}
            onChange={handleChangeInput}
          >
            <option value="">Sélectionner</option>
            <option value="mois">Par mois</option>
            <option value="heure">À l'heure</option>
            <option value="jour">Par jour</option>
            <option value="mission">Par mission</option>
            <option value="negociable">Négociable</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
  
  const renderSpecificFields = () => {
    if (subCategory === 'offres_emploi') {
      return renderOffreEmploiFields();
    } else if (subCategory === 'demandes_emploi') {
      return renderDemandeEmploiFields();
    } else {
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Type d'annonce</Form.Label>
            <Form.Select
              name="type_annonce"
              value={postData.type_annonce || ''}
              onChange={handleChangeInput}
            >
              <option value="">Sélectionner</option>
              <option value="offre">Offre d'emploi</option>
              <option value="demande">Demande d'emploi</option>
              <option value="service">Service emploi</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description détaillée</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={postData.description || ''}
              onChange={handleChangeInput}
              placeholder="Décrivez en détail l'offre ou la demande..."
            />
          </Form.Group>
        </>
      );
    }
  };
  
  return (
    <div className="emploi-fields">
      <h6 className="mb-3">💼 Informations emploi</h6>
      {renderSpecificFields()}
      
      {/* Campos comunes para step 3 */}
      {subCategory === 'offres_emploi' && (
        <>
          <hr />
          <h6 className="mb-3">💰 Conditions de travail</h6>
          {renderSalaireAvantagesFields()}
          
          <Form.Group className="mb-3">
            <Form.Label>Avantages</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="avantages"
              value={postData.avantages || ''}
              onChange={handleChangeInput}
              placeholder="Mutuelle, tickets resto, formation, véhicule..."
            />
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lieu de travail</Form.Label>
                <Form.Control
                  type="text"
                  name="lieu_travail"
                  value={postData.lieu_travail || ''}
                  onChange={handleChangeInput}
                  placeholder="Ex: Alger centre, Télétravail..."
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Horaires</Form.Label>
                <Form.Control
                  type="text"
                  name="horaires"
                  value={postData.horaires || ''}
                  onChange={handleChangeInput}
                  placeholder="Ex: 8h-17h, Flexible..."
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default EmploiFields;