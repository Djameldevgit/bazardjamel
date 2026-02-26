// components/boutique/cards/boutiquePostCard/BoutiquePostCardFooter.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPhone, FaStore } from 'react-icons/fa';

const BoutiquePostCardFooter = ({ boutique }) => {

  const themeColor = boutique?.couleur_theme || '#6366F1';

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
    <div
      className="p-3 pt-0 border-top"
      style={{
        background: '#fafafa',
        borderRadius: '0 0 12px 12px',
        boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="d-flex gap-2 justify-content-between"
        style={{
          flexWrap: 'wrap',
          transition: 'all 0.3s ease',
        }}
      >
        {/* 📞 Bouton Contact */}
        <Button
          variant="outline-primary"
          size="sm"
          className="flex-grow-1 py-2"
          onClick={handleContact}
          disabled={!boutique?.telephone}
          style={{
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            letterSpacing: '0.2px',
            borderColor: themeColor,
            color: themeColor,
            backgroundColor: 'white',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.boxShadow = `0 4px 10px ${themeColor}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = themeColor;
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
          }}
        >
          <FaPhone className="me-2" size={13} />
          {boutique?.telephone ? 'Contacter' : 'Non disponible'}
        </Button>

        {/* 🏬 Bouton Voir Boutique */}
        <Button
          variant="primary"
          size="sm"
          className="flex-grow-1 py-2"
          onClick={handleViewBoutique}
          style={{
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            letterSpacing: '0.2px',
            backgroundColor: themeColor,
            borderColor: themeColor,
            color: 'white',
            boxShadow: `0 2px 6px ${themeColor}33`,
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = themeColor;
            e.currentTarget.style.boxShadow = `0 4px 10px ${themeColor}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.boxShadow = `0 2px 6px ${themeColor}33`;
          }}
        >
          <FaStore className="me-2" size={13} />
          Voir boutique
        </Button>
      </div>
    </div>
  );
};

export default BoutiquePostCardFooter;