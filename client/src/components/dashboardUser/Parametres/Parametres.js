import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import GeneralSettings from './GeneralSettings';
import PrivacySettings from './PrivacySettings';
import AccountSettings from './AccountSettings';

const Parametres = () => {
  return (
    <div className="parametres">
      <Tabs defaultActiveKey="general" className="mb-4">
        <Tab eventKey="general" title="Général">
          <GeneralSettings />
        </Tab>
        <Tab eventKey="privacy" title="Confidentialité">
          <PrivacySettings />
        </Tab>
        <Tab eventKey="account" title="Compte">
          <AccountSettings />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Parametres;