// 📂 pages/UserBoutiquesPage.js - VERSIÓN CORREGIDA
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { getUserBoutiques, deleteBoutique, updateBoutiqueStatus } from '../../redux/actions/boutiqueAction';
import { FaStore, FaPlus, FaSpinner, FaEdit, FaTrash, FaBox, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const UserBoutiquesPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const { userBoutiques, loading } = useSelector(state => state.boutique || { userBoutiques: [], loading: false });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (auth?.token) {
      console.log('🔄 UserBoutiquesPage: Cargando boutiques del usuario...');
      dispatch(getUserBoutiques(auth)).then((res) => {
        console.log('✅ UserBoutiquesPage: Respuesta recibida:', res);
        console.log('📦 Cantidad de boutiques:', res?.boutiques?.length || 0);
      }).catch((err) => {
        console.error('❌ UserBoutiquesPage: Error cargando boutiques:', err);
      });
    }
  }, [dispatch, auth, refresh]);

  const handleDelete = async (boutiqueId, e) => {
    e.stopPropagation(); // ✅ Evitar que el clic propague a la tarjeta
    if (window.confirm('Supprimer cette boutique ? Tous les produits seront également supprimés.')) {
      try {
        await dispatch(deleteBoutique({ boutiqueId, auth }));
        setRefresh(prev => !prev);
      } catch (error) {
        console.error('Error deleting boutique:', error);
      }
    }
  };

  const handleToggleStatus = async (boutiqueId, currentStatus, e) => {
    e.stopPropagation(); // ✅ Evitar que el clic propague a la tarjeta
    try {
      await dispatch(updateBoutiqueStatus({
        boutiqueId,
        statusData: { isActive: !currentStatus },
        auth
      }));
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // ✅ Función para navegar a la boutique
  const handleBoutiqueClick = (boutiqueId) => {
    history.push(`/boutique/${boutiqueId}`);
  };

  // Función auxiliar para ajustar color
  const adjustColor = (color, percent) => {
    if (!color || color === '#667eea') return '#764ba2';
    try {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, Math.max(0, (num >> 16) + amt));
      const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
      const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    } catch {
      return '#764ba2';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '40px', color: '#667eea' }} />
        <p style={{ marginTop: '15px', color: '#6b7280' }}>Chargement de vos boutiques...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!userBoutiques || userBoutiques.length === 0) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaStore /> Mes Boutiques
          </h1>
          <Link to="/create-boutique" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            textDecoration: 'none'
          }}>
            <FaPlus /> Créer une boutique
          </Link>
        </div>
        
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px' }}>
          <FaStore size={60} style={{ color: '#9ca3af', marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '10px' }}>Aucune boutique</h3>
          <p style={{ color: '#6b7280', marginBottom: '25px' }}>Vous n'avez pas encore créé de boutique</p>
          <Link to="/create-boutique" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            textDecoration: 'none'
          }}>
            <FaPlus /> Créer ma première boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaStore /> Mes Boutiques
          <span style={{ fontSize: '0.9rem', background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px', color: '#6b7280' }}>
            {userBoutiques.length} boutique(s)
          </span>
        </h1>
        <Link to="/create-boutique" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '10px',
          textDecoration: 'none'
        }}>
          <FaPlus /> Créer une boutique
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {userBoutiques.map(boutique => (
          <div 
            key={boutique._id} 
            onClick={() => handleBoutiqueClick(boutique._id)}
            style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
          >
            {/* Imagen de cabecera */}
            <div style={{
              height: '120px',
              background: `linear-gradient(135deg, ${boutique.couleur_theme || '#667eea'} 0%, ${adjustColor(boutique.couleur_theme || '#667eea', 30)} 100%)`,
              position: 'relative'
            }}>
              {boutique.header_images && boutique.header_images.length > 0 && (
                <img 
                  src={boutique.header_images[0]?.url || boutique.header_images[0]} 
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: boutique.isActive ? '#10b981' : '#ef4444',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {boutique.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            {/* Logo y nombre */}
            <div style={{ textAlign: 'center', marginTop: '-40px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'white',
                border: `4px solid ${boutique.couleur_theme || '#667eea'}`,
                margin: '0 auto',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {boutique.images && boutique.images.length > 0 ? (
                  <img 
                    src={boutique.images[0]?.url || boutique.images[0]} 
                    alt={boutique.nom_boutique}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <FaStore size={35} color={boutique.couleur_theme || '#667eea'} />
                )}
              </div>
            </div>
            
            {/* Información */}
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{boutique.nom_boutique}</h3>
              {boutique.slogan_boutique && (
                <p style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>{boutique.slogan_boutique}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Créée le {new Date(boutique.createdAt).toLocaleDateString('fr-FR')}
              </p>
              
              {/* Stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: '15px 0',
                padding: '10px 0',
                borderTop: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#374151' }}>{boutique.stats?.produits || 0}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Produits</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#374151' }}>{boutique.views || 0}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Vues</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#374151' }}>{boutique.stats?.followersCount || 0}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Abonnés</div>
                </div>
              </div>
              
              {/* Acciones - Los botones detienen la propagación */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link 
                  to={`/boutique/${boutique._id}`} 
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f3f4f6',
                    color: '#374151',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.8rem'
                  }}
                >
                  <FaEye /> Voir
                </Link>
                <Link 
                  to={`/edit-boutique/${boutique._id}`} 
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f3f4f6',
                    color: '#374151',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.8rem'
                  }}
                >
                  <FaEdit /> Modifier
                </Link>
                <Link 
                  to={`/mes-produits-boutique/${boutique._id}`} 
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f3f4f6',
                    color: '#374151',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.8rem'
                  }}
                >
                  <FaBox /> Produits
                </Link>
                <button 
                  onClick={(e) => handleToggleStatus(boutique._id, boutique.isActive, e)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f3f4f6',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.8rem',
                    color: boutique.isActive ? '#f59e0b' : '#10b981'
                  }}
                >
                  {boutique.isActive ? <FaToggleOff /> : <FaToggleOn />}
                  {boutique.isActive ? 'Désactiver' : 'Activer'}
                </button>
                <button 
                  onClick={(e) => handleDelete(boutique._id, e)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#fee2e2',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.8rem',
                    color: '#dc2626'
                  }}
                >
                  <FaTrash /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBoutiquesPage;