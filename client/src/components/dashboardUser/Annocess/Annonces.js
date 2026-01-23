import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import AnnoncesList from './AnnoncesList';
import CreateAnnonce from './CreateAnnonce';
 
 

const Annonces = () => {
  const [activeTab, setActiveTab] = useState('mes-annonces');

  return (
    <div className="annonces">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="mes-annonces" title="Mes Annonces">
          <AnnoncesList />
        </Tab>
        <Tab eventKey="creer" title="Créer une annonce">
          <CreateAnnonce />
        </Tab>
        <Tab eventKey="sauvegardes" title="Sauvegardées">
          <div className="text-center py-5">
            <p>Annonces sauvegardées</p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};
export default Annonces