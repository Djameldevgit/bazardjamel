// src/components/DashboardUser/DashboardLayout/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { 
    Speedometer2,
    Newspaper,
    Shop,
    Megaphone,
    Cart,
    Chat,
    Bell,
    Person,
    Gear,
    CreditCard,
    GraphUp,
    ShieldCheck,
    Envelope,
    Clock,
    Star
} from 'react-bootstrap-icons';

const Sidebar = ({ activeSection, setActiveSection }) => {
    const menuItems = [
        {
            id: 'overview',
            title: 'Vue d\'ensemble',
            icon: <Speedometer2 size={20} />,
            color: 'primary'
        },
        {
            id: 'annonces',
            title: 'Mes Annonces',
            icon: <Newspaper size={20} />,
            color: 'success',
            badge: '12'
        },
        {
            id: 'boutique',
            title: 'Ma Boutique',
            icon: <Shop size={20} />,
            color: 'warning',
            premium: true
        },
        {
            id: 'publicite',
            title: 'Publicité',
            icon: <Megaphone size={20} />,
            color: 'info',
            premium: true
        },
        {
            id: 'commandes',
            title: 'Commandes',
            icon: <Cart size={20} />,
            color: 'danger',
            badge: '3'
        },
        {
            id: 'conversations',
            title: 'Conversations',
            icon: <Chat size={20} />,
            color: 'purple',
            badge: '5'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: <Bell size={20} />,
            color: 'orange',
            badge: '7'
        },
        {
            id: 'profil',
            title: 'Mon Profil',
            icon: <Person size={20} />,
            color: 'teal'
        },
        {
            id: 'parametres',
            title: 'Paramètres',
            icon: <Gear size={20} />,
            color: 'secondary'
        }
    ];

    const quickActions = [
        {
            id: 'create-annonce',
            title: 'Publier une annonce',
            icon: <PlusCircle size={18} />,
            action: () => setActiveSection('annonces')
        },
        {
            id: 'stats',
            title: 'Voir les statistiques',
            icon: <GraphUp size={18} />,
            action: () => setActiveSection('overview')
        },
        {
            id: 'verification',
            title: 'Vérifier mon compte',
            icon: <ShieldCheck size={18} />,
            action: () => setActiveSection('profil')
        }
    ];

    return (
        <div className="sidebar bg-white border-end" style={{ 
            width: '280px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1000,
            overflowY: 'auto',
            boxShadow: '2px 0 10px rgba(0,0,0,0.05)'
        }}>
            {/* Logo */}
            <div className="p-4 border-bottom">
                <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-3 p-2 me-3">
                        <i className="fas fa-store fa-lg text-white"></i>
                    </div>
                    <div>
                        <h4 className="mb-0 fw-bold">Tableau de bord</h4>
                        <small className="text-muted">Espace utilisateur</small>
                    </div>
                </div>
            </div>

            {/* Menu principal */}
            <div className="p-3">
                <h6 className="text-uppercase text-muted mb-3 small fw-bold">Navigation</h6>
                <Nav className="flex-column">
                    {menuItems.map((item) => (
                        <Nav.Link
                            key={item.id}
                            className={`d-flex align-items-center py-3 px-3 mb-1 rounded-3 ${
                                activeSection === item.id 
                                    ? 'bg-primary text-white' 
                                    : 'text-dark hover-bg'
                            }`}
                            onClick={() => setActiveSection(item.id)}
                            style={{ 
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span className={`me-3 ${activeSection === item.id ? 'text-white' : `text-${item.color}`}`}>
                                {item.icon}
                            </span>
                            <span className="flex-grow-1">{item.title}</span>
                            
                            {item.badge && (
                                <span className={`badge rounded-pill ${activeSection === item.id ? 'bg-white text-primary' : 'bg-primary'}`}>
                                    {item.badge}
                                </span>
                            )}
                            
                            {item.premium && (
                                <span className="ms-2">
                                    <Star size={12} className="text-warning" />
                                </span>
                            )}
                        </Nav.Link>
                    ))}
                </Nav>

                {/* Actions rapides */}
                <div className="mt-5">
                    <h6 className="text-uppercase text-muted mb-3 small fw-bold">Actions rapides</h6>
                    <div className="d-grid gap-2">
                        {quickActions.map((action) => (
                            <button
                                key={action.id}
                                className="btn btn-outline-primary btn-sm rounded-pill py-2"
                                onClick={action.action}
                            >
                                <span className="me-2">{action.icon}</span>
                                {action.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Statistiques rapides */}
                <div className="mt-5">
                    <h6 className="text-uppercase text-muted mb-3 small fw-bold">Aujourd'hui</h6>
                    <div className="bg-light rounded-3 p-3">
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">Vues</span>
                            <span className="fw-bold">156</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">Likes</span>
                            <span className="fw-bold">24</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="text-muted small">Messages</span>
                            <span className="fw-bold">8</span>
                        </div>
                    </div>
                </div>

                {/* Bouton d'aide */}
                <div className="mt-4">
                    <button className="btn btn-light w-100 rounded-pill py-2 border">
                        <i className="fas fa-question-circle me-2"></i>
                        Centre d'aide
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto p-3 border-top">
                <div className="d-flex align-items-center">
                    <img 
                        src="https://ui-avatars.com/api/?name=Utilisateur&background=007bff&color=fff" 
                        alt="Avatar" 
                        className="rounded-circle me-3"
                        width="40"
                        height="40"
                    />
                    <div>
                        <h6 className="mb-0 small fw-bold">Compte Standard</h6>
                        <small className="text-muted">Mettre à niveau</small>
                    </div>
                    <button className="btn btn-sm btn-outline-primary ms-auto">
                        <i className="fas fa-arrow-up"></i>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .sidebar {
                    scrollbar-width: thin;
                    scrollbar-color: #dee2e6 transparent;
                }
                
                .sidebar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .sidebar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .sidebar::-webkit-scrollbar-thumb {
                    background-color: #dee2e6;
                    border-radius: 20px;
                }
                
                .hover-bg:hover {
                    background-color: #f8f9fa !important;
                }
                
                @media (max-width: 992px) {
                    .sidebar {
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                    }
                    
                    .sidebar.mobile-open {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Sidebar;