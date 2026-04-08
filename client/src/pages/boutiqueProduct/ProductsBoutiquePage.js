// 📂 pages/MesProduitsBoutiquePage.js - CON ESTILOS EN LÍNEA
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { deleteBoutiqueProduct, getBoutiqueProducts } from '../../redux/actions/boutiqueProductAction';
import { getBoutique } from '../../redux/actions/boutiqueAction';
import { FaBox, FaPlus, FaSpinner, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const ProductsBoutiquePage = () => {
  const { boutiqueId } = useParams();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { products: productsState, loadingProducts } = useSelector(state => state.boutiqueProduct);
  const { currentBoutique } = useSelector(state => state.boutique);

  const boutiqueProducts = productsState[boutiqueId] || {
    products: [],
    total: 0,
    loading: false
  };

  useEffect(() => {
    if (boutiqueId && auth?.token) {
      dispatch(getBoutique(boutiqueId, auth));
      dispatch(getBoutiqueProducts(boutiqueId, { page: 1, limit: 50 }, auth));
    }
  }, [dispatch, boutiqueId, auth]);

  const handleDelete = (productId) => {
    if (window.confirm('Supprimer ce produit ?')) {
      dispatch(deleteBoutiqueProduct({ boutiqueId, productId, auth }));
    }
  };

  // Estilos en línea
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '15px',
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    headerTitle: {
      fontSize: '1.8rem',
      margin: 0,
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    boutiqueName: {
      fontSize: '0.9rem',
      color: '#6b7280',
      background: '#f3f4f6',
      padding: '6px 12px',
      borderRadius: '20px',
      fontWeight: 'normal'
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      background: '#f3f4f6'
    },
    btnPrimary: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '10px',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      border: 'none',
      cursor: 'pointer'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    emptyStateIcon: {
      color: '#9ca3af',
      marginBottom: '20px'
    },
    emptyStateTitle: {
      fontSize: '1.5rem',
      color: '#374151',
      marginBottom: '10px'
    },
    emptyStateText: {
      color: '#6b7280',
      marginBottom: '25px'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px 20px'
    },
    spinner: {
      animation: 'spin 1s linear infinite'
    },
    table: {
      width: '100%',
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderCollapse: 'collapse'
    },
    tableHead: {
      background: '#f9fafb',
      borderBottom: '1px solid #e5e7eb'
    },
    tableHeader: {
      textAlign: 'left',
      padding: '16px',
      fontWeight: '600',
      color: '#374151',
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6',
      transition: 'background 0.2s ease'
    },
    tableCell: {
      padding: '16px',
      verticalAlign: 'middle'
    },
    productImage: {
      width: '50px',
      height: '50px',
      objectFit: 'cover',
      borderRadius: '8px',
      background: '#f3f4f6'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    statusActive: {
      background: '#d1fae5',
      color: '#065f46'
    },
    statusInactive: {
      background: '#fee2e2',
      color: '#991b1b'
    },
    actionsCell: {
      padding: '16px',
      display: 'flex',
      gap: '12px'
    },
    btnIcon: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: '1.1rem',
      padding: '6px',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      textDecoration: 'none'
    },
    btnEdit: {
      color: '#3b82f6'
    },
    btnDelete: {
      color: '#ef4444'
    },
    productName: {
      fontWeight: '500',
      color: '#1f2937'
    },
    productPrice: {
      fontWeight: '600',
      color: '#10b981'
    }
  };

  // Agregar animación keyframes al documento
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (loadingProducts && boutiqueProducts.products.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={{ ...styles.spinner, fontSize: '40px', color: '#667eea' }} size={40} />
        <p style={{ color: '#6b7280', marginTop: '15px' }}>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div style={styles.headerLeft}>
          <Link to="/mes-boutiques" style={styles.backLink}>
            <FaArrowLeft /> Mes boutiques
          </Link>
          <h1 style={styles.headerTitle}>
            <FaBox /> Produits de {currentBoutique?.nom_boutique || 'ma boutique'}
          </h1>
        </div>
        <Link to={`/ajouter-produit-boutique/${boutiqueId}`} style={styles.btnPrimary}>
          <FaPlus /> Ajouter un produit
        </Link>
      </div>

      {/* Contenido principal */}
      {boutiqueProducts.products.length === 0 ? (
        <div style={styles.emptyState}>
          <FaBox size={60} style={styles.emptyStateIcon} />
          <h3 style={styles.emptyStateTitle}>Aucun produit</h3>
          <p style={styles.emptyStateText}>Ajoutez votre premier produit à cette boutique</p>
          <Link to={`/ajouter-produit-boutique/${boutiqueId}`} style={styles.btnPrimary}>
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableHeader}>Image</th>
              <th style={styles.tableHeader}>Nom</th>
              <th style={styles.tableHeader}>Prix</th>
              <th style={styles.tableHeader}>Stock</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {boutiqueProducts.products.map(product => (
              <tr key={product._id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <img 
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/50x50?text=No+Image'} 
                    alt={product.title || product.nom} 
                    style={styles.productImage}
                  />
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.productName}>{product.title || product.nom}</span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.productPrice}>{product.price?.toLocaleString()} DA</span>
                </td>
                <td style={styles.tableCell}>
                  <span>{product.stock || 'N/A'}</span>
                </td>
                <td style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(product.isActive !== false ? styles.statusActive : styles.statusInactive)
                  }}>
                    {product.isActive !== false ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.actionsCell}>
                    <Link 
                      to={`/editer-produit-boutique/${boutiqueId}/${product._id}`} 
                      style={{ ...styles.btnIcon, ...styles.btnEdit }}
                      title="Modifier"
                    >
                      <FaEdit />
                    </Link>
                    <button 
                      onClick={() => handleDelete(product._id)} 
                      style={{ ...styles.btnIcon, ...styles.btnDelete }}
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsBoutiquePage;