import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaStore,
  FaUserCircle,
  FaMapMarkerAlt,
  FaBox,
  FaEnvelope,
  FaHeart,
  FaEye
} from 'react-icons/fa';
import {   incrementBoutiqueView } from '../../redux/actions/boutiqueAction';

const BoutiqueFooter = ({ boutique }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = useSelector(state => state);

  // 🔹 Tomar boutique actual desde Redux si existe
  const reduxBoutique = useSelector(state =>
    state.boutique.boutiques.find(b => b._id === boutique._id)
  );
  const currentBoutique = reduxBoutique || boutique;

  const {
    _id,
    nom_boutique = 'Boutique',
    description = '',
    wilaya = '',
    commune = '',
    produitCount = 0,
    proprietaire = {},
    avatar = null,
    stats = { vues: 0 }
  } = currentBoutique;

  // Incrementar vistas al montar el componente
  useEffect(() => {
    if (_id) {
      dispatch(incrementBoutiqueView(_id));
    }
  }, [_id, dispatch]);

  const handleContact = (e) => {
    e.stopPropagation();
    if (!auth.token) return history.push('/login');
    history.push(`/messages/${proprietaire?._id}`);
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    if (!auth.token) return history.push('/login');
    console.log('Follow boutique:', _id);
  };

  return (
    <div style={styles.container}>
      {/* FILA 1: Nombre */}
      <div style={styles.row}>
        <span style={styles.title}>{nom_boutique}</span>
      </div>

      {/* FILA 2: Descripción */}
      {description && (
        <div style={styles.row}>
          <span style={styles.description}>{description}</span>
        </div>
      )}

      {/* FILA 3: Ubicación */}
      {(wilaya || commune) && (
        <div style={styles.row}>
          <span style={styles.location}>
            <FaMapMarkerAlt size={12} color="#9ca3af" style={styles.iconInline} />
            {wilaya || ''} {commune ? `- ${commune}` : ''}
          </span>
        </div>
      )}

      {/* FILA 4: Productos + Vistas */}
      <div style={{ ...styles.row, display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={styles.productCount}>
          <FaBox size={12} color="#9ca3af" style={styles.iconInline} />
          {produitCount} {produitCount <= 1 ? 'produit' : 'produits'}
        </span>
        <span style={styles.productCount}>
          <FaEye size={12} color="#9ca3af" style={styles.iconInline} />
          {stats.vues || 0} vues
        </span>
      </div>

      {/* FILA 5: Propietario */}
      <div style={styles.ownerRow}>
        {avatar ? (
          <img 
            src={avatar} 
            alt={proprietaire?.nom || 'Propriétaire'}
            style={styles.avatar}
          />
        ) : (
          <FaUserCircle size={20} color="#9ca3af" />
        )}
        <span style={styles.ownerName}>
          {proprietaire?.nom || 'Propriétaire'}
        </span>
      </div>

      {/* FILA 6: Botones */}
      <div style={styles.buttonsRow}>
        <button 
          onClick={handleContact} 
          style={styles.button}
          aria-label="Contact"
        >
          <FaEnvelope size={14} color="#6b7280" />
          <span style={styles.buttonText}>Contact</span>
        </button>
        
        <button 
          onClick={handleFollow} 
          style={styles.button}
          aria-label="Follow"
        >
          <FaHeart size={14} color="#6b7280" />
          <span style={styles.buttonText}>Suivre</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '4px 0', borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff', width: '100%' },
  row: { margin: '2px 0', lineHeight: 1.3 },
  title: { fontSize: '15px', fontWeight: '600', color: '#1f2937', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  description: { fontSize: '13px', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  location: { fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  productCount: { fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  iconInline: { marginRight: '4px' },
  ownerRow: { display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0', padding: '0' },
  avatar: { width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' },
  ownerName: { fontSize: '12px', fontWeight: '500', color: '#4b5563', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  buttonsRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '6px 0 2px 0', padding: '0', width: '100%' },
  button: { flex: 1, background: 'none', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#6b7280', fontSize: '12px', fontWeight: '500' }
};

export default React.memo(BoutiqueFooter);