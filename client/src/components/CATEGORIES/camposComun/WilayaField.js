import React, { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const WilayaField = ({ 
  postData, 
  handleChangeInput,
  name = 'wilaya',
  label = 'Wilaya'
}) => {
  const { t } = useTranslation('camposcomunes');
  // 🇩🇿 LISTA DE WILAYAS DE ARGELIA
  const wilayas = useMemo(() => [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou',
    'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès',
    'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara',
    'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès',
    'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela', 'Souk Ahras',
    'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane'
  ], []);
  
  return (
    <Form.Group className="mt-3">
      <Form.Label>📍 {t(label)}</Form.Label>
      
      <Form.Select
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        required
      >
        <option value="">{t('select_wilaya', 'Sélectionnez une wilaya')}</option>
        {wilayas.map((wilaya) => (
          <option key={wilaya} value={wilaya}>{wilaya}</option>
        ))}
      </Form.Select>
      
      <Form.Text className="text-muted">
        <small>Wilaya où se trouve le produit/le service</small>
      </Form.Text>
    </Form.Group>
  );
};

export default WilayaField;