// src/components/DashboardUser/DashboardLayout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

// Crear componentes básicos inline si no existen aún
const Sidebar = ({ activeSection, setActiveSection }) => (
  <div style={{ width: '280px', background: 'white', height: '100vh' }}>
    {/* Sidebar básico */}
  </div>
);

const Header = ({ onMenuClick, activeSection }) => (
  <div style={{ background: 'white', padding: '15px' }}>
    {/* Header básico */}
  </div>
);

const DashboardLayout = ({ children, activeSection, setActiveSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="d-none d-lg-block" style={{ width: '280px' }}>
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: '280px' }}>
        <Header 
          onMenuClick={() => setMobileMenuOpen(true)}
          activeSection={activeSection}
        />
        <Container fluid style={{ paddingTop: '20px' }}>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;