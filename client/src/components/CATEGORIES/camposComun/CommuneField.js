import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // AÑADIR import

const CommuneField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  name = 'commune', 
  label = 'commune',
  wilayaField = 'wilaya'
}) => {
  const { t } = useTranslation('camposcomunes'); // USAR useTranslation
  const [communes, setCommunes] = useState([]);
  
  // Simulación de datos - en producción sería API
  useEffect(() => {
    if (postData[wilayaField]) {
      const communesByWilaya = {
        '16': ['Alger-Centre', 'Hussein Dey', 'Sidi M\'hamed', 'El Madania', 'El Harrach'],
        '31': ['Oran', 'Es-Senia', 'Bir El Djir', 'El Ancor', 'Oued Tlelat'],
        '25': ['Constantine', 'El Khroub', 'Ain Smara', 'Zighoud Youcef', 'Didouche Mourad'],
        '19': ['Sétif', 'El Eulma', 'Ain Arnat', 'Ain Abessa', 'Bougaâ'],
      };
      
      setCommunes(communesByWilaya[postData[wilayaField]] || []);
    } else {
      setCommunes([]);
    }
  }, [postData[wilayaField], wilayaField]);
  
  return (
    <Form.Group>
      <Form.Label>🏘️ {t(label)}</Form.Label> {/* USAR t() */}
      <Form.Select
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
        disabled={!postData[wilayaField]}
      >
        <option value="">{t('select_commune')}</option> {/* USAR t() */}
        {communes.map(commune => (
          <option key={commune} value={commune}>
            {commune}
          </option>
        ))}
      </Form.Select>
      {!postData[wilayaField] && (
        <Form.Text className="text-muted">
          {t('select_wilaya_first')} {/* USAR t() */}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default CommuneField;