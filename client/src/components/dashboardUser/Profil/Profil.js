import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import InfoPersonnelle from './InfoPersonnelle';
import Verification from './Verification';
import Security from './Security';
import Preferences from './Preferences';

const Profil = () => {
  return (
    <div className="profil">
      <Tabs defaultActiveKey="info" className="mb-4">
        <Tab eventKey="info" title="Informations">
          <InfoPersonnelle />
        </Tab>
        <Tab eventKey="verification" title="Vérification">
          <Verification />
        </Tab>
        <Tab eventKey="security" title="Sécurité">
          <Security />
        </Tab>
        <Tab eventKey="preferences" title="Préférences">
          <Preferences />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Profil;