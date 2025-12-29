import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';
 
 
 
const VehiculesFields = ({ fieldName, postData, handleChangeInput, subCategory, isRTL }) => {
  const { t } = useTranslation();
  
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'automobiles': {
        'marque': 'marque',
        'modele': 'modele',
        'annee': 'annee',
        'kilometrage': 'kilometrage',
        'carburant': 'carburant',
        'boiteVitesse': 'boiteVitesse',
        'puissance': 'puissance'
      },
      'motos': {
        'typeMoto': 'typeMoto',
        'marque': 'marque',
        'modele': 'modele',
        'cylindree': 'cylindree',
        'annee': 'annee',
        'kilometrage': 'kilometrage'
      },
      'utilitaires': {
        'marque': 'marque',
        'modele': 'modele',
        'typeUtilitaire': 'typeUtilitaire',
        'annee': 'annee',
        'kilometrage': 'kilometrage',
        'chargeUtile': 'chargeUtile'
      },
      'fourgons': {
        'typeFourgon': 'typeFourgon',
        'marque': 'marque',
        'modele': 'modele',
        'annee': 'annee',
        'kilometrage': 'kilometrage',
        'volume': 'volume',
        'chargeUtile': 'chargeUtile'
      },
      'camions': {
        'typeCamion': 'typeCamion',
        'marque': 'marque',
        'modele': 'modele',
        'annee': 'annee',
        'kilometrage': 'kilometrage',
        'chargeUtile': 'chargeUtile',
        'ptac': 'ptac'
      },
      'bus': {
        'typeBus': 'typeBus',
        'marque': 'marque',
        'modele': 'modele',
        'annee': 'annee',
        'kilometrage': 'kilometrage',
        'nombrePlaces': 'nombrePlaces'
      },
      'engins': {
        'typeEngin': 'typeEngin',
        'marque': 'marque',
        'modele': 'modele',
        'annee': 'annee',
        'etatEngin': 'etatEngin',
        'puissance': 'puissance'
      },
      'tracteurs': {
        'typeTracteur': 'typeTracteur',
        'marque': 'marque',
        'modele': 'modele',
        'annee': 'annee',
        'kilometrage': 'kilometrage',
        'puissance': 'puissance'
      },
      'remorques': {
        'typeRemorque': 'typeRemorque',
        'marque': 'marque',
        'modele': 'modele',
        'annee': 'annee',
        'chargeUtile': 'chargeUtile',
        'dimensions': 'dimensions'
      },
      'quads': {
        'typeQuad': 'typeQuad',
        'marque': 'marque',
        'modele': 'modele',
        'cylindree': 'cylindree',
        'annee': 'annee',
        'kilometrage': 'kilometrage'
      },
      'bateaux': {
        'typeBateau': 'typeBateau',
        'marque': 'marque',
        'modele': 'modele',
        'annee': 'annee',
        'longueur': 'longueur',
        'moteur': 'moteur',
        'puissance': 'puissance'
      },
      'pieces_vehicules': {
        'typePiece': 'typePiece',
        'marqueCompatible': 'marqueCompatible',
        'modeleCompatible': 'modeleCompatible',
        'etatPiece': 'etatPiece'
      }
    };
    
    return specificFields[subCategory] || {};
  };
  
  const fields = {
    'marque': (
      <MarqueField
        key="marque"
        selectedCategory="automobiles" // Categoría fija
        selectedSubCategory={subCategory} // ✅ ¡IMPORTANTE! Pasamos la subcategoría
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
        name="marque" // Nombre único en la base de datos
        label="brand"
      />
    ),
    'modele': (
      <ModeleField
        key="modele"
        selectedCategory="automobiles" // Categoría fija
        selectedSubCategory={subCategory} // ✅ ¡IMPORTANTE! Pasamos la subcategoría
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
        name="modele" // Nombre único en la base de datos
        label="brand"
      />
    ),
    
  
    'annee': (
      <Form.Group key="annee">
        <Form.Label>📅 {t('year', 'Année')}</Form.Label>
        <Form.Select
          name="annee"
          value={postData.annee || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_year', 'Sélectionnez l\'année')}</option>
          {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </Form.Group>
    ),
    
    'kilometrage': (
      <Form.Group key="kilometrage">
        <Form.Label>🛣️ {t('mileage', 'Kilométrage')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="kilometrage"
              value={postData.kilometrage || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 75000"
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="kilometrageUnite"
              value={postData.kilometrageUnite || 'km'}
              onChange={handleChangeInput}
            >
              <option value="km">km</option>
              <option value="miles">Miles</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'carburant': (
      <Form.Group key="carburant">
        <Form.Label>⛽ {t('fuel', 'Carburant')}</Form.Label>
        <Form.Select
          name="carburant"
          value={postData.carburant || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_fuel', 'Sélectionnez')}</option>
          <option value="essence">Essence</option>
          <option value="diesel">Diesel</option>
          <option value="electrique">Électrique</option>
          <option value="hybride">Hybride</option>
          <option value="gpl">GPL</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'boiteVitesse': (
      <Form.Group key="boiteVitesse">
        <Form.Label>⚙️ {t('gearbox', 'Boîte de vitesse')}</Form.Label>
        <Form.Select
          name="boiteVitesse"
          value={postData.boiteVitesse || ''}
          onChange={handleChangeInput}
        >
          <option value="">{t('select_gearbox', 'Sélectionnez')}</option>
          <option value="manuelle">Manuelle</option>
          <option value="automatique">Automatique</option>
          <option value="semi-auto">Semi-automatique</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'puissance': (
      <Form.Group key="puissance">
        <Form.Label>🐎 {t('power', 'Puissance')} (CV)</Form.Label>
        <Form.Control
          type="number"
          name="puissance"
          value={postData.puissance || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 90"
          min="0"
        />
      </Form.Group>
    ),
    
    'typeMoto': (
      <Form.Group key="typeMoto">
        <Form.Label>🏍️ {t('motorbike_type', 'Type de moto')}</Form.Label>
        <Form.Select
          name="typeMoto"
          value={postData.typeMoto || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_moto_type', 'Sélectionnez')}</option>
          <option value="sportive">Sportive</option>
          <option value="roadster">Roadster</option>
          <option value="custom">Custom</option>
          <option value="trail">Trail/Enduro</option>
          <option value="scooter">Scooter</option>
          <option value="quad">Quad</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'cylindree': (
      <Form.Group key="cylindree">
        <Form.Label>🔧 {t('displacement', 'Cylindrée')} (cc)</Form.Label>
        <Form.Control
          type="number"
          name="cylindree"
          value={postData.cylindree || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 600"
          min="0"
        />
      </Form.Group>
    ),
    
    'typeUtilitaire': (
      <Form.Group key="typeUtilitaire">
        <Form.Label>🚐 {t('utility_type', 'Type d\'utilitaire')}</Form.Label>
        <Form.Select
          name="typeUtilitaire"
          value={postData.typeUtilitaire || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_utility_type', 'Sélectionnez')}</option>
          <option value="fourgon">Fourgon</option>
          <option value="camionnette">Camionnette</option>
          <option value="camion">Camion</option>
          <option value="remorque">Remorque</option>
          <option value="bus">Bus/Minibus</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'chargeUtile': (
      <Form.Group key="chargeUtile">
        <Form.Label>⚖️ {t('payload', 'Charge utile')} (kg)</Form.Label>
        <Form.Control
          type="number"
          name="chargeUtile"
          value={postData.chargeUtile || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 1500"
          min="0"
        />
      </Form.Group>
    ),
    
    'typeFourgon': (
      <Form.Group key="typeFourgon">
        <Form.Label>🚚 {t('van_type', 'Type de fourgon')}</Form.Label>
        <Form.Select
          name="typeFourgon"
          value={postData.typeFourgon || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_van_type', 'Sélectionnez')}</option>
          <option value="utilitaire">Utilitaire</option>
          <option value="amenage">Fourgon aménagé</option>
          <option value="frigorifique">Fourgon frigorifique</option>
          <option value="benne">Fourgon benne</option>
          <option value="plateau">Fourgon plateau</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'volume': (
      <Form.Group key="volume">
        <Form.Label>📦 {t('volume', 'Volume')} (m³)</Form.Label>
        <Form.Control
          type="number"
          name="volume"
          value={postData.volume || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 12"
          min="0"
          step="0.1"
        />
      </Form.Group>
    ),
    
    'typeCamion': (
      <Form.Group key="typeCamion">
        <Form.Label>🚛 {t('truck_type', 'Type de camion')}</Form.Label>
        <Form.Select
          name="typeCamion"
          value={postData.typeCamion || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_truck_type', 'Sélectionnez')}</option>
          <option value="porteur">Camion porteur</option>
          <option value="tracteur">Tracteur routier</option>
          <option value="benne">Camion benne</option>
          <option value="citerne">Camion citerne</option>
          <option value="frigorifique">Camion frigorifique</option>
          <option value="poids_lourd">Poids lourd</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'ptac': (
      <Form.Group key="ptac">
        <Form.Label>⚖️ {t('ptac', 'PTAC')} (kg)</Form.Label>
        <Form.Control
          type="number"
          name="ptac"
          value={postData.ptac || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 3500"
          min="0"
        />
      </Form.Group>
    ),
    
    'typeBus': (
      <Form.Group key="typeBus">
        <Form.Label>🚌 {t('bus_type', 'Type de bus')}</Form.Label>
        <Form.Select
          name="typeBus"
          value={postData.typeBus || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_bus_type', 'Sélectionnez')}</option>
          <option value="urbain">Bus urbain</option>
          <option value="interurbain">Bus interurbain</option>
          <option value="autocar">Autocar</option>
          <option value="minibus">Minibus</option>
          <option value="scolaire">Bus scolaire</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'nombrePlaces': (
      <Form.Group key="nombrePlaces">
        <Form.Label>👥 {t('seats', 'Nombre de places')}</Form.Label>
        <Form.Control
          type="number"
          name="nombrePlaces"
          value={postData.nombrePlaces || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 50"
          min="1"
        />
      </Form.Group>
    ),
    
    'typeEngin': (
      <Form.Group key="typeEngin">
        <Form.Label>⚙️ {t('machine_type', 'Type d\'engin')}</Form.Label>
        <Form.Select
          name="typeEngin"
          value={postData.typeEngin || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_machine_type', 'Sélectionnez')}</option>
          <option value="tracteur">Tracteur</option>
          <option value="pelle">Pelle mécanique</option>
          <option value="niveleuse">Niveleuse</option>
          <option value="compacteur">Compacteur</option>
          <option value="grue">Grue</option>
          <option value="generateur">Générateur</option>
          <option value="compresseur">Compresseur</option>
          <option value="betonniere">Bétonnière</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'etatEngin': (
      <Form.Group key="etatEngin">
        <Form.Label>🛠️ {t('machine_condition', 'État de l\'engin')}</Form.Label>
        <Form.Select
          name="etatEngin"
          value={postData.etatEngin || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">Neuf</option>
          <option value="tres_bon">Très bon état</option>
          <option value="operationnel">Opérationnel</option>
          <option value="reparation">Besoin de réparation</option>
          <option value="pieces">Pour pièces</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeTracteur': (
      <Form.Group key="typeTracteur">
        <Form.Label>🚜 {t('tractor_type', 'Type de tracteur')}</Form.Label>
        <Form.Select
          name="typeTracteur"
          value={postData.typeTracteur || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_tractor_type', 'Sélectionnez')}</option>
          <option value="agricole">Tracteur agricole</option>
          <option value="industriel">Tracteur industriel</option>
          <option value="vigneron">Tracteur vigneron</option>
          <option value="chenilles">Tracteur à chenilles</option>
          <option value="tondeuse">Tracteur tondeuse</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeRemorque': (
      <Form.Group key="typeRemorque">
        <Form.Label>🚛 {t('trailer_type', 'Type de remorque')}</Form.Label>
        <Form.Select
          name="typeRemorque"
          value={postData.typeRemorque || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_trailer_type', 'Sélectionnez')}</option>
          <option value="plateau">Remorque plateau</option>
          <option value="benne">Remorque benne</option>
          <option value="ridelle">Remorque à ridelles</option>
          <option value="porte_engin">Remorque porte-engin</option>
          <option value="voiture">Remorque voiture</option>
          <option value="bateau">Remorque bateau</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'dimensions': (
      <Form.Group key="dimensions">
        <Form.Label>📏 {t('dimensions', 'Dimensions')} (L x l x H)</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="longueur"
              value={postData.longueur || ''}
              onChange={handleChangeInput}
              placeholder="Longueur"
              min="0"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="largeur"
              value={postData.largeur || ''}
              onChange={handleChangeInput}
              placeholder="Largeur"
              min="0"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="hauteur"
              value={postData.hauteur || ''}
              onChange={handleChangeInput}
              placeholder="Hauteur"
              min="0"
            />
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'typeQuad': (
      <Form.Group key="typeQuad">
        <Form.Label>🏎️ {t('quad_type', 'Type de quad')}</Form.Label>
        <Form.Select
          name="typeQuad"
          value={postData.typeQuad || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_quad_type', 'Sélectionnez')}</option>
          <option value="sport">Quad sport</option>
          <option value="utilitaire">Quad utilitaire</option>
          <option value="tourisme">Quad de tourisme</option>
          <option value="enfant">Quad pour enfants</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeBateau': (
      <Form.Group key="typeBateau">
        <Form.Label>🚤 {t('boat_type', 'Type de bateau')}</Form.Label>
        <Form.Select
          name="typeBateau"
          value={postData.typeBateau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_boat_type', 'Sélectionnez')}</option>
          <option value="voilier">Voilier</option>
          <option value="moteur">Bateau à moteur</option>
          <option value="zodiac">Zodiac</option>
          <option value="peche">Bateau de pêche</option>
          <option value="plaisance">Bateau de plaisance</option>
          <option value="jet_ski">Jet ski</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'longueur': (
      <Form.Group key="longueur">
        <Form.Label>📏 {t('length', 'Longueur')} (m)</Form.Label>
        <Form.Control
          type="number"
          name="longueur"
          value={postData.longueur || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 6.5"
          min="0"
          step="0.1"
        />
      </Form.Group>
    ),
    
    'moteur': (
      <Form.Group key="moteur">
        <Form.Label>⚙️ {t('engine', 'Moteur')}</Form.Label>
        <Form.Select
          name="moteur"
          value={postData.moteur || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_engine', 'Sélectionnez')}</option>
          <option value="hors_bord">Hors-bord</option>
          <option value="dans_bord">Dans-bord</option>
          <option value="electrique">Électrique</option>
          <option value="voile">À voile</option>
          <option value="rame">À rame</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typePiece': (
      <Form.Group key="typePiece">
        <Form.Label>🔩 {t('part_type', 'Type de pièce')}</Form.Label>
        <Form.Select
          name="typePiece"
          value={postData.typePiece || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_part_type', 'Sélectionnez')}</option>
          <option value="moteur">Moteur/Transmission</option>
          <option value="carrosserie">Carrosserie</option>
          <option value="freinage">Freinage</option>
          <option value="suspension">Suspension</option>
          <option value="electrique">Électrique</option>
          <option value="interieur">Intérieur</option>
          <option value="pneu_jante">Pneu/Jante</option>
          <option value="echappement">Échappement</option>
          <option value="refroidissement">Refroidissement</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueCompatible': (
      <Form.Group key="marqueCompatible">
        <Form.Label>🔗 {t('compatible_brand', 'Marque compatible')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueCompatible"
          value={postData.marqueCompatible || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_compatible_brands', 'Ex: Renault, Peugeot...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'modeleCompatible': (
      <Form.Group key="modeleCompatible">
        <Form.Label>🔗 {t('compatible_model', 'Modèles compatibles')}</Form.Label>
        <Form.Control
          type="text"
          name="modeleCompatible"
          value={postData.modeleCompatible || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_compatible_models', 'Ex: Clio, 206, Golf...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'etatPiece': (
      <Form.Group key="etatPiece">
        <Form.Label>🔄 {t('part_condition', 'État de la pièce')}</Form.Label>
        <Form.Select
          name="etatPiece"
          value={postData.etatPiece || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">Neuf</option>
          <option value="occasion">Occasion en état</option>
          <option value="reparation">À réparer</option>
          <option value="usage">Usage visible</option>
          <option value="origine">Pièce d'origine</option>
        </Form.Select>
      </Form.Group>
    )
  };
  
  const subCategoryFields = getSubCategorySpecificFields();
  
  // Si fieldName está especificado, devolver ese campo
  if (fieldName) {
    return fields[fieldName] || null;
  }
  
  // Si no hay fieldName específico, devolver todos los campos de la subcategoría
  if (subCategory && subCategoryFields) {
    return (
      <>
        {Object.keys(subCategoryFields).map(key => (
          <div key={key} className="mb-3">
            {fields[subCategoryFields[key]]}
          </div>
        ))}
      </>
    );
  }
  
  return null;
};

export default VehiculesFields;
 