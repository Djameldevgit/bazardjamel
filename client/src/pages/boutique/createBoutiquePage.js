// 📂 src/pages/boutique/CreateBoutiquePage.js
import React from 'react';
import { Container, Alert, Breadcrumb } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CreateBoutiqueWizard from '../../components/boutique/CreateBoutiqueWizard';

const CreateBoutiquePage = ({ isEdit = false }) => {
  const { auth } = useSelector(state => state);
  
  // Redirigir si no está autenticado
  if (!auth.token) {
    window.location.href = '/login';
    return null;
  }
  
  const handleSuccess = (boutique) => {
    // Redirigir a la página de la boutique
    window.location.href = `/boutique/${boutique.domaine_boutique}`;
  };
  
  return (
    <Container className="py-5">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="/">Accueil</Breadcrumb.Item>
        <Breadcrumb.Item href="/profile">Profil</Breadcrumb.Item>
        <Breadcrumb.Item href="/profile/boutiques">Mes boutiques</Breadcrumb.Item>
        <Breadcrumb.Item active>
          {isEdit ? 'Modifier boutique' : 'Créer boutique'}
        </Breadcrumb.Item>
      </Breadcrumb>
      
      <div className="page-header mb-5">
        <h1 className="display-5 mb-3">
          {isEdit ? '✏️ Modifier votre boutique' : '🏪 Créez votre boutique en ligne'}
        </h1>
        <p className="lead text-muted">
          {isEdit 
            ? 'Mettez à jour les informations de votre boutique et gérez vos paramètres'
            : 'Vendez vos produits en ligne avec une boutique professionnelle en quelques minutes'
          }
        </p>
      </div>
      
      {/* Información sobre créditos */}
      {!isEdit && (
        <Alert variant="info" className="mb-5">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <i className="fas fa-coins fa-2x"></i>
            </div>
            <div>
              <h5 className="alert-heading mb-2">Crédits requis</h5>
              <p className="mb-2">
                La création d'une boutique nécessite des crédits. 
                Vous pouvez choisir un plan gratuit ou des plans payants avec plus de fonctionnalités.
              </p>
              <p className="mb-0">
                <strong>Votre solde actuel:</strong> {auth.user?.credits || 0} crédits
                <a href="/profile/credits" className="ms-3">
                  <i className="fas fa-plus-circle me-1"></i>
                  Acheter des crédits
                </a>
              </p>
            </div>
          </div>
        </Alert>
      )}
      
      {/* Wizard de creación/edición */}
      <CreateBoutiqueWizard 
        onSuccess={handleSuccess}
        isEdit={isEdit}
        // boutiqueData={boutiqueData} // Pasar datos si es edición
      />
      
      {/* Características */}
      {!isEdit && (
        <div className="mt-5 pt-5 border-top">
          <h3 className="mb-4 text-center">Pourquoi créer une boutique ?</h3>
          <div className="row g-4">
            {[
              {
                icon: 'fa-globe',
                title: 'Présence en ligne',
                desc: 'Soyez visible 24h/24, 7j/7'
              },
              {
                icon: 'fa-chart-line',
                title: 'Croissance',
                desc: 'Augmentez vos ventes avec notre marché'
              },
              {
                icon: 'fa-tools',
                title: 'Outils professionnels',
                desc: 'Gestion complète des produits et commandes'
              },
              {
                icon: 'fa-shield-alt',
                title: 'Sécurité',
                desc: 'Paiements sécurisés et données protégées'
              },
              {
                icon: 'fa-users',
                title: 'Clientèle',
                desc: 'Accédez à des milliers d\'acheteurs'
              },
              {
                icon: 'fa-mobile-alt',
                title: 'Mobile-friendly',
                desc: 'Boutique optimisée pour mobile'
              }
            ].map((feature, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="text-center p-3">
                  <div className="feature-icon mb-3">
                    <i className={`fas ${feature.icon} fa-2x text-primary`}></i>
                  </div>
                  <h5>{feature.title}</h5>
                  <p className="text-muted">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Estilos */}
      <style jsx>{`
        .page-header {
          text-align: center;
        }
        
        .feature-icon {
          width: 70px;
          height: 70px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 2px solid #e9ecef;
        }
        
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </Container>
  );
};

export default CreateBoutiquePage;