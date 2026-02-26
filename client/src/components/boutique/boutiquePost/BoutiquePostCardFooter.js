// components/boutique/cards/boutiquePostCard/BoutiquePostCardFooter.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPhone, FaStore, FaShare } from 'react-icons/fa';

const BoutiquePostCardFooter = ({ boutique }) => {
 

  const handleContact = (e) => {
    e.stopPropagation();
    if (boutique?.telephone) {
      window.location.href = `tel:${boutique.telephone}`;
    }
  };

  const handleViewBoutique = (e) => {
    e.stopPropagation();
    window.location.href = `/boutique/${boutique._id}`;
  };

  return (
    <div className="p-3 pt-0">
      <div className="d-flex gap-2">
        <Button
          variant="outline-primary"
          size="sm"
          className="flex-grow-1 py-2"
          onClick={handleContact}
          style={{
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: '500',
            borderColor: boutique?.couleur_theme || '#6366F1',
            color: boutique?.couleur_theme || '#6366F1',
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease'
          }}
          disabled={!boutique?.telephone}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = boutique?.couleur_theme || '#6366F1';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = boutique?.couleur_theme || '#6366F1';
          }}
        >
          <FaPhone className="me-2" size={12} />
          {boutique?.telephone ? 'Contacter' : 'Non disponible'}
        </Button>
        
        <Button
          variant="primary"
          size="sm"
          className="flex-grow-1 py-2"
          onClick={handleViewBoutique}
          style={{
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: '500',
            backgroundColor: boutique?.couleur_theme || '#6366F1',
            borderColor: boutique?.couleur_theme || '#6366F1',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = boutique?.couleur_theme || '#6366F1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = boutique?.couleur_theme || '#6366F1';
            e.currentTarget.style.color = 'white';
          }}
        >
          <FaStore className="me-2" size={12} />
          Voir boutique
        </Button>
  
      </div>
      
       
    </div>
  );
};

export default BoutiquePostCardFooter;