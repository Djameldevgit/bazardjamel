import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const VoyagesFields = ({ fieldName, postData, handleChangeInput, subCategory, isRTL }) => {
  const { t } = useTranslation();
  
  // CORREGIDO: Usar array en lugar de objeto anidado
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'voyage_organise': ['typeVoyage', 'destinationType', 'dureeVoyage', 'dateDepart', 'transportVoyage', 'hebergementVoyage'],
      'location_vacances': ['typeHebergement', 'capaciteHebergement', 'equipementsHebergement', 'localisationHebergement', 'periodeLocation'],
      'hajj_omra': ['typeVoyageReligieux', 'periodeVoyage', 'servicesInclus', 'guideReligieux', 'logementProche'],
      'reservations_visa': ['typeServiceVisa', 'paysVisa', 'delaiVisa', 'typeVisa', 'suiviDossier'],
      'sejour': ['typeSejour', 'dureeSejour', 'activitesSejour', 'formuleSejour', 'publicCible'],
      'croisiere': ['compagnieCroisiere', 'dureeCroisiere', 'escalesCroisiere', 'typeCabine'],
      'autre': ['descriptionSpecifique']
    };
    
    return specificFields[subCategory] || [];
  };
  
  // CORREGIDO: Agregar key={fieldName} a todos los Form.Group
  const fields = {
    // Voyage organisé
    'typeVoyage': (
      <Form.Group key="typeVoyage">
        <Form.Label>✈️ {t('travel_type', 'Type de voyage')}</Form.Label>
        <Form.Select
          name="typeVoyage"
          value={postData.typeVoyage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_travel_type', 'Sélectionnez')}</option>
          <option value="touristique">{t('tourist', 'Touristique')}</option>
          <option value="aventure">{t('adventure', 'Aventure')}</option>
          <option value="culturel">{t('cultural', 'Culturel')}</option>
          <option value="balneaire">{t('beach', 'Balnéaire')}</option>
          <option value="montagne">{t('mountain', 'Montagne')}</option>
          <option value="safari">{t('safari', 'Safari')}</option>
          <option value="decouverte">{t('discovery', 'Découverte')}</option>
          <option value="gastronomique">{t('gastronomic', 'Gastronomique')}</option>
          <option value="affaires">{t('business', 'Affaires')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'destination': (
      <Form.Group key="destination">
        <Form.Label>🌍 {t('destination', 'Destination')}</Form.Label>
        <Form.Control
          type="text"
          name="destination"
          value={postData.destination || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_destination', 'Pays, ville ou région')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'dureeVoyage': (
      <Form.Group key="dureeVoyage">
        <Form.Label>⏱️ {t('travel_duration', 'Durée du voyage')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="dureeVoyage"
              value={postData.dureeVoyage || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_duration', 'Ex: 7')}
              min="1"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteDureeVoyage"
              value={postData.uniteDureeVoyage || 'jours'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="jours">{t('days', 'Jours')}</option>
              <option value="semaines">{t('weeks', 'Semaines')}</option>
              <option value="weekend">{t('weekend', 'Week-end')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'dateDepart': (
      <Form.Group key="dateDepart">
        <Form.Label>📅 {t('departure_date', 'Date de départ')}</Form.Label>
        <Form.Control
          type="date"
          name="dateDepart"
          value={postData.dateDepart || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'transportVoyage': (
      <Form.Group key="transportVoyage">
        <Form.Label>🚗 {t('travel_transport', 'Transport inclus')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="transportAvion"
            label={t('plane', 'Avion')}
            checked={postData.transportAvion || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="transportBus"
            label={t('bus', 'Bus/Car')}
            checked={postData.transportBus || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="transportTrain"
            label={t('train', 'Train')}
            checked={postData.transportTrain || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="transportLocal"
            label={t('local_transport', 'Transport local')}
            checked={postData.transportLocal || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="transferts"
            label={t('transfers', 'Transferts aéroport')}
            checked={postData.transferts || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    'hebergementVoyage': (
      <Form.Group key="hebergementVoyage">
        <Form.Label>🏨 {t('travel_accommodation', 'Hébergement inclus')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="hebergementHotel"
            label={t('hotel', 'Hôtel')}
            checked={postData.hebergementHotel || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="hebergementRiad"
            label={t('riad', 'Riad/Guesthouse')}
            checked={postData.hebergementRiad || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="hebergementAppartement"
            label={t('apartment', 'Appartement')}
            checked={postData.hebergementAppartement || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="hebergementVilla"
            label={t('villa', 'Villa')}
            checked={postData.hebergementVilla || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="petitDejeuner"
            label={t('breakfast', 'Petit déjeuner inclus')}
            checked={postData.petitDejeuner || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    // Location vacances
    'typeHebergement': (
      <Form.Group key="typeHebergement">
        <Form.Label>🏡 {t('accommodation_type', 'Type d\'hébergement')}</Form.Label>
        <Form.Select
          name="typeHebergement"
          value={postData.typeHebergement || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_accommodation', 'Sélectionnez')}</option>
          <option value="appartement">{t('apartment', 'Appartement')}</option>
          <option value="villa">{t('villa', 'Villa')}</option>
          <option value="maison">{t('house', 'Maison')}</option>
          <option value="riad">{t('riad', 'Riad')}</option>
          <option value="chalet">{t('chalet', 'Chalet')}</option>
          <option value="bungalow">{t('bungalow', 'Bungalow')}</option>
          <option value="studio">{t('studio', 'Studio')}</option>
          <option value="ferme">{t('farm', 'Ferme')}</option>
          <option value="chambre_hote">{t('guest_room', 'Chambre d\'hôte')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'capaciteHebergement': (
      <Form.Group key="capaciteHebergement">
        <Form.Label>👥 {t('accommodation_capacity', 'Capacité d\'accueil')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="capaciteHebergement"
              value={postData.capaciteHebergement || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_capacity', 'Ex: 4')}
              min="1"
            />
          </Col>
          <Col>
            <span className="align-middle">{t('people', 'personnes')}</span>
          </Col>
        </Row>
        <Form.Text className="text-muted">
          💡 {t('capacity_tip', 'Nombre maximum de personnes autorisées')}
        </Form.Text>
      </Form.Group>
    ),
    
    'equipementsHebergement': (
      <Form.Group key="equipementsHebergement">
        <Form.Label>🏠 {t('accommodation_equipment', 'Équipements')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="equipementCuisine"
            label={t('kitchen', 'Cuisine équipée')}
            checked={postData.equipementCuisine || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="equipementWifi"
            label={t('wifi', 'Wi-Fi')}
            checked={postData.equipementWifi || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="equipementClimatisation"
            label={t('ac', 'Climatisation')}
            checked={postData.equipementClimatisation || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="equipementPiscine"
            label={t('pool', 'Piscine')}
            checked={postData.equipementPiscine || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="equipementParking"
            label={t('parking', 'Parking')}
            checked={postData.equipementParking || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="equipementJardin"
            label={t('garden', 'Jardin')}
            checked={postData.equipementJardin || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    'localisationHebergement': (
      <Form.Group key="localisationHebergement">
        <Form.Label>📍 {t('accommodation_location', 'Localisation')}</Form.Label>
        <Form.Control
          type="text"
          name="localisationHebergement"
          value={postData.localisationHebergement || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_location', 'Adresse exacte ou quartier')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <Form.Text className="text-muted">
          💡 {t('location_tip', 'Vous pouvez préciser la proximité avec les points d\'intérêt')}
        </Form.Text>
      </Form.Group>
    ),
    
    'periodeLocation': (
      <Form.Group key="periodeLocation">
        <Form.Label>📅 {t('rental_period', 'Période de location')}</Form.Label>
        <Row className="mb-2">
          <Col>
            <Form.Label className="small">{t('from', 'Du')}</Form.Label>
            <Form.Control
              type="date"
              name="dateDebutLocation"
              value={postData.dateDebutLocation || ''}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </Col>
          <Col>
            <Form.Label className="small">{t('to', 'Au')}</Form.Label>
            <Form.Control
              type="date"
              name="dateFinLocation"
              value={postData.dateFinLocation || ''}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </Col>
        </Row>
        <Form.Check
          type="checkbox"
          name="locationLongueDuree"
          label={t('long_term_rental', 'Location longue durée possible')}
          checked={postData.locationLongueDuree || false}
          onChange={handleChangeInput}
        />
      </Form.Group>
    ),
    
    // Hajj & Omra
    'typeVoyageReligieux': (
      <Form.Group key="typeVoyageReligieux">
        <Form.Label>🕋 {t('religious_travel_type', 'Type de voyage religieux')}</Form.Label>
        <Form.Select
          name="typeVoyageReligieux"
          value={postData.typeVoyageReligieux || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_religious_travel', 'Sélectionnez')}</option>
          <option value="hajj">{t('hajj', 'Hajj')}</option>
          <option value="omra">{t('umrah', 'Omra')}</option>
          <option value="hajj_omra">{t('hajj_umrah', 'Hajj & Omra combinés')}</option>
          <option value="omra_ramadan">{t('umrah_ramadan', 'Omra Ramadan')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'periodeVoyage': (
      <Form.Group key="periodeVoyage">
        <Form.Label>📅 {t('travel_period', 'Période du voyage')}</Form.Label>
        <Form.Select
          name="periodeVoyage"
          value={postData.periodeVoyage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_period', 'Sélectionnez')}</option>
          <option value="ramadan">{t('ramadan', 'Ramadan')}</option>
          <option value="hajj_2024">{t('hajj_2024', 'Hajj 2024')}</option>
          <option value="hajj_2025">{t('hajj_2025', 'Hajj 2025')}</option>
          <option value="toute_annee">{t('all_year', 'Toute l\'année (Omra)')}</option>
          <option value="vacances_scolaires">{t('school_holidays', 'Vacances scolaires')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'servicesInclus': (
      <Form.Group key="servicesInclus">
        <Form.Label>✅ {t('included_services', 'Services inclus')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="serviceBillet"
            label={t('ticket', 'Billet d\'avion')}
            checked={postData.serviceBillet || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="serviceHebergement"
            label={t('accommodation', 'Hébergement')}
            checked={postData.serviceHebergement || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="serviceTransport"
            label={t('transport', 'Transport local')}
            checked={postData.serviceTransport || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="serviceRepas"
            label={t('meals', 'Repas')}
            checked={postData.serviceRepas || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="serviceAssistance"
            label={t('assistance', 'Assistance sur place')}
            checked={postData.serviceAssistance || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="serviceVisa"
            label={t('visa', 'Visa')}
            checked={postData.serviceVisa || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    'guideReligieux': (
      <Form.Group key="guideReligieux">
        <Form.Label>📖 {t('religious_guide', 'Guide religieux')}</Form.Label>
        <Form.Check
          type="switch"
          name="guideReligieux"
          checked={postData.guideReligieux || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'guideReligieux',
              value: e.target.checked
            }
          })}
          label={postData.guideReligieux ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
        {postData.guideReligieux && (
          <Form.Select
            name="langueGuide"
            value={postData.langueGuide || ''}
            onChange={handleChangeInput}
            className="mt-2"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="">{t('select_language', 'Langue du guide')}</option>
            <option value="arabe">{t('arabic', 'Arabe')}</option>
            <option value="francais">{t('french', 'Français')}</option>
            <option value="anglais">{t('english', 'Anglais')}</option>
            <option value="bilingue">{t('bilingual', 'Bilingue')}</option>
          </Form.Select>
        )}
      </Form.Group>
    ),
    
    'logementProche': (
      <Form.Group key="logementProche">
        <Form.Label>📍 {t('nearby_accommodation', 'Proximité des lieux saints')}</Form.Label>
        <Form.Select
          name="logementProche"
          value={postData.logementProche || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_proximity', 'Sélectionnez')}</option>
          <option value="tres_proche">{t('very_close', 'Très proche (moins de 1km)')}</option>
          <option value="proche">{t('close', 'Proche (1-3 km)')}</option>
          <option value="moyen">{t('medium', 'Distance moyenne (3-5 km)')}</option>
          <option value="eloigne">{t('far', 'Éloigné (plus de 5 km)')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Reservations & Visa
    'typeServiceVisa': (
      <Form.Group key="typeServiceVisa">
        <Form.Label>📋 {t('visa_service_type', 'Type de service visa')}</Form.Label>
        <Form.Select
          name="typeServiceVisa"
          value={postData.typeServiceVisa || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_visa_service', 'Sélectionnez')}</option>
          <option value="demande_visa">{t('visa_application', 'Demande de visa')}</option>
          <option value="assistance_dossier">{t('file_assistance', 'Assistance complète dossier')}</option>
          <option value="urgent">{t('urgent', 'Visa urgent')}</option>
          <option value="affaires">{t('business', 'Visa affaires')}</option>
          <option value="touristique">{t('tourist', 'Visa touristique')}</option>
          <option value="etudiant">{t('student', 'Visa étudiant')}</option>
          <option value="medical">{t('medical', 'Visa médical')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'paysVisa': (
      <Form.Group key="paysVisa">
        <Form.Label>🇺🇸 {t('visa_country', 'Pays du visa')}</Form.Label>
        <Form.Control
          type="text"
          name="paysVisa"
          value={postData.paysVisa || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_country', 'Ex: France, USA, Arabie Saoudite...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'delaiVisa': (
      <Form.Group key="delaiVisa">
        <Form.Label>⏱️ {t('visa_processing_time', 'Délai de traitement')}</Form.Label>
        <Form.Select
          name="delaiVisa"
          value={postData.delaiVisa || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_processing_time', 'Sélectionnez')}</option>
          <option value="express">{t('express', 'Express (24-48h)')}</option>
          <option value="rapide">{t('fast', 'Rapide (3-5 jours)')}</option>
          <option value="standard">{t('standard', 'Standard (1-2 semaines)')}</option>
          <option value="long">{t('long', 'Long (3-4 semaines)')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeVisa': (
      <Form.Group key="typeVisa">
        <Form.Label>📄 {t('visa_type', 'Type de visa')}</Form.Label>
        <Form.Select
          name="typeVisa"
          value={postData.typeVisa || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_visa_type', 'Sélectionnez')}</option>
          <option value="simple">{t('single', 'Entrée simple')}</option>
          <option value="multiple">{t('multiple', 'Entrées multiples')}</option>
          <option value="transit">{t('transit', 'Transit')}</option>
          <option value="long_sejour">{t('long_stay', 'Long séjour')}</option>
          <option value="court_sejour">{t('short_stay', 'Court séjour')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'suiviDossier': (
      <Form.Group key="suiviDossier">
        <Form.Label>📊 {t('file_tracking', 'Suivi du dossier')}</Form.Label>
        <Form.Check
          type="switch"
          name="suiviDossier"
          checked={postData.suiviDossier || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'suiviDossier',
              value: e.target.checked
            }
          })}
          label={postData.suiviDossier ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
        <Form.Text className="text-muted">
          💡 {t('tracking_tip', 'Mises à jour régulières sur l\'avancement de votre dossier')}
        </Form.Text>
      </Form.Group>
    ),
    
    // Séjour
    'typeSejour': (
      <Form.Group key="typeSejour">
        <Form.Label>🏞️ {t('stay_type', 'Type de séjour')}</Form.Label>
        <Form.Select
          name="typeSejour"
          value={postData.typeSejour || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_stay_type', 'Sélectionnez')}</option>
          <option value="detente">{t('relaxation', 'Détente')}</option>
          <option value="decouverte">{t('discovery', 'Découverte')}</option>
          <option value="sportif">{t('sports', 'Sportif')}</option>
          <option value="culturel">{t('cultural', 'Culturel')}</option>
          <option value="bien_etre">{t('wellness', 'Bien-être')}</option>
          <option value="gastronomique">{t('gastronomic', 'Gastronomique')}</option>
          <option value="familial">{t('family', 'Familial')}</option>
          <option value="romantique">{t('romantic', 'Romantique')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'dureeSejour': (
      <Form.Group key="dureeSejour">
        <Form.Label>⏱️ {t('stay_duration', 'Durée du séjour')}</Form.Label>
        <Form.Select
          name="dureeSejour"
          value={postData.dureeSejour || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_duration', 'Sélectionnez')}</option>
          <option value="weekend">{t('weekend', 'Week-end (2-3 jours)')}</option>
          <option value="courte">4-7 {t('days', 'jours')}</option>
          <option value="moyenne">8-14 {t('days', 'jours')}</option>
          <option value="longue">15+ {t('days', 'jours')}</option>
          <option value="sur_mesure">{t('custom', 'Sur mesure')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'activitesSejour': (
      <Form.Group key="activitesSejour">
        <Form.Label>🎯 {t('stay_activities', 'Activités incluses')}</Form.Label>
        <Form.Control
          as="textarea"
          name="activitesSejour"
          value={postData.activitesSejour || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_activities', 'Listez les activités proposées...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'formuleSejour': (
      <Form.Group key="formuleSejour">
        <Form.Label>📋 {t('stay_package', 'Formule')}</Form.Label>
        <Form.Select
          name="formuleSejour"
          value={postData.formuleSejour || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_package', 'Sélectionnez')}</option>
          <option value="tout_inclus">{t('all_inclusive', 'Tout inclus')}</option>
          <option value="demi_pension">{t('half_board', 'Demi-pension')}</option>
          <option value="pension_complete">{t('full_board', 'Pension complète')}</option>
          <option value="petit_dejeuner">{t('breakfast_only', 'Petit déjeuner uniquement')}</option>
          <option value="sans_repas">{t('no_meals', 'Sans repas')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'publicCible': (
      <Form.Group key="publicCible">
        <Form.Label>👥 {t('target_audience', 'Public cible')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="publicFamille"
            label={t('family', 'Familles')}
            checked={postData.publicFamille || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="publicCouple"
            label={t('couples', 'Couples')}
            checked={postData.publicCouple || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="publicSolo"
            label={t('solo', 'Voyageurs solo')}
            checked={postData.publicSolo || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="publicGroupes"
            label={t('groups', 'Groupes')}
            checked={postData.publicGroupes || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="publicSeniors"
            label={t('seniors', 'Seniors')}
            checked={postData.publicSeniors || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    // Croisière
    'compagnieCroisiere': (
      <Form.Group key="compagnieCroisiere">
        <Form.Label>🚢 {t('cruise_company', 'Compagnie de croisière')}</Form.Label>
        <Form.Select
          name="compagnieCroisiere"
          value={postData.compagnieCroisiere || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_cruise_company', 'Sélectionnez')}</option>
          <option value="msc">MSC Croisières</option>
          <option value="costa">Costa Croisières</option>
          <option value="royal_caribbean">Royal Caribbean</option>
          <option value="norwegian">Norwegian Cruise Line</option>
          <option value="celebrity">Celebrity Cruises</option>
          <option value="carnival">Carnival Cruise Line</option>
          <option value="princess">Princess Cruises</option>
          <option value="autre">{t('other', 'Autre')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'dureeCroisiere': (
      <Form.Group key="dureeCroisiere">
        <Form.Label>⏱️ {t('cruise_duration', 'Durée de la croisière')}</Form.Label>
        <Form.Select
          name="dureeCroisiere"
          value={postData.dureeCroisiere || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_duration', 'Sélectionnez')}</option>
          <option value="courte">3-5 {t('days', 'jours')}</option>
          <option value="moyenne">6-10 {t('days', 'jours')}</option>
          <option value="longue">11-14 {t('days', 'jours')}</option>
          <option value="tres_longue">15+ {t('days', 'jours')}</option>
          <option value="autour_monde">{t('world', 'Tour du monde')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'escalesCroisiere': (
      <Form.Group key="escalesCroisiere">
        <Form.Label>📍 {t('cruise_stops', 'Escales principales')}</Form.Label>
        <Form.Control
          type="text"
          name="escalesCroisiere"
          value={postData.escalesCroisiere || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_stops', 'Ex: Barcelone, Marseille, Gênes...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'typeCabine': (
      <Form.Group key="typeCabine">
        <Form.Label>🛏️ {t('cabin_type', 'Type de cabine')}</Form.Label>
        <Form.Select
          name="typeCabine"
          value={postData.typeCabine || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_cabin_type', 'Sélectionnez')}</option>
          <option value="interieure">{t('inside', 'Intérieure')}</option>
          <option value="exterieure">{t('outside', 'Extérieure avec hublot')}</option>
          <option value="balcon">{t('balcony', 'Cabine avec balcon')}</option>
          <option value="suite">{t('suite', 'Suite')}</option>
          <option value="familiale">{t('family', 'Familiale')}</option>
          <option value="promenade">{t('promenade', 'Promenade')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Autre
    'descriptionSpecifique': (
      <Form.Group key="descriptionSpecifique">
        <Form.Label>📝 {t('specific_description', 'Description spécifique')}</Form.Label>
        <Form.Control
          as="textarea"
          name="descriptionSpecifique"
          value={postData.descriptionSpecifique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_specific_description', 'Décrivez votre service voyage en détail...')}
          rows={3}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    )
  };
  
  // Lógica de renderizado CORREGIDA
  const subCategoryFields = getSubCategorySpecificFields();
  
  console.log('✈️ VoyagesFields - Renderizando:', {
    subCategory,
    fieldName,
    fieldsCount: subCategoryFields.length,
    fields: subCategoryFields
  });
  
  // Si se solicita un campo específico
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    if (!fieldComponent) {
      console.error(`❌ Campo '${fieldName}' no encontrado en VoyagesFields`);
      return (
        <div className="alert alert-danger">
          <strong>Error:</strong> Campo '{fieldName}' no está definido para voyages.
        </div>
      );
    }
    return fieldComponent;
  }
  
  // Si hay subcategoría, renderizar todos sus campos
  if (subCategory && subCategoryFields.length > 0) {
    return (
      <div className="row g-3">
        {subCategoryFields.map(fieldKey => {
          const fieldComponent = fields[fieldKey];
          
          if (!fieldComponent) {
            console.error(`❌ Campo '${fieldKey}' no definido para ${subCategory}`);
            return (
              <div key={fieldKey} className="col-12">
                <div className="alert alert-warning">
                  <strong>Advertencia:</strong> Campo '{fieldKey}' no disponible.
                </div>
              </div>
            );
          }
          
          return (
            <div key={fieldKey} className="col-12 col-md-6">
              {fieldComponent}
            </div>
          );
        })}
      </div>
    );
  }
  
  // Si no hay subcategoría seleccionada
  if (!subCategory) {
    return (
      <div className="alert alert-info">
        <strong>✈️ Información:</strong> Selecciona una subcategoría de voyages para ver los campos específicos.
      </div>
    );
  }
  
  // Si la subcategoría no tiene campos definidos
  return (
    <div className="alert alert-warning">
      <strong>⚠️ Advertencia:</strong> La subcategoría '{subCategory}' no tiene campos definidos.
    </div>
  );
};

export default VoyagesFields;