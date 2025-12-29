import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
 import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
 
import DashboardHeader from '../../components/dashboard/Header';
import StatsCards from '../../components/dashboard/StatsCards';
import RecentActivity from '../../components/dashboard/RecentActivity';
import QuickActions from '../../components/dashboard/QuickActions';

const DashboardPage = () => {
  const { auth } = useSelector(state => state);
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Configuración responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!auth.user) {
      history.push('/login');
    }
  }, [auth.user, history]);

  if (!auth.user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={styles.container}>
      {/* Navbar solo en desktop */}
      {!isMobile && <DashboardNavbar />}

      {/* Contenido principal */}
      <div className="dashboard-main" style={styles.main}>
        <DashboardHeader user={auth.user} />
        
        <div className="dashboard-content" style={styles.content}>
          {/* Sección de estadísticas */}
          <div className="stats-section" style={styles.statsSection}>
            <StatsCards user={auth.user} />
          </div>

          {/* Sección de actividad reciente y acciones rápidas */}
          <div className="activity-section" style={{
            ...styles.activitySection,
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr'
          }}>
            <div className="recent-activity" style={styles.recentActivity}>
              <RecentActivity user={auth.user} />
            </div>
            
            <div className="quick-actions" style={styles.quickActions}>
              <QuickActions user={auth.user} />
            </div>
          </div>

          {/* Nota para móviles */}
          {isMobile && (
            <div style={styles.mobileNote}>
              <div style={styles.noteIcon}>📱</div>
              <div style={styles.noteContent}>
                <h4 style={styles.noteTitle}>Navigation sur mobile</h4>
                <p style={styles.noteText}>
                  Utilisez le menu <strong>(icône ☰ en haut)</strong> pour accéder à toutes les fonctionnalités de votre tableau de bord.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: 1,
    padding: isMobile => isMobile ? '15px' : '25px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  statsSection: {
    marginBottom: '30px'
  },
  activitySection: {
    display: 'grid',
    gap: '25px',
    marginBottom: '30px'
  },
  recentActivity: {
    
  },
  quickActions: {
    
  },
  mobileNote: {
    backgroundColor: '#e7f3ff',
    border: '1px solid #b6d4fe',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px'
  },
  noteIcon: {
    fontSize: '28px',
    flexShrink: 0
  },
  noteContent: {
    flex: 1
  },
  noteTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#084298',
    margin: '0 0 8px 0'
  },
  noteText: {
    fontSize: '14px',
    color: '#055160',
    margin: 0,
    lineHeight: 1.5
  }
};

export default DashboardPage;