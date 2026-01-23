import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import BoutiqueInfo from './BoutiqueInfo';
import CreateBoutique from './CreateBoutique';

const Boutique = () => {
  const [hasBoutique, setHasBoutique] = useState(true);

  return (
    <div className="boutique">
      {hasBoutique ? (
        <BoutiqueInfo />
      ) : (
        <CreateBoutique onCreate={() => setHasBoutique(true)} />
      )}
    </div>
  );
};

export default Boutique;