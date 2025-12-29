import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Accordion, Card, Button, Form, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronDown } from 'react-bootstrap-icons';

// 🔄 Lazy load de componentes de subcategorías
const VehiculesSubcategories = lazy(() => import('./specificFields/VehiculesFields'));
const VetementsSubcategories = lazy(() => import('./specificFields/VetementsFields'));
const TelephonesSubcategories = lazy(() => import('./specificFields/TelephonesFields'));
const InformatiqueSubcategories = lazy(() => import('./specificFields/InformatiqueFields'));
const ElectromenagerSubcategories = lazy(() => import('./specificFields/ElectromenagerFields'));
const PiecesDetacheesSubcategories = lazy(() => import('./specificFields/PiecesDetacheesFields'));
const SanteBeauteSubcategories = lazy(() => import('./specificFields/SanteBeauteFields'));
const MeublesSubcategories = lazy(() => import('./specificFields/MeublesFields'));
const LoisirsSubcategories = lazy(() => import('./specificFields/LoisirsFields'));
const SportSubcategories = lazy(() => import('./specificFields/SportFields'));
const AlimentairesSubcategories = lazy(() => import('./specificFields/AlimentairesFields'));
const ServicesSubcategories = lazy(() => import('./specificFields/ServicesFields'));
const MateriauxSubcategories = lazy(() => import('./specificFields/MateriauxFields'));
const VoyagesSubcategories = lazy(() => import('./specificFields/VoyagesFields'));
const EmploiSubcategories = lazy(() => import('./specificFields/EmploiFields'));

const CategoryAccordion = ({ postData, handleChangeInput }) => {
  const { t, i18n } = useTranslation(['subcategories']);
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKey, setActiveKey] = useState(null);
  const [localPostData, setLocalPostData] = useState(postData);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [loadedComponents, setLoadedComponents] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // 🔄 Detectar si es móvil/Android
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 🔄 Sincronizar con cambios externos
  useEffect(() => {
    console.log('🔄 Accordion recibió postData:', postData);
    setLocalPostData(postData);
    
    // Expandir automáticamente si hay categoría seleccionada
    if (postData.categorie && !activeKey) {
      setActiveKey(postData.categorie);
    }
    
    // Si es immobilier y hay articleType, actualizar selectedOperation
    if (postData.categorie === 'immobilier' && postData.articleType) {
      setSelectedOperation(postData.articleType);
    }
  }, [postData]);

  // 🔄 Cargar componente bajo demanda
  const loadComponent = (categoryId) => {
    if (!loadedComponents[categoryId]) {
      setLoadedComponents(prev => ({ ...prev, [categoryId]: true }));
    }
  };

  // Mapeo de categorías a emojis
  const categoryEmojis = {
    'immobilier': '🏠',
    'vehicules': '🚗',
    'telephones': '📱',
    'informatique': '💻',
    'electromenager': '🔌',
    'piecesDetachees': '⚙️',
    'vetements': '👕',
    'alimentaires': '🍎',
    'santebeaute': '💄',
    'meubles': '🛋️',
    'services': '🛠️',
    'materiaux': '🧱',
    'loisirs': '🎮',
    'emploi': '💼',
    'sport': '⚽',
    'voyages': '✈️'
  };

  // Datos de categorías principales
  const categories = [
    { id: 'immobilier', name: t('immobilier', { ns: 'categories' }) },
    { id: 'vehicules', name: t('automobiles', { ns: 'categories' }) },
    { id: 'telephones', name: t('telephones', { ns: 'categories' }) },
    { id: 'informatique', name: t('informatique', { ns: 'categories' }) },
    { id: 'electromenager', name: t('electromenager', { ns: 'categories' }) },
    { id: 'piecesDetachees', name: t('piecesDetachees', { ns: 'categories' }) },
    { id: 'vetements', name: t('vetements', { ns: 'categories' }) },
    { id: 'alimentaires', name: t('Alimentaires', { ns: 'categories' }) },
    { id: 'santebeaute', name: t('sante_beaute', { ns: 'categories' }) },
    { id: 'meubles', name: t('meubles', { ns: 'categories' }) },
    { id: 'services', name: t('Services', { ns: 'categories' }) },
    { id: 'materiaux', name: t('Materiaux', { ns: 'categories' }) },
    { id: 'loisirs', name: t('loisirs', { ns: 'categories' }) },
    { id: 'emploi', name: t('emploi', { ns: 'categories' }) },
    { id: 'sport', name: t('Sport', { ns: 'categories' }) },
    { id: 'voyages', name: t('Voyage', { ns: 'categories' }) }
  ];

  // 🆕 DATOS DE SUBCATEGORÍAS POR CATEGORÍA PRINCIPAL
  const subcategoriesByCategory = {
    // Vehículos
    vehicules: [
      { id: 'automobiles', name: t('vehicules.categories.voitures'), icon: <span style={{ fontSize: '24px' }}>🚗</span>, color: 'primary' },
      { id: 'utilitaires', name: t('vehicules.categories.utilitaire'), icon: <span style={{ fontSize: '24px' }}>🚐</span>, color: 'secondary' },
      { id: 'motos', name: t('vehicules.categories.motos'), icon: <span style={{ fontSize: '24px' }}>🏍️</span>, color: 'success' },
      { id: 'quads', name: t('vehicules.categories.quads'), icon: <span style={{ fontSize: '24px' }}>🛵</span>, color: 'warning' },
      { id: 'fourgons', name: t('vehicules.categories.fourgon'), icon: <span style={{ fontSize: '24px' }}>🚚</span>, color: 'info' },
      { id: 'camions', name: t('vehicules.categories.camion'), icon: <span style={{ fontSize: '24px' }}>🚛</span>, color: 'dark' },
      { id: 'bus', name: t('vehicules.categories.bus'), icon: <span style={{ fontSize: '24px' }}>🚌</span>, color: 'danger' },
      { id: 'engins', name: t('vehicules.categories.engin'), icon: <span style={{ fontSize: '24px' }}>⚙️</span>, color: 'primary' },
      { id: 'tracteurs', name: t('vehicules.categories.tracteurs'), icon: <span style={{ fontSize: '24px' }}>🚜</span>, color: 'success' },
      { id: 'remorques', name: t('vehicules.categories.remorques'), icon: <span style={{ fontSize: '24px' }}>🚛</span>, color: 'secondary' },
      { id: 'bateaux', name: t('vehicules.categories.bateaux'), icon: <span style={{ fontSize: '24px' }}>🚤</span>, color: 'info' }
      ],
    
    // Ropa
    vetements: [
      { id: 'vetements_homme', name: t('vetements.categories.vetements_homme'), icon: '👔', color: 'primary' },
      { id: 'vetements_femme', name: t('vetements.categories.vetements_femme'), icon: '👗', color: 'danger' },
      { id: 'chaussures_homme', name: t('vetements.categories.chaussures_homme'), icon: '👞', color: 'secondary' },
      { id: 'chaussures_femme', name: t('vetements.categories.chaussures_femme'), icon: '👠', color: 'warning' },
      { id: 'garcons', name: t('vetements.categories.garcons'), icon: '👦', color: 'info' },
      { id: 'filles', name: t('vetements.categories.filles'), icon: '👧', color: 'danger' },
      { id: 'bebe', name: t('vetements.categories.bebe'), icon: '👶', color: 'success' },
      { id: 'tenues_pro', name: t('vetements.categories.tenues_pro'), icon: '👔', color: 'dark' },
      { id: 'sacs', name: t('vetements.categories.sacs'), icon: '👜', color: 'warning' },
      { id: 'montres', name: t('vetements.categories.montres'), icon: '⌚', color: 'secondary' },
      { id: 'lunettes', name: t('vetements.categories.lunettes'), icon: '👓', color: 'info' },
      { id: 'bijoux', name: t('vetements.categories.bijoux'), icon: '💎', color: 'primary' }
    ],
    
    // Teléfonos
    telephones: [
      {
        id: 'smartphones',
        name: t('telephones.categories.smartphones'),
        icon: <img src='/category/00.png' width={32} height={32} style={{objectFit: 'contain'}} />,
        color: 'primary',
        
      },
      {
        id: 'smartphones',
        name: t('telephones.categories.smartphones'),
        icon: <img src="/categroy/01.png" width={32} height={32} style={{objectFit: 'contain'}} />,
        color: 'primary',
        
      },

      { id: 'smartphones', name: t('telephones.categories.smartphones'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>📱</span>, color: 'primary', emoji: '📱' },
      { id: 'telephones_cellulaires', name: t('telephones.categories.telephones_cellulaires'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>📞</span>, color: 'secondary', emoji: '📞' },
      { id: 'tablettes', name: t('telephones.categories.tablettes'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>📟</span>, color: 'success', emoji: '📟' },
      { id: 'fixes_fax', name: t('telephones.categories.fixes_fax'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>☎️</span>, color: 'warning', emoji: '☎️' },
      { id: 'smartwatchs', name: t('telephones.categories.smartwatchs'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>⌚</span>, color: 'info', emoji: '⌚' },
      { id: 'protection_antichoc', name: t('telephones.categories.protection_antichoc'), icon: <span style={{ fontSize: '24px', color: '#343a40' }}>🛡️</span>, color: 'dark', emoji: '🛡️' },
      { id: 'ecouteurs_son', name: t('telephones.categories.ecouteurs_son'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🎧</span>, color: 'primary', emoji: '🎧' },
      { id: 'chargeurs_cables', name: t('telephones.categories.chargeurs_cables'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>⚡</span>, color: 'warning', emoji: '⚡' },
      { id: 'supports_stabilisateurs', name: t('telephones.categories.supports_stabilisateurs'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>📐</span>, color: 'secondary', emoji: '📐' },
      { id: 'manettes', name: t('telephones.categories.manettes'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🎮</span>, color: 'danger', emoji: '🎮' },
      { id: 'vr', name: t('telephones.categories.vr'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🥽</span>, color: 'info', emoji: '🥽' },
      { id: 'power_banks', name: t('telephones.categories.power_banks'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🔋</span>, color: 'success', emoji: '🔋' },
      { id: 'stylets', name: t('telephones.categories.stylets'), icon: <span style={{ fontSize: '24px', color: '#343a40' }}>✏️</span>, color: 'dark', emoji: '✏️' },
      { id: 'cartes_memoire', name: t('telephones.categories.cartes_memoire'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>💾</span>, color: 'primary', emoji: '💾' },
      { id: 'accessoires', name: t('telephones.categories.accessoires'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🎁</span>, color: 'secondary', emoji: '🎁' },
      { id: 'pieces_rechange', name: t('telephones.categories.pieces_rechange'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🔧</span>, color: 'warning', emoji: '🔧' },
      { id: 'offres_abonnements', name: t('telephones.categories.offres_abonnements'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>📅</span>, color: 'info', emoji: '📅' }
    ],
    
    // Informática
    informatique: [
      { id: 'ordinateurs_portables', name: t('informatique.categories.ordinateurs_portables'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>💻</span>, color: 'primary', emoji: '💻' },
      { id: 'ordinateurs_bureau', name: t('informatique.categories.ordinateurs_bureau'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🖥️</span>, color: 'secondary', emoji: '🖥️' },
      { id: 'serveurs', name: t('informatique.categories.serveurs'), icon: <span style={{ fontSize: '24px', color: '#343a40' }}>🗄️</span>, color: 'dark', emoji: '🗄️' },
      { id: 'ecrans', name: t('informatique.categories.ecrans'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🖥️</span>, color: 'info', emoji: '🖥️' },
      { id: 'composants_pc_fixe', name: t('informatique.categories.composants_pc_fixe'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>⚙️</span>, color: 'warning', emoji: '⚙️' },
      { id: 'composants_pc_portable', name: t('informatique.categories.composants_pc_portable'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>💻</span>, color: 'success', emoji: '💻' },
      { id: 'composants_serveur', name: t('informatique.categories.composants_serveur'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>💽</span>, color: 'danger', emoji: '💽' },
      { id: 'imprimantes_cartouches', name: t('informatique.categories.imprimantes_cartouches'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🖨️</span>, color: 'primary', emoji: '🖨️' },
      { id: 'reseau_connexion', name: t('informatique.categories.reseau_connexion'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>📡</span>, color: 'info', emoji: '📡' },
      { id: 'stockage_externe_racks', name: t('informatique.categories.stockage_externe_racks'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>💾</span>, color: 'secondary', emoji: '💾' },
      { id: 'onduleurs_stabilisateurs', name: t('informatique.categories.onduleurs_stabilisateurs'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🔌</span>, color: 'warning', emoji: '🔌' },
      { id: 'compteuses_billets', name: t('informatique.categories.compteuses_billets'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>💰</span>, color: 'success', emoji: '💰' },
      { id: 'claviers_souris', name: t('informatique.categories.claviers_souris'), icon: <span style={{ fontSize: '24px', color: '#343a40' }}>⌨️</span>, color: 'dark', emoji: '⌨️' },
      { id: 'casques_son', name: t('informatique.categories.casques_son'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🎧</span>, color: 'primary', emoji: '🎧' },
      { id: 'webcam_videoconference', name: t('informatique.categories.webcam_videoconference'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>📹</span>, color: 'info', emoji: '📹' },
      { id: 'data_shows', name: t('informatique.categories.data_shows'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>📽️</span>, color: 'secondary', emoji: '📽️' },
      { id: 'cables_adaptateurs', name: t('informatique.categories.cables_adaptateurs'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🔌</span>, color: 'warning', emoji: '🔌' },
      { id: 'stylets_tablettes', name: t('informatique.categories.stylets_tablettes'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>✏️</span>, color: 'success', emoji: '✏️' },
      { id: 'cartables_sacoches', name: t('informatique.categories.cartables_sacoches'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>💼</span>, color: 'primary', emoji: '💼' },
      { id: 'manettes_simulateurs', name: t('informatique.categories.manettes_simulateurs'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🎮</span>, color: 'danger', emoji: '🎮' },
      { id: 'vr', name: t('informatique.categories.vr'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🥽</span>, color: 'info', emoji: '🥽' }
     ],
    
    // Electrodomésticos
    electromenager: [
      { id: 'televiseurs', name: t('electromenager.categories.televiseurs'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>📺</span>, color: 'primary', emoji: '📺' },
      { id: 'demodulateurs_box_tv', name: t('electromenager.categories.demodulateurs_box_tv'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>📦</span>, color: 'secondary', emoji: '📦' },
      { id: 'paraboles_switch_tv', name: t('electromenager.categories.paraboles_switch_tv'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🛰️</span>, color: 'success', emoji: '🛰️' },
      { id: 'abonnements_iptv', name: t('electromenager.categories.abonnements_iptv'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>📅</span>, color: 'info', emoji: '📅' },
      { id: 'cameras_accessories', name: t('electromenager.categories.cameras_accessories'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>📷</span>, color: 'warning', emoji: '📷' },
      { id: 'audio', name: t('electromenager.categories.audio'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🔊</span>, color: 'danger', emoji: '🔊' },
      { id: 'refrigerateurs_congelateurs', name: t('electromenager.categories.refrigerateurs_congelateurs'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>❄️</span>, color: 'primary', emoji: '❄️' },
      { id: 'machines_laver', name: t('electromenager.categories.machines_laver'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🧼</span>, color: 'info', emoji: '🧼' },
      { id: 'lave_vaisselles', name: t('electromenager.categories.lave_vaisselles'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🍽️</span>, color: 'secondary', emoji: '🍽️' },
      { id: 'fours_cuisson', name: t('electromenager.categories.fours_cuisson'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🔥</span>, color: 'warning', emoji: '🔥' },
      { id: 'chauffage_climatisation', name: t('electromenager.categories.chauffage_climatisation'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🌡️</span>, color: 'success', emoji: '🌡️' },
      { id: 'appareils_cuisine', name: t('electromenager.categories.appareils_cuisine'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🍳</span>, color: 'danger', emoji: '🍳' },
      { id: 'aspirateurs_nettoyeurs', name: t('electromenager.categories.aspirateurs_nettoyeurs'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🧹</span>, color: 'primary', emoji: '🧹' },
      { id: 'repassage', name: t('electromenager.categories.repassage'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>♨️</span>, color: 'warning', emoji: '♨️' },
      { id: 'beaute_hygiene', name: t('electromenager.categories.beaute_hygiene'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>💄</span>, color: 'info', emoji: '💄' },
      { id: 'machines_coudre', name: t('electromenager.categories.machines_coudre'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🧵</span>, color: 'secondary', emoji: '🧵' },
      { id: 'telecommandes', name: t('electromenager.categories.telecommandes'), icon: <span style={{ fontSize: '24px', color: '#343a40' }}>📱</span>, color: 'dark', emoji: '📱' },
      { id: 'securite_gps', name: t('electromenager.categories.securite_gps'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🔒</span>, color: 'primary', emoji: '🔒' },
      { id: 'composants_electroniques', name: t('electromenager.categories.composants_electroniques'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🔌</span>, color: 'warning', emoji: '🔌' },
      { id: 'pieces_rechange', name: t('electromenager.categories.pieces_rechange'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🔧</span>, color: 'secondary', emoji: '🔧' },
      { id: 'autre', name: t('electromenager.categories.autre'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>❓</span>, color: 'info', emoji: '❓' }
    ],
    
    // Piezas de recambio
    piecesDetachees: [
      { id: 'pieces_automobiles', name: t('pieces_detachees.categories.pieces_automobiles'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🚗</span>, color: 'primary', emoji: '🚗' },
    { id: 'pieces_vehicules', name: t('pieces_detachees.categories.pieces_vehicules'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🚚</span>, color: 'secondary', emoji: '🚚' },
    { id: 'pieces_moto', name: t('pieces_detachees.categories.pieces_moto'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🏍️</span>, color: 'danger', emoji: '🏍️' },
    { id: 'pieces_bateaux', name: t('pieces_detachees.categories.pieces_bateaux'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🛥️</span>, color: 'info', emoji: '🛥️' },
    { id: 'alarme_securite', name: t('pieces_detachees.categories.alarme_securite'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🚨</span>, color: 'warning', emoji: '🚨' },
    { id: 'nettoyage_entretien', name: t('pieces_detachees.categories.nettoyage_entretien'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🧼</span>, color: 'success', emoji: '🧼' },
    { id: 'outils_diagnostics', name: t('pieces_detachees.categories.outils_diagnostics'), icon: <span style={{ fontSize: '24px', color: '#343a40' }}>🔧</span>, color: 'dark', emoji: '🔧' },
    { id: 'lubrifiants', name: t('pieces_detachees.categories.lubrifiants'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🛢️</span>, color: 'primary', emoji: '🛢️' }
    ],
    
    // Salud y belleza
    santebeaute: [
      { id: 'cosmetiques_beaute', name: t('sante_beaute.categories.cosmetiques_beaute'), icon: <span style={{ fontSize: '24px', color: '#e83e8c' }}>💄</span>, color: 'pink', emoji: '💄' },
      { id: 'parfums_deodorants_femme', name: t('sante_beaute.categories.parfums_deodorants_femme'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🌸</span>, color: 'danger', emoji: '🌸' },
      { id: 'parfums_deodorants_homme', name: t('sante_beaute.categories.parfums_deodorants_homme'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🌿</span>, color: 'primary', emoji: '🌿' },
      { id: 'parapharmacie_sante', name: t('sante_beaute.categories.parapharmacie_sante'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>💊</span>, color: 'success', emoji: '💊' }
      ],
    
    // Muebles
    meubles: [
      { id: 'meubles_maison', name: t('meubles.categories.meubles_maison'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🛋️</span>, color: 'primary', emoji: '🛋️' },
      { id: 'decoration', name: t('meubles.categories.decoration'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🎨</span>, color: 'warning', emoji: '🎨' },
      { id: 'vaisselle', name: t('meubles.categories.vaisselle'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🍽️</span>, color: 'info', emoji: '🍽️' },
      { id: 'meubles_bureau', name: t('meubles.categories.meubles_bureau'), icon: <span style={{ fontSize: '24px', color: '#343a40' }}>💼</span>, color: 'dark', emoji: '💼' },
      { id: 'rideaux', name: t('meubles.categories.rideaux'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🪟</span>, color: 'success', emoji: '🪟' },
      { id: 'literie_linge', name: t('meubles.categories.literie_linge'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🛏️</span>, color: 'secondary', emoji: '🛏️' },
      { id: 'puericulture', name: t('meubles.categories.puericulture'), icon: <span style={{ fontSize: '24px', color: '#e83e8c' }}>👶</span>, color: 'pink', emoji: '👶' },
      { id: 'tapis_moquettes', name: t('meubles.categories.tapis_moquettes'), icon: <span style={{ fontSize: '24px', color: '#795548' }}>🧶</span>, color: 'brown', emoji: '🧶' },
      { id: 'meubles_exterieur', name: t('meubles.categories.meubles_exterieur'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🌳</span>, color: 'success', emoji: '🌳' },
      { id: 'fournitures_scolaires', name: t('meubles.categories.fournitures_scolaires'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>📚</span>, color: 'info', emoji: '📚' },
      { id: 'luminaire', name: t('meubles.categories.luminaire'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>💡</span>, color: 'warning', emoji: '💡' },
      { id: 'autre', name: t('meubles.categories.autre'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>📦</span>, color: 'secondary', emoji: '📦' }
      ],
    
    // Ocio
    loisirs: [
      { id: 'animalerie', name: t('loisirs.categories.animalerie'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🐾</span>, color: 'success', emoji: '🐾' },
      { id: 'consoles_jeux_videos', name: t('loisirs.categories.consoles_jeux_videos'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🎮</span>, color: 'primary', emoji: '🎮' },
      { id: 'livres_magazines', name: t('loisirs.categories.livres_magazines'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>📚</span>, color: 'info', emoji: '📚' },
      { id: 'instruments_musique', name: t('loisirs.categories.instruments_musique'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🎸</span>, color: 'warning', emoji: '🎸' },
      { id: 'jeux_loisirs', name: t('loisirs.categories.jeux_loisirs'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🎲</span>, color: 'danger', emoji: '🎲' },
      { id: 'jouets', name: t('loisirs.categories.jouets'), icon: <span style={{ fontSize: '24px', color: '#e83e8c' }}>🧸</span>, color: 'pink', emoji: '🧸' },
      { id: 'chasse_peche', name: t('loisirs.categories.chasse_peche'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🎣</span>, color: 'success', emoji: '🎣' },
      { id: 'jardinage', name: t('loisirs.categories.jardinage'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🌻</span>, color: 'green', emoji: '🌻' },
      { id: 'antiquites_collections', name: t('loisirs.categories.antiquites_collections'), icon: <span style={{ fontSize: '24px', color: '#795548' }}>🏺</span>, color: 'brown', emoji: '🏺' },
      { id: 'barbecue_grillades', name: t('loisirs.categories.barbecue_grillades'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🍖</span>, color: 'danger', emoji: '🍖' },
      { id: 'vapes_chichas', name: t('loisirs.categories.vapes_chichas'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>💨</span>, color: 'secondary', emoji: '💨' },
      { id: 'produits_accesoires_ete', name: t('loisirs.categories.produits_accesoires_ete'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🏖️</span>, color: 'warning', emoji: '🏖️' },
      { id: 'autre', name: t('loisirs.categories.autre'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🎭</span>, color: 'secondary', emoji: '🎭' }
      ],
    
    // Deporte
    sport: [
      { id: 'football', name: t('sport.categories.football'), icon: <span style={{ fontSize: '24px' }}>⚽</span>, color: 'success', emoji: '⚽' },
      { id: 'hand_voley_basket', name: t('sport.categories.hand_voley_basket'), icon: <span style={{ fontSize: '24px' }}>🏀</span>, color: 'primary', emoji: '🏀' },
      { id: 'sport_combat', name: t('sport.categories.sport_combat'), icon: <span style={{ fontSize: '24px' }}>🥊</span>, color: 'danger', emoji: '🥊' },
      { id: 'fitness_musculation', name: t('sport.categories.fitness_musculation'), icon: <span style={{ fontSize: '24px' }}>💪</span>, color: 'warning', emoji: '💪' },
      { id: 'natation', name: t('sport.categories.natation'), icon: <span style={{ fontSize: '24px' }}>🏊</span>, color: 'info', emoji: '🏊' },
      { id: 'velos_trotinettes', name: t('sport.categories.velos_trotinettes'), icon: <span style={{ fontSize: '24px' }}>🚲</span>, color: 'secondary', emoji: '🚲' },
      { id: 'sports_raquette', name: t('sport.categories.sports_raquette'), icon: <span style={{ fontSize: '24px' }}>🎾</span>, color: 'success', emoji: '🎾' },
      { id: 'sport_aquatiques', name: t('sport.categories.sport_aquatiques'), icon: <span style={{ fontSize: '24px' }}>🚤</span>, color: 'info', emoji: '🚤' }
      ],
    
    // Alimentación
    alimentaires: [
      { id: 'produits_laitiers', name: t('alimentaires.categories.produits_laitiers'), icon: <span style={{ fontSize: '24px', color: '#f8f9fa' }}>🥛</span>, color: 'light', emoji: '🥛' },
    { id: 'fruits_secs', name: t('alimentaires.categories.fruits_secs'), icon: <span style={{ fontSize: '24px', color: '#795548' }}>🥜</span>, color: 'brown', emoji: '🥜' },
    { id: 'graines_riz_cereales', name: t('alimentaires.categories.graines_riz_cereales'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🌾</span>, color: 'warning', emoji: '🌾' },
    { id: 'sucres_produits_sucres', name: t('alimentaires.categories.sucres_produits_sucres'), icon: <span style={{ fontSize: '24px', color: '#e83e8c' }}>🍬</span>, color: 'pink', emoji: '🍬' },
    { id: 'boissons', name: t('alimentaires.categories.boissons'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🥤</span>, color: 'info', emoji: '🥤' },
    { id: 'viandes_poissons', name: t('alimentaires.categories.viandes_poissons'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🍖</span>, color: 'danger', emoji: '🍖' },
    { id: 'cafe_the_infusion', name: t('alimentaires.categories.cafe_the_infusion'), icon: <span style={{ fontSize: '24px', color: '#795548' }}>☕</span>, color: 'brown', emoji: '☕' },
    { id: 'complements_alimentaires', name: t('alimentaires.categories.complements_alimentaires'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>💊</span>, color: 'success', emoji: '💊' },
    { id: 'miel_derives', name: t('alimentaires.categories.miel_derives'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🍯</span>, color: 'warning', emoji: '🍯' },
    { id: 'fruits_legumes', name: t('alimentaires.categories.fruits_legumes'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🍎</span>, color: 'success', emoji: '🍎' },
    { id: 'ble_farine', name: t('alimentaires.categories.ble_farine'), icon: <span style={{ fontSize: '24px', color: '#f8f9fa' }}>🌾</span>, color: 'light', emoji: '🌾' },
    { id: 'bonbons_chocolat', name: t('alimentaires.categories.bonbons_chocolat'), icon: <span style={{ fontSize: '24px', color: '#795548' }}>🍫</span>, color: 'brown', emoji: '🍫' },
    { id: 'boulangerie_viennoiserie', name: t('alimentaires.categories.boulangerie_viennoiserie'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🥐</span>, color: 'warning', emoji: '🥐' },
    { id: 'ingredients_cuisine_patisserie', name: t('alimentaires.categories.ingredients_cuisine_patisserie'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🧂</span>, color: 'secondary', emoji: '🧂' },
    { id: 'noix_graines', name: t('alimentaires.categories.noix_graines'), icon: <span style={{ fontSize: '24px', color: '#795548' }}>🌰</span>, color: 'brown', emoji: '🌰' },
    { id: 'plats_cuisines', name: t('alimentaires.categories.plats_cuisines'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🍲</span>, color: 'danger', emoji: '🍲' },
    { id: 'sauces_epices_condiments', name: t('alimentaires.categories.sauces_epices_condiments'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🌶️</span>, color: 'warning', emoji: '🌶️' },
    { id: 'oeufs', name: t('alimentaires.categories.oeufs'), icon: <span style={{ fontSize: '24px', color: '#f8f9fa' }}>🥚</span>, color: 'light', emoji: '🥚' },
    { id: 'huiles', name: t('alimentaires.categories.huiles'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🫒</span>, color: 'warning', emoji: '🫒' },
    { id: 'pates', name: t('alimentaires.categories.pates'), icon: <span style={{ fontSize: '24px', color: '#f8f9fa' }}>🍝</span>, color: 'light', emoji: '🍝' },
    { id: 'gateaux', name: t('alimentaires.categories.gateaux'), icon: <span style={{ fontSize: '24px', color: '#e83e8c' }}>🎂</span>, color: 'pink', emoji: '🎂' },
    { id: 'emballage', name: t('alimentaires.categories.emballage'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>📦</span>, color: 'secondary', emoji: '📦' },
    { id: 'aliments_bebe', name: t('alimentaires.categories.aliments_bebe'), icon: <span style={{ fontSize: '24px', color: '#e83e8c' }}>👶</span>, color: 'pink', emoji: '👶' },
    { id: 'aliments_dietetiques', name: t('alimentaires.categories.aliments_dietetiques'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🥗</span>, color: 'success', emoji: '🥗' }
    ],
    
    // Servicios
    services: [
      { id: 'construction_travaux', name: t('services.categories.construction_travaux'), icon: <span style={{ fontSize: '24px' }}>🏗️</span>, color: 'warning', emoji: '🏗️' },
      { id: 'ecoles_formations', name: t('services.categories.ecoles_formations'), icon: <span style={{ fontSize: '24px' }}>📚</span>, color: 'info', emoji: '📚' },
      { id: 'industrie_fabrication', name: t('services.categories.industrie_fabrication'), icon: <span style={{ fontSize: '24px' }}>🏭</span>, color: 'dark', emoji: '🏭' },
      { id: 'transport_demenagement', name: t('services.categories.transport_demenagement'), icon: <span style={{ fontSize: '24px' }}>🚚</span>, color: 'primary', emoji: '🚚' },
      { id: 'decoration_amenagement', name: t('services.categories.decoration_amenagement'), icon: <span style={{ fontSize: '24px' }}>🎨</span>, color: 'pink', emoji: '🎨' },
      { id: 'publicite_communication', name: t('services.categories.publicite_communication'), icon: <span style={{ fontSize: '24px' }}>📢</span>, color: 'info', emoji: '📢' },
      { id: 'nettoyage_jardinage', name: t('services.categories.nettoyage_jardinage'), icon: <span style={{ fontSize: '24px' }}>🧹</span>, color: 'success', emoji: '🧹' },
      { id: 'froid_climatisation', name: t('services.categories.froid_climatisation'), icon: <span style={{ fontSize: '24px' }}>❄️</span>, color: 'info', emoji: '❄️' },
      { id: 'traiteurs_gateaux', name: t('services.categories.traiteurs_gateaux'), icon: <span style={{ fontSize: '24px' }}>🎂</span>, color: 'warning', emoji: '🎂' },
      { id: 'medecine_sante', name: t('services.categories.medecine_sante'), icon: <span style={{ fontSize: '24px' }}>🏥</span>, color: 'danger', emoji: '🏥' },
      { id: 'reparation_auto_diagnostic', name: t('services.categories.reparation_auto_diagnostic'), icon: <span style={{ fontSize: '24px' }}>🔧</span>, color: 'primary', emoji: '🔧' },
      { id: 'securite_alarme', name: t('services.categories.securite_alarme'), icon: <span style={{ fontSize: '24px' }}>🔒</span>, color: 'dark', emoji: '🔒' },
      { id: 'projets_etudes', name: t('services.categories.projets_etudes'), icon: <span style={{ fontSize: '24px' }}>📋</span>, color: 'info', emoji: '📋' },
      { id: 'bureautique_internet', name: t('services.categories.bureautique_internet'), icon: <span style={{ fontSize: '24px' }}>💻</span>, color: 'secondary', emoji: '💻' },
      { id: 'location_vehicules', name: t('services.categories.location_vehicules'), icon: <span style={{ fontSize: '24px' }}>🚗</span>, color: 'primary', emoji: '🚗' },
      { id: 'menuiserie_meubles', name: t('services.categories.menuiserie_meubles'), icon: <span style={{ fontSize: '24px' }}>🪚</span>, color: 'brown', emoji: '🪚' },
      { id: 'impression_edition', name: t('services.categories.impression_edition'), icon: <span style={{ fontSize: '24px' }}>🖨️</span>, color: 'dark', emoji: '🖨️' },
      { id: 'hotellerie_restauration_salles', name: t('services.categories.hotellerie_restauration_salles'), icon: <span style={{ fontSize: '24px' }}>🏨</span>, color: 'warning', emoji: '🏨' },
      { id: 'esthetique_beaute', name: t('services.categories.esthetique_beaute'), icon: <span style={{ fontSize: '24px' }}>💄</span>, color: 'pink', emoji: '💄' },
      { id: 'image_son', name: t('services.categories.image_son'), icon: <span style={{ fontSize: '24px' }}>🎬</span>, color: 'info', emoji: '🎬' },
      { id: 'comptabilite_economie', name: t('services.categories.comptabilite_economie'), icon: <span style={{ fontSize: '24px' }}>💰</span>, color: 'success', emoji: '💰' },
      { id: 'couture_confection', name: t('services.categories.couture_confection'), icon: <span style={{ fontSize: '24px' }}>🧵</span>, color: 'danger', emoji: '🧵' },
      { id: 'maintenance_informatique', name: t('services.categories.maintenance_informatique'), icon: <span style={{ fontSize: '24px' }}>💻</span>, color: 'primary', emoji: '💻' },
      { id: 'reparation_electromenager', name: t('services.categories.reparation_electromenager'), icon: <span style={{ fontSize: '24px' }}>🔌</span>, color: 'warning', emoji: '🔌' },
      { id: 'evenements_divertissement', name: t('services.categories.evenements_divertissement'), icon: <span style={{ fontSize: '24px' }}>🎉</span>, color: 'info', emoji: '🎉' },
      { id: 'paraboles_demos', name: t('services.categories.paraboles_demos'), icon: <span style={{ fontSize: '24px' }}>🛰️</span>, color: 'secondary', emoji: '🛰️' },
      { id: 'reparation_electronique', name: t('services.categories.reparation_electronique'), icon: <span style={{ fontSize: '24px' }}>🔌</span>, color: 'primary', emoji: '🔌' },
      { id: 'services_etranger', name: t('services.categories.services_etranger'), icon: <span style={{ fontSize: '24px' }}>🌍</span>, color: 'success', emoji: '🌍' },
      { id: 'flashage_reparation_telephones', name: t('services.categories.flashage_reparation_telephones'), icon: <span style={{ fontSize: '24px' }}>📱</span>, color: 'info', emoji: '📱' },
      { id: 'flashage_installation_jeux', name: t('services.categories.flashage_installation_jeux'), icon: <span style={{ fontSize: '24px' }}>🎮</span>, color: 'warning', emoji: '🎮' },
      { id: 'juridique', name: t('services.categories.juridique'), icon: <span style={{ fontSize: '24px' }}>⚖️</span>, color: 'dark', emoji: '⚖️' }
     ],
    
    // Materiales
    materiaux: [
      { id: 'materiel_professionnel', name: t('materiaux.categories.materiel_professionnel'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>🏭</span>, color: 'primary', emoji: '🏭', description: t('materiaux.descriptions.materiel_professionnel', 'Équipement professionnel industriel') },
      { id: 'outillage_professionnel', name: t('materiaux.categories.outillage_professionnel'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🔧</span>, color: 'success', emoji: '🔧', description: t('materiaux.descriptions.outillage_professionnel', 'Outils professionnels de qualité') },
      { id: 'materiaux_construction', name: t('materiaux.categories.materiaux_construction'), icon: <span style={{ fontSize: '24px', color: '#dc3545' }}>🧱</span>, color: 'danger', emoji: '🧱', description: t('materiaux.descriptions.materiaux_construction', 'Matériaux pour construction') },
      { id: 'matieres_premieres', name: t('materiaux.categories.matieres_premieres'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>⚙️</span>, color: 'warning', emoji: '⚙️', description: t('materiaux.descriptions.matieres_premieres', 'Matières premières industrielles') },
      { id: 'produits_hygiene', name: t('materiaux.categories.produits_hygiene'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🧴</span>, color: 'info', emoji: '🧴', description: t('materiaux.descriptions.produits_hygiene', 'Produits d\'hygiène professionnels') },
      { id: 'materiel_agricole', name: t('materiaux.categories.materiel_agricole'), icon: <span style={{ fontSize: '24px', color: '#20c997' }}>🚜</span>, color: 'success', emoji: '🚜', description: t('materiaux.descriptions.materiel_agricole', 'Équipement agricole') },
      { id: 'autre', name: t('materiaux.categories.autre'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>📦</span>, color: 'secondary', emoji: '📦', description: t('materiaux.descriptions.autre', 'Autres matériaux et équipements') }
      ],
    
    // Viajes
    voyages: [
      { id: 'voyage_organise', name: t('voyages.categories.voyage_organise'), icon: <span style={{ fontSize: '24px', color: '#007bff' }}>✈️</span>, color: 'primary', emoji: '✈️' },
    { id: 'location_vacances', name: t('voyages.categories.location_vacances'), icon: <span style={{ fontSize: '24px', color: '#28a745' }}>🏠</span>, color: 'success', emoji: '🏠' },
    { id: 'hajj_omra', name: t('voyages.categories.hajj_omra'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🕋</span>, color: 'info', emoji: '🕋' },
    { id: 'reservations_visa', name: t('voyages.categories.reservations_visa'), icon: <span style={{ fontSize: '24px', color: '#ffc107' }}>🛂</span>, color: 'warning', emoji: '🛂' },
    { id: 'sejour', name: t('voyages.categories.sejour'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🏨</span>, color: 'secondary', emoji: '🏨' },
    { id: 'croisiere', name: t('voyages.categories.croisiere'), icon: <span style={{ fontSize: '24px', color: '#17a2b8' }}>🚢</span>, color: 'info', emoji: '🚢' },
    { id: 'autre', name: t('voyages.categories.autre'), icon: <span style={{ fontSize: '24px', color: '#6c757d' }}>🧳</span>, color: 'secondary', emoji: '🧳' }
    ],
    
    // Empleo
    emploi: [
      { id: 'offres_emploi', name: t('offre.property.Offresemploi', { ns: 'subcategories' }), emoji: '💼' },
      { id: 'demandes_emploi', name: t('offre.property.Demandesemploi', { ns: 'subcategories' }), emoji: '📋' },
    ]
  };

  // Datos especiales para Immobilier
  const immobilierOperations = [
    { id: 'vente', name: t('immobilier.operation.vente') },
    { id: 'location', name: t('immobilier.operation.location') },
    { id: 'location_vacances', name: t('immobilier.operation.location_vacances') },
    { id: 'cherche_location', name: t('immobilier.operation.cherche_location') },
    { id: 'cherche_achat', name: t('immobilier.operation.cherche_achat') }
  ];

  const immobilierProperties = [
    { id: 'appartement', name: t('immobilier.property.appartement') },
    { id: 'villa', name: t('immobilier.property.villa') },
    { id: 'terrain', name: t('immobilier.property.terrain') },
    { id: 'local', name: t('immobilier.property.local') },
    { id: 'immeuble', name: t('immobilier.property.immeuble') },
    { id: 'bungalow', name: t('immobilier.property.bungalow') },
    { id: 'terrain_agricole', name: t('immobilier.property.terrain_agricole') }
  ];

  // Filtrar categorías basadas en búsqueda
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🎯 FUNCIONES HANDLER
  const handleCategorySelect = (categoryId) => {
    console.log('🎯 Seleccionando categoría:', categoryId);
    
    // Cargar componente bajo demanda
    loadComponent(categoryId);
    
    // Notificar al padre
    handleChangeInput({
      target: { name: 'categorie', value: categoryId }
    });
    
    // Para Immobilier, limpiar articleType y subCategory
    if (categoryId === 'immobilier') {
      handleChangeInput({
        target: { name: 'articleType', value: '' }
      });
      handleChangeInput({
        target: { name: 'subCategory', value: '' }
      });
      setSelectedOperation(null);
    } else {
      // Para otras categorías, limpiar subCategory
      handleChangeInput({
        target: { name: 'subCategory', value: '' }
      });
    }
    
    // Toggle del accordion
    if (activeKey === categoryId) {
      setActiveKey(null);
    } else {
      setActiveKey(categoryId);
    }
  };

  const handleSubcategorySelect = (subcategoryId) => {
    console.log('🎯 Seleccionando subcategoría:', subcategoryId);
    handleChangeInput({
      target: { name: 'subCategory', value: subcategoryId }
    });
  };

  const handleOperationSelect = (operationId) => {
    console.log('🏠 Seleccionando operación Immobilier:', operationId);
    setSelectedOperation(operationId);
    handleChangeInput({
      target: { name: 'articleType', value: operationId }
    });
    
    // Limpiar propiedad si se cambia operación
    if (localPostData.subCategory) {
      handleChangeInput({
        target: { name: 'subCategory', value: '' }
      });
    }
  };

  const handlePropertySelect = (propertyId) => {
    console.log('🏠 Seleccionando propiedad Immobilier:', propertyId);
    handleChangeInput({
      target: { name: 'subCategory', value: propertyId }
    });
  };

  const handleBackToOperations = () => {
    setSelectedOperation(null);
    handleChangeInput({
      target: { name: 'articleType', value: '' }
    });
    handleChangeInput({
      target: { name: 'subCategory', value: '' }
    });
  };

  // 🔄 Mapeo de componentes lazy por categoría
  const getLazySubcategoryComponent = (categoryId) => {
    const components = {
      vehicules: VehiculesSubcategories,
      vetements: VetementsSubcategories,
      telephones: TelephonesSubcategories,
      informatique: InformatiqueSubcategories,
      electromenager: ElectromenagerSubcategories,
      piecesDetachees: PiecesDetacheesSubcategories,
      santebeaute: SanteBeauteSubcategories,
      meubles: MeublesSubcategories,
      loisirs: LoisirsSubcategories,
      sport: SportSubcategories,
      alimentaires: AlimentairesSubcategories,
      services: ServicesSubcategories,
      materiaux: MateriauxSubcategories,
      voyages: VoyagesSubcategories,
      emploi: EmploiSubcategories,
    };
    
    return components[categoryId] || null;
  };

  // 🔄 Renderizar contenido con lazy loading
  const renderLazySubcategories = (categoryId) => {
    const LazyComponent = getLazySubcategoryComponent(categoryId);
    
    if (!LazyComponent || !loadedComponents[categoryId]) {
      return (
        <div className="loading-placeholder">
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
              Chargement des sous-catégories...
            </span>
          </div>
        </div>
      );
    }

    return (
      <Suspense fallback={
        <div className="loading-placeholder">
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
              Chargement des sous-catégories...
            </span>
          </div>
        </div>
      }>
        <LazyComponent 
          postData={localPostData}
          onSelect={handleSubcategorySelect}
        />
      </Suspense>
    );
  };

  // 🆕 RENDERIZAR SUBCATEGORÍAS DIRECTAS
  const renderDirectSubcategories = (categoryId) => {
    const subcategories = subcategoriesByCategory[categoryId] || [];
    
    if (subcategories.length === 0) {
      return renderLazySubcategories(categoryId);
    }

    return (
      <div className="direct-subcategories mt-2">
        <div className="level-header mb-2">
          <h6 className="level-title fw-bold mb-1" style={{ fontSize: '0.95rem' }}>
            <span className="me-2">📋</span>
            {getCategoryTitle(categoryId)}
          </h6>
          <p className="level-description mb-2" style={{ fontSize: '0.85rem', color: '#6c757d' }}>
            Sélectionnez une sous-catégorie
          </p>
        </div>
        
        <div className="subcategories-list">
          {subcategories.map((subcategory) => (
            <div 
              key={subcategory.id}
              className={`subcategory-item ${localPostData.subCategory === subcategory.id ? 'selected' : ''}`}
              onClick={() => handleSubcategorySelect(subcategory.id)}
            >
              <div className="d-flex align-items-center">
                <div className="subcategory-emoji me-2">
                  {subcategory.emoji}
                </div>
                <div className="subcategory-info flex-grow-1">
                  <div className="subcategory-name fw-medium" style={{ fontSize: '0.9rem' }}>
                    {subcategory.name}
                  </div>
                </div>
              </div>
              {localPostData.subCategory === subcategory.id && (
                <div className="subcategory-check">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 🔄 Renderizar contenido especial para Immobilier
  const renderImmobilierContent = () => (
    <div className="immobilier-content mt-2">
      {!selectedOperation ? (
        <div className="operations-level">
          <div className="level-header mb-2">
            <h6 className="level-title fw-bold mb-1" style={{ fontSize: '0.95rem' }}>
              <span className="me-2">📋</span>
              Sélectionnez une opération
            </h6>
            <p className="level-description mb-2" style={{ fontSize: '0.85rem', color: '#6c757d' }}>
              Choisissez le type de transaction immobilière
            </p>
          </div>
          
          <div className="operations-list">
            {immobilierOperations.map((operation) => (
              <div 
                key={operation.id}
                className={`operation-item ${localPostData.articleType === operation.id ? 'selected' : ''}`}
                onClick={() => handleOperationSelect(operation.id)}
              >
                <div className="d-flex align-items-center">
                  <div className="operation-emoji me-2">
                    {operation.emoji}
                  </div>
                  <div className="operation-info flex-grow-1">
                    <div className="operation-name fw-medium" style={{ fontSize: '0.9rem' }}>
                      {operation.name}
                    </div>
                    <div className="operation-desc" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                      {operation.id === 'vente' ? 'Achat/Vente de biens' :
                       operation.id === 'location' ? 'Location à long terme' :
                       'Location saisonnière'}
                    </div>
                  </div>
                </div>
                {localPostData.articleType === operation.id && (
                  <div className="operation-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="properties-level">
          <div className="level-header mb-2">
            <div className="d-flex align-items-center justify-content-between">
              <div className="flex-grow-1">
                <h6 className="level-title fw-bold mb-1" style={{ fontSize: '0.95rem' }}>
                  <span className="me-2">🏠</span>
                  Sélectionnez un type de bien
                </h6>
                <p className="level-description mb-2" style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                  Opération: <span className="fw-bold">
                    {immobilierOperations.find(op => op.id === selectedOperation)?.name}
                  </span>
                </p>
              </div>
              <Button 
                variant="link" 
                className="btn-back p-0"
                onClick={handleBackToOperations}
                style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              >
                ← Changer
              </Button>
            </div>
          </div>
          
          <div className="properties-list">
            {immobilierProperties.map((property) => (
              <div 
                key={property.id}
                className={`property-item ${localPostData.subCategory === property.id ? 'selected' : ''}`}
                onClick={() => handlePropertySelect(property.id)}
              >
                <div className="d-flex align-items-center">
                  <div className="property-emoji me-2">
                    {property.emoji}
                  </div>
                  <div className="property-info flex-grow-1">
                    <div className="property-name fw-medium" style={{ fontSize: '0.9rem' }}>
                      {property.name}
                    </div>
                    <div className="property-desc" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                      {property.id === 'appartement' ? 'Appartements et studios' :
                       property.id === 'villa' ? 'Maisons et villas' :
                       property.id === 'terrain' ? 'Terrains et parcelles' :
                       'Locaux commerciaux'}
                    </div>
                  </div>
                </div>
                {localPostData.subCategory === property.id && (
                  <div className="property-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Títulos para categorías
  const getCategoryTitle = (categoryId) => {
    const titles = {
      'vehicules': t('type_vehicle', { ns: 'subcategories' }),
      'vetements': t('type_clothing', { ns: 'subcategories' }),
      'telephones': t('type_phone', { ns: 'subcategories' }),
      'informatique': t('type_computer', { ns: 'subcategories' }),
      'electromenager': t('type_appliance', { ns: 'subcategories' }),
      'piecesDetachees': t('type_pieces_detachees', { ns: 'subcategories' }),
      'santebeaute': t('type_sante_beautee', { ns: 'subcategories' }),
      'meubles': t('type_meubles', { ns: 'subcategories' }),
      'loisirs': t('type_loisirs', { ns: 'subcategories' }),
      'emploi': t('type_emploi', { ns: 'subcategories' }),
      'sport': t('type_sport', { ns: 'subcategories' }),
      'alimentaires': t('type_alimentaires', { ns: 'subcategories' }),
      'materiaux': t('type_materiaux', { ns: 'subcategories' }),
      'services': t('type_services', { ns: 'subcategories' }),
      'voyages': t('type_voyages', { ns: 'subcategories' })
    };
    
    return titles[categoryId] || t('select_subcategory', { ns: 'subcategories' });
  };

  return (
    <div className={`category-accordion ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Barra de búsqueda */}
      <div className="search-container mb-3">
        <Form.Control
          type="text"
          placeholder={t('search_category', { ns: 'categories', defaultValue: '🔍 Rechercher une catégorie...' })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          dir={isRTL ? 'rtl' : 'ltr'}
          size="sm"
        />
      </div>

      {/* Contador de resultados */}
      {searchTerm && (
        <div className="results-count mb-2">
          <Badge bg="light" text="dark" className="px-1 py-1">
            <span className="fw-bold" style={{ fontSize: '0.9rem' }}>
              {filteredCategories.length}
            </span>
            <span className="ms-1" style={{ fontSize: '0.85rem' }}>
              catégorie(s) trouvée(s)
            </span>
          </Badge>
        </div>
      )}

      {/* Accordion */}
      <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Accordion.Item 
              key={category.id} 
              eventKey={category.id}
              className="category-accordion-item mb-1"
            >
              <Accordion.Header 
                onClick={() => handleCategorySelect(category.id)}
                className="category-header"
              >
                <div className="d-flex align-items-center w-100">
                  <span className="category-emoji">
                    {categoryEmojis[category.id]}
                  </span>
                  <div className="category-info ms-3 flex-grow-1">
                    <div className="category-name">
                      {category.name}
                    </div>
                    <div className="category-id">
                      {category.id}
                    </div>
                  </div>
                  <div className="category-actions">
                    {localPostData.categorie === category.id && (
                      <Badge bg="success" className="selected-badge me-2">
                        ✓
                      </Badge>
                    )}
                    <span className="expand-icon">
                      {activeKey === category.id ? <ChevronDown /> : <ChevronRight />}
                    </span>
                  </div>
                </div>
              </Accordion.Header>
              
              <Accordion.Body className="category-body">
                {localPostData.categorie === category.id && (
                  <>
                    {category.id === 'immobilier' ? (
                      renderImmobilierContent()
                    ) : (
                      renderDirectSubcategories(category.id)
                    )}
                  </>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))
        ) : (
          <div className="no-results text-center py-4">
            <div className="no-results-icon mb-2" style={{ fontSize: '2rem' }}>
              🔍
            </div>
            <div className="no-results-title fw-bold mb-1" style={{ fontSize: '1rem' }}>
              Aucune catégorie trouvée
            </div>
            <div className="no-results-text" style={{ fontSize: '0.9rem', color: '#6c757d' }}>
              Essayez avec d'autres termes de recherche
            </div>
          </div>
        )}
      </Accordion>

      {/* Estado de selección */}
      {localPostData.categorie && (
        <div className="current-selection mt-3">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary bg-opacity-10 border-0 py-2">
              <h6 className="mb-0 fw-bold d-flex align-items-center" style={{ fontSize: '1rem' }}>
                <span className="me-2">✅</span>
                Sélection actuelle
              </h6>
            </Card.Header>
            <Card className="p-1">
              <div className="selection-details">
                <div className="selection-item mb-2">
                  <div className="selection-label" style={{ fontSize: '0.9rem' }}>Catégorie:</div>
                  <div className="selection-value fw-bold" style={{ fontSize: '1rem' }}>
                    <span className="me-2">{categoryEmojis[localPostData.categorie]}</span>
                    {categories.find(c => c.id === localPostData.categorie)?.name}
                  </div>
                </div>
                
                {localPostData.categorie === 'immobilier' && localPostData.articleType && (
                  <div className="selection-item mb-1">
                    <div className="selection-label" style={{ fontSize: '0.9rem' }}>Opération:</div>
                    <div className="selection-value fw-medium" style={{ fontSize: '0.95rem' }}>
                      <span className="me-2">
                        {immobilierOperations.find(op => op.id === localPostData.articleType)?.emoji}
                      </span>
                      {immobilierOperations.find(op => op.id === localPostData.articleType)?.name}
                    </div>
                  </div>
                )}
                
                {localPostData.subCategory && (
                  <div className="selection-item mb-1">
                    <div className="selection-label" style={{ fontSize: '0.9rem' }}>Sous-catégorie:</div>
                    <div className="selection-value fw-medium" style={{ fontSize: '0.95rem' }}>
                      <span className="me-2">
                        {(() => {
                          if (localPostData.categorie === 'immobilier') {
                            return immobilierProperties.find(p => p.id === localPostData.subCategory)?.emoji;
                          }
                          const subcats = subcategoriesByCategory[localPostData.categorie];
                          return subcats?.find(sc => sc.id === localPostData.subCategory)?.emoji;
                        })()}
                      </span>
                      {(() => {
                        if (localPostData.categorie === 'immobilier') {
                          return immobilierProperties.find(p => p.id === localPostData.subCategory)?.name;
                        }
                        const subcats = subcategoriesByCategory[localPostData.categorie];
                        return subcats?.find(sc => sc.id === localPostData.subCategory)?.name;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <Card.Footer className="bg-light border-0 py-2">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => {
                  handleChangeInput({ target: { name: 'categorie', value: '' } });
                  handleChangeInput({ target: { name: 'subCategory', value: '' } });
                  handleChangeInput({ target: { name: 'articleType', value: '' } });
                  setActiveKey(null);
                  setSelectedOperation(null);
                  setLoadedComponents({});
                }}
                className="w-100"
                style={{ fontSize: '0.85rem' }}
              >
                Changer de catégorie
              </Button>
            </Card.Footer>
          </Card>
        </div>
      )}

      {/* Styles CSS actualizados */}
      <style>{`
        .category-accordion {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          width: 100%;
          ${isMobile ? 'padding: 0 !important; margin: 0 !important;' : ''}
        }
        
        /* Barra de búsqueda */
        .search-input {
          width: 100% !important;
          ${isMobile ? 'padding: 0.5rem 0.75rem 0.5rem 2.25rem !important;' : 'padding: 0.75rem 1rem 0.75rem 2.5rem;'}
          font-size: 0.95rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          background-color: white;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        }
        
        /* Ítem del accordion - SIN PADDING/MARGIN EXTERNO */
        .category-accordion-item {
          border: 1px solid #e9ecef !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          margin-bottom: 4px !important;
          width: 100% !important;
          ${isMobile ? 'margin: 0 0 4px 0 !important; padding: 0 !important;' : ''}
        }
        
        /* Cabecera - AJUSTE PARA ANDROID */
        .category-header {
          ${isMobile ? 'padding: 0.75rem 0.875rem !important;' : 'padding: 1rem 1.25rem !important;'}
          background-color: white !important;
          border: none !important;
        }
        
        .category-header:hover {
          background-color: #f8f9fa !important;
        }
        
        .category-accordion-item .accordion-button {
          padding: 0 !important;
          box-shadow: none !important;
        }
        
        .category-accordion-item .accordion-button:not(.collapsed) {
          background-color: transparent !important;
          color: inherit !important;
          box-shadow: none !important;
        }
        
        /* Iconos y texto - AJUSTADOS */
        .category-emoji {
          ${isMobile ? 'font-size: 1.6rem !important; min-width: 32px !important;' : 'font-size: 2rem; min-width: 40px;'}
        }
        
        .category-name {
          ${isMobile ? 'font-size: 0.95rem !important;' : 'font-size: 1.1rem;'}
          font-weight: 600;
          color: #212529;
        }
        
        .category-id {
          ${isMobile ? 'font-size: 0.75rem !important;' : 'font-size: 0.85rem;'}
          color: #6c757d;
          margin-top: 2px;
        }
        
        /* Cuerpo del accordion - ANCHO COMPLETO EN ANDROID */
        .category-body {
          background-color: #f8f9fa !important;
          border-top: 1px solid #e9ecef !important;
          animation: slideDown 0.3s ease-out !important;
          ${isMobile ? 'padding: 0.875rem !important; width: 100% !important;' : ''}
        }
        
        /* Subcategorías DIRECTAS - MÁS ANGOSTAS */
        .direct-subcategories {
          animation: fadeIn 0.2s ease !important;
          ${isMobile ? 'width: 100% !important;' : ''}
        }
        
        .subcategories-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.5rem !important;
          ${isMobile ? 'width: 95% !important; margin-left: auto !important; margin-right: auto !important;' : 'width: 90% !important; margin-left: auto !important; margin-right: auto !important;'}
        }
        
        .subcategory-item {
          padding: ${isMobile ? '0.625rem 0.75rem !important' : '0.75rem 0.875rem !important'};
          background-color: white !important;
          border-radius: 6px !important;
          border: 2px solid transparent !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          max-width: ${isMobile ? '100%' : '500px'} !important;
          margin: 0 auto !important;
        }
        
        .subcategory-emoji {
          ${isMobile ? 'font-size: 1.2rem !important; min-width: 28px !important;' : 'font-size: 1.3rem !important; min-width: 32px !important;'}
          text-align: center !important;
        }
        
        /* Contenido IMMOBILIER - NUEVOS NIVELES MÁS ANGOSTOS */
        .immobilier-content {
          animation: fadeIn 0.2s ease !important;
          ${isMobile ? 'width: 100% !important;' : ''}
        }
        
        .operations-list, .properties-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.5rem !important;
          ${isMobile ? 'width: 95% !important; margin-left: auto !important; margin-right: auto !important;' : 'width: 90% !important; margin-left: auto !important; margin-right: auto !important;'}
        }
        
        .operation-item, .property-item {
          padding: ${isMobile ? '0.625rem 0.75rem !important' : '0.75rem 0.875rem !important'};
          background-color: white !important;
          border-radius: 6px !important;
          border: 2px solid transparent !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          max-width: ${isMobile ? '100%' : '500px'} !important;
          margin: 0 auto !important;
        }
        
        .operation-emoji, .property-emoji {
          ${isMobile ? 'font-size: 1.2rem !important; min-width: 28px !important;' : 'font-size: 1.3rem !important; min-width: 32px !important;'}
          text-align: center !important;
        }
        
        /* LEVEL HEADERS - MÁS ANGOSTOS */
        .level-header {
          ${isMobile ? 'width: 95% !important; margin-left: auto !important; margin-right: auto !important;' : 'width: 90% !important; margin-left: auto !important; margin-right: auto !important;'}
        }
        
        .level-title {
          ${isMobile ? 'font-size: 0.9rem !important;' : ''}
        }
        
        .level-description {
          ${isMobile ? 'font-size: 0.8rem !important;' : ''}
        }
        
        /* Información de operaciones/propiedades */
        .operation-info, .property-info, .subcategory-info {
          flex-grow: 1 !important;
          ${isMobile ? 'min-width: 0 !important;' : ''}
        }
        
        .operation-name, .property-name, .subcategory-name {
          ${isMobile ? 'font-size: 0.85rem !important;' : 'font-size: 0.9rem !important;'}
          font-weight: 500 !important;
          word-break: break-word !important;
          line-height: 1.3 !important;
        }
        
        .operation-desc, .property-desc {
          ${isMobile ? 'font-size: 0.75rem !important;' : 'font-size: 0.8rem !important;'}
          color: #6c757d !important;
          margin-top: 2px !important;
          line-height: 1.2 !important;
        }
        
        /* Botón de retroceso */
        .btn-back {
          text-decoration: none !important;
          color: #6c757d !important;
          font-size: 0.8rem !important;
          white-space: nowrap !important;
          ${isMobile ? 'padding-left: 0.5rem !important;' : ''}
        }
        
        /* Current selection - AJUSTADO */
        .current-selection {
          animation: fadeIn 0.3s ease !important;
          ${isMobile ? 'width: 100% !important; margin: 1rem 0 0 0 !important;' : ''}
        }
        
        .selection-item {
          display: flex !important;
          align-items: center !important;
          margin-bottom: 0.5rem !important;
          ${isMobile ? 'flex-wrap: wrap !important;' : ''}
        }
        
        .selection-label {
          min-width: ${isMobile ? '80px' : '100px'} !important;
          color: #6c757d !important;
          font-weight: 500 !important;
          ${isMobile ? 'font-size: 0.85rem !important;' : ''}
        }
        
        .selection-value {
          flex-grow: 1 !important;
          color: #212529 !important;
          ${isMobile ? 'font-size: 0.95rem !important;' : ''}
        }
        
        /* Animations */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 1000px;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Optimización para pantallas muy pequeñas (Android) */
        @media (max-width: 480px) {
          .category-emoji {
            font-size: 1.4rem !important;
            min-width: 28px !important;
          }
          
          .category-name {
            font-size: 0.9rem !important;
          }
          
          .category-body {
            padding: 0.75rem 0.5rem !important;
          }
          
          .subcategories-list,
          .operations-list,
          .properties-list {
            width: 100% !important;
            margin: 0 !important;
          }
          
          .subcategory-item,
          .operation-item,
          .property-item {
            padding: 0.5rem 0.625rem !important;
            margin: 0 0 0.375rem 0 !important;
          }
          
          .search-input {
            padding: 0.5rem 0.75rem 0.5rem 2rem !important;
            font-size: 0.9rem !important;
          }
        }
        
        /* Soporte para RTL */
        .rtl .category-info {
          margin-right: 0.75rem !important;
          margin-left: 0 !important;
        }
        
        .rtl .expand-icon {
          transform: scaleX(-1) !important;
        }
        
        .rtl .selected-badge {
          margin-right: 0.5rem !important;
          margin-left: 0 !important;
        }
        
        .rtl .search-input {
          padding-right: 2.5rem !important;
          padding-left: 1rem !important;
        }
        
        /* Asegurar que todo ocupe el ancho completo */
        .category-accordion > div {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* Eliminar cualquier padding/margin del contenedor padre */
        .category-accordion {
          ${isMobile ? 'padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;' : ''}
        }
      `}</style>
    </div>
  );
};

export default React.memo(CategoryAccordion);