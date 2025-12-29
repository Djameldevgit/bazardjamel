import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';
const InformatiqueFields = ({ fieldName, postData, handleChangeInput, subCategory, isRTL }) => {
  const { t } = useTranslation();
  
  // ✅ CORREGIDO: Usar ARRAY en lugar de objeto anidado
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'ordinateurs_portables': ['typeOrdinateur', 'marque', 'modele', 'processeur', 'ram', 'stockage', 'carteGraphique', 'tailleEcran', 'resolution', 'typeEcran', 'systemeExploitation', 'autonomie', 'poids', 'connectivite', 'anneeFabrication', 'garantie', 'etatBatterie'],
      'ordinateurs_bureau': ['typeOrdinateur', 'marque', 'modele', 'processeur', 'ram', 'stockage', 'carteGraphique', 'typeBoitier', 'alimentation', 'connectivite', 'anneeFabrication', 'garantie'],
      'serveurs': ['typeServeur', 'marque', 'modele', 'processeur', 'ram', 'stockage', 'typeRack', 'hauteurU', 'alimentation', 'anneeFabrication'],
      'ecrans': ['marque', 'modele', 'tailleEcran', 'resolution', 'typeEcran', 'tempsReponse', 'frequenceRafraichissement', 'connectivite', 'courbure', 'anneeFabrication'],
      'composants_pc_fixe': ['typeComposant', 'marque', 'modele', 'compatible', 'capacite', 'vitesse', 'interface', 'anneeFabrication', 'garantie'],
      'composants_pc_portable': ['typeComposant', 'marque', 'modele', 'compatible', 'capacite', 'interface', 'etat'],
      'composants_serveur': ['typeComposant', 'marque', 'modele', 'compatible', 'capacite', 'vitesse', 'interface', 'hauteurU'],
      'imprimantes_cartouches': ['typeImprimante', 'marque', 'modele', 'fonctions', 'connectivite', 'vitesseImpression', 'resolutionImpression', 'anneeFabrication', 'typeCartouche'],
      'reseau_connexion': ['typeEquipement', 'marque', 'modele', 'vitesse', 'ports', 'wifi', 'standardWifi', 'anneeFabrication'],
      'stockage_externe_racks': ['typeStockage', 'marque', 'modele', 'capacite', 'interface', 'vitesse', 'format', 'typeRack'],
      'onduleurs_stabilisateurs': ['typeAppareil', 'marque', 'modele', 'puissance', 'autonomie', 'nombrePrises', 'typeBatterie', 'anneeFabrication'],
      'compteuses_billets': ['marque', 'modele', 'typeBillets', 'vitesseComptage', 'precision', 'connectivite', 'anneeFabrication'],
      'claviers_souris': ['typePeripherique', 'marque', 'modele', 'connectivite', 'typeClavier', 'dpiSouris', 'rgb', 'couleur'],
      'casques_son': ['typeCasque', 'marque', 'modele', 'connectivite', 'microIntegre', 'cancellationBruit', 'impedance', 'couleur'],
      'webcam_videoconference': ['marque', 'modele', 'resolution', 'microIntegre', 'fps', 'angleVision', 'connectivite', 'support'],
      'data_shows': ['marque', 'modele', 'resolution', 'luminosite', 'contraste', 'connectivite', 'poids', 'typeProjection'],
      'cables_adaptateurs': ['typeCable', 'longueur', 'connecteurDebut', 'connecteurFin', 'materiau', 'couleur', 'blindage'],
      'stylets_tablettes': ['typeStylet', 'marque', 'modele', 'compatible', 'pression', 'batterie', 'couleur', 'accessoires'],
      'cartables_sacoches': ['typeSac', 'marque', 'modele', 'taille', 'compartiments', 'materiau', 'couleur', 'protection'],
      'manettes_simulateurs': ['typeManette', 'marque', 'modele', 'compatible', 'connectivite', 'retroEclairage', 'vibration', 'couleur'],
      'vr': ['typeVR', 'marque', 'modele', 'resolution', 'fps', 'champVision', 'tracking', 'compatible', 'accessoires']
    };
    
    return specificFields[subCategory] || [];
  };
  
  // ✅ DEBES AGREGAR TODOS ESTOS CAMPOS AL OBJETO 'fields'
  const fields = {
    // Campos básicos (que probablemente ya tienes)
    'typeOrdinateur': (
      <Form.Group key="typeOrdinateur">
        <Form.Label>💻 {t('computer_type', 'Type d\'ordinateur')}</Form.Label>
        <Form.Select
          name="typeOrdinateur"
          value={postData.typeOrdinateur || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_computer_type', 'Sélectionnez type')}</option>
          <option value="ultrabook">Ultrabook</option>
          <option value="notebook">Notebook/PC portable</option>
          <option value="gaming">Gaming</option>
          <option value="workstation">Workstation</option>
          <option value="convertible">2-en-1/Convertible</option>
          <option value="chromebook">Chromebook</option>
          <option value="macbook">MacBook</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marque': (
      <MarqueField
        key="marque"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
        name="marque"
        label="stay_price"
      />
    ),


    'modele': (
      <ModeleField
        key="modele"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
        name="modele"
        label="stay_Modele"
      />
    ),
    
    'processeur': (
      <Form.Group key="processeur">
        <Form.Label>⚙️ {t('processor', 'Processeur')}</Form.Label>
        <Form.Select
          name="processeur"
          value={postData.processeur || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_processor', 'Sélectionnez processeur')}</option>
          <optgroup label="🟦 Intel">
            <option value="i3">Intel Core i3</option>
            <option value="i5">Intel Core i5</option>
            <option value="i7">Intel Core i7</option>
            <option value="i9">Intel Core i9</option>
            <option value="xeon">Intel Xeon</option>
            <option value="celeron">Intel Celeron</option>
            <option value="pentium">Intel Pentium</option>
          </optgroup>
          <optgroup label="🟥 AMD">
            <option value="ryzen3">AMD Ryzen 3</option>
            <option value="ryzen5">AMD Ryzen 5</option>
            <option value="ryzen7">AMD Ryzen 7</option>
            <option value="ryzen9">AMD Ryzen 9</option>
            <option value="threadripper">AMD Threadripper</option>
            <option value="athlon">AMD Athlon</option>
          </optgroup>
          <optgroup label="🍎 Apple">
            <option value="m1">Apple M1</option>
            <option value="m2">Apple M2</option>
            <option value="m3">Apple M3</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    'ram': (
      <Form.Group key="ram">
        <Form.Label>⚡ {t('ram', 'Mémoire RAM')}</Form.Label>
        <Form.Select
          name="ram"
          value={postData.ram || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_ram', 'Sélectionnez RAM')}</option>
          <option value="4">4 GB</option>
          <option value="8">8 GB</option>
          <option value="16">16 GB</option>
          <option value="32">32 GB</option>
          <option value="64">64 GB</option>
          <option value="128">128 GB</option>
          <option value="256">256 GB+</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'stockage': (
      <Form.Group key="stockage">
        <Form.Label>💾 {t('storage', 'Stockage')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="stockage"
              value={postData.stockage || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 512"
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="stockageType"
              value={postData.stockageType || 'ssd'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="ssd">SSD</option>
              <option value="hdd">HDD</option>
              <option value="nvme">NVMe</option>
              <option value="hybride">{t('hybrid', 'Hybride')}</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Select
              name="stockageUnite"
              value={postData.stockageUnite || 'gb'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="gb">GB</option>
              <option value="tb">TB</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    // ✅ NUEVOS CAMPOS QUE NECESITAS AGREGAR:
    
    'carteGraphique': (
      <Form.Group key="carteGraphique">
        <Form.Label>🎮 {t('graphics_card', 'Carte graphique')}</Form.Label>
        <Form.Select
          name="carteGraphique"
          value={postData.carteGraphique || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_graphics_card', 'Sélectionnez carte')}</option>
          <optgroup label="🟩 NVIDIA">
            <option value="rtx4090">NVIDIA RTX 4090</option>
            <option value="rtx4080">NVIDIA RTX 4080</option>
            <option value="rtx4070">NVIDIA RTX 4070</option>
            <option value="rtx4060">NVIDIA RTX 4060</option>
            <option value="rtx3050">NVIDIA RTX 3050</option>
            <option value="gtx1660">NVIDIA GTX 1660</option>
          </optgroup>
          <optgroup label="🟥 AMD">
            <option value="rx7900">AMD RX 7900</option>
            <option value="rx7800">AMD RX 7800</option>
            <option value="rx7700">AMD RX 7700</option>
            <option value="rx7600">AMD RX 7600</option>
          </optgroup>
          <optgroup label="🟦 Intel">
            <option value="arc">Intel Arc</option>
          </optgroup>
          <option value="integree">{t('integrated', 'Intégrée')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleEcran': (
      <Form.Group key="tailleEcran">
        <Form.Label>🖥️ {t('screen_size', 'Taille d\'écran')}</Form.Label>
        <Form.Select
          name="tailleEcran"
          value={postData.tailleEcran || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_screen_size', 'Sélectionnez taille')}</option>
          <option value="13">13 pouces</option>
          <option value="14">14 pouces</option>
          <option value="15.6">15.6 pouces</option>
          <option value="16">16 pouces</option>
          <option value="17.3">17.3 pouces</option>
          <option value="24">24 pouces (bureau)</option>
          <option value="27">27 pouces (bureau)</option>
          <option value="32">32 pouces (bureau)</option>
          <option value="34">34 pouces (ultrawide)</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'resolution': (
      <Form.Group key="resolution">
        <Form.Label>📐 {t('resolution', 'Résolution')}</Form.Label>
        <Form.Select
          name="resolution"
          value={postData.resolution || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_resolution', 'Sélectionnez résolution')}</option>
          <option value="hd">HD (1366x768)</option>
          <option value="fhd">Full HD (1920x1080)</option>
          <option value="qhd">QHD (2560x1440)</option>
          <option value="uhd">4K UHD (3840x2160)</option>
          <option value="retina">Retina</option>
          <option value="uwqhd">UWQHD (3440x1440)</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeEcran': (
      <Form.Group key="typeEcran">
        <Form.Label>🖥️ {t('screen_type', 'Type d\'écran')}</Form.Label>
        <Form.Select
          name="typeEcran"
          value={postData.typeEcran || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_screen_type', 'Sélectionnez type')}</option>
          <option value="ips">IPS</option>
          <option value="va">VA</option>
          <option value="tn">TN</option>
          <option value="oled">OLED</option>
          <option value="miniled">Mini-LED</option>
          <option value="tactile">{t('touchscreen', 'Tactile')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'systemeExploitation': (
      <Form.Group key="systemeExploitation">
        <Form.Label>🖥️ {t('operating_system', 'Système d\'exploitation')}</Form.Label>
        <Form.Select
          name="systemeExploitation"
          value={postData.systemeExploitation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_os', 'Sélectionnez OS')}</option>
          <option value="windows10">Windows 10</option>
          <option value="windows11">Windows 11</option>
          <option value="macos">macOS</option>
          <option value="linux">Linux</option>
          <option value="chromeos">Chrome OS</option>
          <option value="sans_os">{t('no_os', 'Sans OS')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'autonomie': (
      <Form.Group key="autonomie">
        <Form.Label>🔋 {t('battery_life', 'Autonomie batterie')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="autonomie"
              value={postData.autonomie || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 8"
              min="0"
            />
          </Col>
          <Col>
            <span className="align-middle">{t('hours', 'heures')}</span>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'poids': (
      <Form.Group key="poids">
        <Form.Label>⚖️ {t('weight', 'Poids')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="poids"
              value={postData.poids || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 1.5"
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <span className="align-middle">kg</span>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'connectivite': (
      <Form.Group key="connectivite">
        <Form.Label>🔌 {t('connectivity', 'Connectivité')}</Form.Label>
        <div className="border rounded p-3 bg-light">
          {[
            { id: 'usb_c', name: 'connectivite_usb_c', label: 'USB-C' },
            { id: 'usb_a', name: 'connectivite_usb_a', label: 'USB-A' },
            { id: 'hdmi', name: 'connectivite_hdmi', label: 'HDMI' },
            { id: 'displayport', name: 'connectivite_displayport', label: 'DisplayPort' },
            { id: 'thunderbolt', name: 'connectivite_thunderbolt', label: 'Thunderbolt' },
            { id: 'ethernet', name: 'connectivite_ethernet', label: 'Ethernet' },
            { id: 'wifi6', name: 'connectivite_wifi6', label: 'Wi-Fi 6' },
            { id: 'bluetooth', name: 'connectivite_bluetooth', label: 'Bluetooth 5.0+' },
            { id: 'audio', name: 'connectivite_audio', label: 'Audio jack 3.5mm' },
            { id: 'vga', name: 'connectivite_vga', label: 'VGA' },
            { id: 'dvi', name: 'connectivite_dvi', label: 'DVI' },
            { id: 'sd_card', name: 'connectivite_sd_card', label: 'Lecteur SD Card' },
            { id: 'mini_displayport', name: 'connectivite_mini_displayport', label: 'Mini DisplayPort' },
            { id: 'usb_3', name: 'connectivite_usb_3', label: 'USB 3.0+' },
            { id: 'type_c', name: 'connectivite_type_c', label: 'Type-C' },
            { id: 'rj45', name: 'connectivite_rj45', label: 'RJ45' },
            { id: 'kensington', name: 'connectivite_kensington', label: 'Kensington Lock' },
          ].map(conn => (
            <Form.Check
              key={conn.id}
              type="checkbox"
              id={`connectivite_${conn.id}`}
              name={conn.name}
              label={conn.label}
              checked={postData[conn.name] || false}
              onChange={handleChangeInput}
              className="mb-2"
            />
          ))}
        </div>
        
        {/* Campo adicional para otras conexiones */}
        <div className="mt-3">
          <Form.Label className="small">
            <i className="fas fa-plus-circle me-1"></i>
            {t('other_connections', 'Autres connectivités')}
          </Form.Label>
          <Form.Control
            type="text"
            name="connectivite_autres"
            value={postData.connectivite_autres || ''}
            onChange={handleChangeInput}
            placeholder={t('enter_other_connections', 'Ex: eSATA, FireWire, etc.')}
            className="small"
          />
        </div>
      </Form.Group>
    ),
    'anneeFabrication': (
      <Form.Group key="anneeFabrication">
        <Form.Label>📅 {t('manufacturing_year', 'Année de fabrication')}</Form.Label>
        <Form.Control
          type="number"
          name="anneeFabrication"
          value={postData.anneeFabrication || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 2023"
          min="2000"
          max={new Date().getFullYear()}
        />
      </Form.Group>
    ),
    
    'garantie': (
      <Form.Group key="garantie">
        <Form.Label>🛡️ {t('warranty', 'Garantie')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="garantie"
              value={postData.garantie || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 12"
              min="0"
            />
          </Col>
          <Col>
            <span className="align-middle">{t('months', 'mois')}</span>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'etatBatterie': (
      <Form.Group key="etatBatterie">
        <Form.Label>🔋 {t('battery_health', 'État de la batterie')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="etatBatterie"
              value={postData.etatBatterie || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 85"
              min="0"
              max="100"
            />
          </Col>
          <Col>
            <span className="align-middle">%</span>
          </Col>
        </Row>
        <Form.Text className="text-muted">
          💡 {t('battery_health_tip', 'Capacité restante de la batterie')}
        </Form.Text>
      </Form.Group>
    ),
    
    // ✅ CONTINÚA AGREGANDO TODOS LOS DEMÁS CAMPOS QUE FALTAN...
    
    // Campo 'typeServeur' (ejemplo):
    'typeServeur': (
      <Form.Group key="typeServeur">
        <Form.Label>🗄️ {t('server_type', 'Type de serveur')}</Form.Label>
        <Form.Select
          name="typeServeur"
          value={postData.typeServeur || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_server_type', 'Sélectionnez type')}</option>
          <option value="rack">Serveur rack</option>
          <option value="tour">Serveur tour</option>
          <option value="blade">Serveur blade</option>
          <option value="microserveur">Microserveur</option>
          <option value="nas">NAS</option>
          <option value="stockage">Serveur de stockage</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Campo 'typeComposant' (ejemplo):
    'typeComposant': (
      <Form.Group key="typeComposant">
        <Form.Label>⚙️ {t('component_type', 'Type de composant')}</Form.Label>
        <Form.Select
          name="typeComposant"
          value={postData.typeComposant || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_component_type', 'Sélectionnez type')}</option>
          <option value="carte_mere">Carte mère</option>
          <option value="carte_graphique">Carte graphique</option>
          <option value="processeur">Processeur</option>
          <option value="ram">Mémoire RAM</option>
          <option value="disque_dur">Disque dur</option>
          <option value="ssd">SSD</option>
          <option value="alimentation">Alimentation</option>
          <option value="boitier">Boîtier</option>
          <option value="ventilateur">Ventilateur</option>
          <option value="watercooling">Watercooling</option>
          <option value="carte_son">Carte son</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Campo 'hauteurU':
    'hauteurU': (
      <Form.Group key="hauteurU">
        <Form.Label>📏 {t('height_u', 'Hauteur (U)')}</Form.Label>
        <Form.Select
          name="hauteurU"
          value={postData.hauteurU || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_height', 'Sélectionnez hauteur')}</option>
          <option value="1">1U</option>
          <option value="2">2U</option>
          <option value="3">3U</option>
          <option value="4">4U</option>
          <option value="5">5U</option>
          <option value="6">6U</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Campo 'typeBoitier':
    'typeBoitier': (
      <Form.Group key="typeBoitier">
        <Form.Label>🖥️ {t('case_type', 'Type de boîtier')}</Form.Label>
        <Form.Select
          name="typeBoitier"
          value={postData.typeBoitier || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_case_type', 'Sélectionnez type')}</option>
          <option value="tour">Tour</option>
          <option value="mini_tour">Mini tour</option>
          <option value="slim">Slim</option>
          <option value="all_in_one">All-in-One</option>
          <option value="barebone">Barebone</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Campo 'alimentation':
    'alimentation': (
      <Form.Group key="alimentation">
        <Form.Label>⚡ {t('power_supply', 'Alimentation')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="alimentation"
              value={postData.alimentation || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 500"
              min="0"
            />
          </Col>
          <Col>
            <span className="align-middle">W</span>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    // Campo 'typeRack':
    'typeRack': (
      <Form.Group key="typeRack">
        <Form.Label>🗄️ {t('rack_type', 'Type de rack')}</Form.Label>
        <Form.Select
          name="typeRack"
          value={postData.typeRack || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_rack_type', 'Sélectionnez type')}</option>
          <option value="19">Rack 19"</option>
          <option value="10">Rack 10"</option>
          <option value="rackable">Rackable</option>
          <option value="tower_rackable">Tour rackable</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Campo 'tempsReponse':
    'tempsReponse': (
      <Form.Group key="tempsReponse">
        <Form.Label>⚡ {t('response_time', 'Temps de réponse')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="tempsReponse"
              value={postData.tempsReponse || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 1"
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <span className="align-middle">ms</span>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    // Campo 'frequenceRafraichissement':
    'frequenceRafraichissement': (
      <Form.Group key="frequenceRafraichissement">
        <Form.Label>🔄 {t('refresh_rate', 'Fréquence de rafraîchissement')}</Form.Label>
        <Form.Select
          name="frequenceRafraichissement"
          value={postData.frequenceRafraichissement || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_refresh_rate', 'Sélectionnez fréquence')}</option>
          <option value="60">60 Hz</option>
          <option value="75">75 Hz</option>
          <option value="120">120 Hz</option>
          <option value="144">144 Hz</option>
          <option value="165">165 Hz</option>
          <option value="240">240 Hz</option>
          <option value="360">360 Hz</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'courbure': (
      <Form.Group key="courbure">
        <Form.Label>🔄 {t('curvature', 'Courbure')}</Form.Label>
        <Form.Select
          name="courbure"
          value={postData.courbure || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_curvature', 'Sélectionnez')}</option>
          <option value="plat">Plat</option>
          <option value="1500r">1500R</option>
          <option value="1800r">1800R</option>
          <option value="1000r">1000R</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Campo 'compatible':
    'compatible': (
      <Form.Group key="compatible">
        <Form.Label>🔗 {t('compatible_with', 'Compatible avec')}</Form.Label>
        <Form.Control
          type="text"
          name="compatible"
          value={postData.compatible || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_compatible', 'Ex: Intel LGA 1700, AM4, DDR4...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Campo 'capacite':
    'capacite': (
      <Form.Group key="capacite">
        <Form.Label>💾 {t('capacity', 'Capacité')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="capacite"
              value={postData.capacite || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 500"
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="capaciteUnite"
              value={postData.capaciteUnite || 'gb'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="gb">GB</option>
              <option value="tb">TB</option>
              <option value="mb">MB</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    // Campo 'vitesse':
    'vitesse': (
      <Form.Group key="vitesse">
        <Form.Label>⚡ {t('speed', 'Vitesse')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="vitesse"
              value={postData.vitesse || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 3200"
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="vitesseUnite"
              value={postData.vitesseUnite || 'mhz'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="mhz">MHz</option>
              <option value="ghz">GHz</option>
              <option value="mbps">Mbps</option>
              <option value="gbps">Gbps</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    // Campo 'interface':
    'interface': (
      <Form.Group key="interface">
        <Form.Label>🔌 {t('interface', 'Interface')}</Form.Label>
        <Form.Select
          name="interface"
          value={postData.interface || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_interface', 'Sélectionnez interface')}</option>
          <option value="sata">SATA</option>
          <option value="sata3">SATA III</option>
          <option value="nvme">NVMe</option>
          <option value="pcie3">PCIe 3.0</option>
          <option value="pcie4">PCIe 4.0</option>
          <option value="pcie5">PCIe 5.0</option>
          <option value="usb3">USB 3.0</option>
          <option value="usb_c">USB-C</option>
          <option value="thunderbolt">Thunderbolt</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Campo 'etat' (genérico):
    'etat': (
      <Form.Group key="etat">
        <Form.Label>🔄 {t('condition', 'État')}</Form.Label>
        <Form.Select
          name="etat"
          value={postData.etat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez état')}</option>
          <option value="neuf">🆕 Neuf</option>
          <option value="tres_bon">👍 Très bon état</option>
          <option value="bon">✅ Bon état</option>
          <option value="moyen">🔄 État moyen</option>
          <option value="pour_pieces">⚙️ Pour pièces</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // ✅ CONTINÚA CON TODOS LOS DEMÁS CAMPOS...
    // Debes agregar TODOS los campos que aparecen en getSubCategorySpecificFields()
    
  };
  
  // Lógica de renderizado CORREGIDA
  const subCategoryFields = getSubCategorySpecificFields();
  
 
  
  // Si se solicita un campo específico
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    if (!fieldComponent) {
      console.error(`❌ Campo '${fieldName}' no encontrado en InformatiqueFields`);
      return (
        <div className="alert alert-danger">
          <strong>Error:</strong> Campo '{fieldName}' no está definido para informatique.
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
        <strong>💻 Información:</strong> Selecciona una subcategoría d'informatique para ver los campos específicos.
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

export default InformatiqueFields;