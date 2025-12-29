import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Datos de las wilayas de Argelia con traducciones
const algeriaWilayas = [
  { code: '01', name: { fr: 'Adrar', ar: 'أدرار' } },
  { code: '02', name: { fr: 'Chlef', ar: 'الشلف' } },
  { code: '03', name: { fr: 'Laghouat', ar: 'الأغواط' } },
  { code: '04', name: { fr: 'Oum El Bouaghi', ar: 'أم البواقي' } },
  { code: '05', name: { fr: 'Batna', ar: 'باتنة' } },
  { code: '06', name: { fr: 'Béjaïa', ar: 'بجاية' } },
  { code: '07', name: { fr: 'Biskra', ar: 'بسكرة' } },
  { code: '08', name: { fr: 'Béchar', ar: 'بشار' } },
  { code: '09', name: { fr: 'Blida', ar: 'البليدة' } },
  { code: '10', name: { fr: 'Bouira', ar: 'البويرة' } },
  { code: '11', name: { fr: 'Tamanrasset', ar: 'تمنراست' } },
  { code: '12', name: { fr: 'Tébessa', ar: 'تبسة' } },
  { code: '13', name: { fr: 'Tlemcen', ar: 'تلمسان' } },
  { code: '14', name: { fr: 'Tiaret', ar: 'تيارت' } },
  { code: '15', name: { fr: 'Tizi Ouzou', ar: 'تيزي وزو' } },
  { code: '16', name: { fr: 'Alger', ar: 'الجزائر' } },
  { code: '17', name: { fr: 'Djelfa', ar: 'الجلفة' } },
  { code: '18', name: { fr: 'Jijel', ar: 'جيجل' } },
  { code: '19', name: { fr: 'Sétif', ar: 'سطيف' } },
  { code: '20', name: { fr: 'Saïda', ar: 'سعيدة' } },
  { code: '21', name: { fr: 'Skikda', ar: 'سكيكدة' } },
  { code: '22', name: { fr: 'Sidi Bel Abbès', ar: 'سيدي بلعباس' } },
  { code: '23', name: { fr: 'Annaba', ar: 'عنابة' } },
  { code: '24', name: { fr: 'Guelma', ar: 'قالمة' } },
  { code: '25', name: { fr: 'Constantine', ar: 'قسنطينة' } },
  { code: '26', name: { fr: 'Médéa', ar: 'المدية' } },
  { code: '27', name: { fr: 'Mostaganem', ar: 'مستغانم' } },
  { code: '28', name: { fr: 'M\'Sila', ar: 'المسيلة' } },
  { code: '29', name: { fr: 'Mascara', ar: 'معسكر' } },
  { code: '30', name: { fr: 'Ouargla', ar: 'ورقلة' } },
  { code: '31', name: { fr: 'Oran', ar: 'وهران' } },
  { code: '32', name: { fr: 'El Bayadh', ar: 'البيض' } },
  { code: '33', name: { fr: 'Illizi', ar: 'إليزي' } },
  { code: '34', name: { fr: 'Bordj Bou Arréridj', ar: 'برج بوعريريج' } },
  { code: '35', name: { fr: 'Boumerdès', ar: 'بومرداس' } },
  { code: '36', name: { fr: 'El Tarf', ar: 'الطارف' } },
  { code: '37', name: { fr: 'Tindouf', ar: 'تندوف' } },
  { code: '38', name: { fr: 'Tissemsilt', ar: 'تيسمسيلت' } },
  { code: '39', name: { fr: 'El Oued', ar: 'الوادي' } },
  { code: '40', name: { fr: 'Khenchela', ar: 'خنشلة' } },
  { code: '41', name: { fr: 'Souk Ahras', ar: 'سوق أهراس' } },
  { code: '42', name: { fr: 'Tipaza', ar: 'تيبازة' } },
  { code: '43', name: { fr: 'Mila', ar: 'ميلة' } },
  { code: '44', name: { fr: 'Aïn Defla', ar: 'عين الدفلى' } },
  { code: '45', name: { fr: 'Naâma', ar: 'النعامة' } },
  { code: '46', name: { fr: 'Aïn Témouchent', ar: 'عين تموشنت' } },
  { code: '47', name: { fr: 'Ghardaïa', ar: 'غرداية' } },
  { code: '48', name: { fr: 'Relizane', ar: 'غليزان' } },
  { code: '49', name: { fr: 'El M\'Ghair', ar: 'المغير' } },
  { code: '50', name: { fr: 'El Menia', ar: 'المنيعة' } },
  { code: '51', name: { fr: 'Ouled Djellal', ar: 'أولاد جلال' } },
  { code: '52', name: { fr: 'Bordj Badji Mokhtar', ar: 'برج باجي مختار' } },
  { code: '53', name: { fr: 'Béni Abbès', ar: 'بني عباس' } },
  { code: '54', name: { fr: 'Timimoun', ar: 'تيميمون' } },
  { code: '55', name: { fr: 'Touggourt', ar: 'تقرت' } },
  { code: '56', name: { fr: 'Djanet', ar: 'جانت' } },
  { code: '57', name: { fr: 'In Salah', ar: 'عين صالح' } },
  { code: '58', name: { fr: 'In Guezzam', ar: 'عين قزام' } }
];

const WilayaCommunesField = ({
  postData = {},
  handleChangeInput,
  wilayaName = 'wilaya',
  communeName = 'commune',
  label = '📍 Ubicación',
  wilayaLabel = 'Wilaya',
  communeLabel = 'Comuna',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation("formfields");
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;

  // Extraer valores de postData
  const wilayaValue = postData?.[wilayaName] || '';
  const communeValue = postData?.[communeName] || '';

  // Generar opciones de wilayas basadas en el idioma actual
  const wilayasOptions = algeriaWilayas.map((wilaya) => (
    <option key={wilaya.code} value={wilaya.name[currentLanguage === 'ar' ? 'ar' : 'fr']}>
      {wilaya.name[currentLanguage === 'ar' ? 'ar' : 'fr']}
    </option>
  ));

  // ESTILOS IDÉNTICOS A MODELO
  const styles = {
    formControl: {
      border: `1px solid ${theme === 'dark' ? '#4a5568' : '#cbd5e0'}`,
      backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
      padding: '10px 12px',
      borderRadius: '8px',
      color: theme === 'dark' ? 'white' : '#2d3748',
      width: '100%',
      fontSize: '14px'
    },
    formLabel: {
      fontWeight: '600',
      marginBottom: '6px',
      display: 'block',
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748'
    }
  };

  // Manejar cambios para ambos campos
  const handleFieldChange = (e) => {
    handleChangeInput(e);
  };

  return (
    <>
      {/* 📄 WILAYA */}
      <Form.Group className={className}>
        <Form.Label style={styles.formLabel}>
          {wilayaLabel} {required && '*'}
        </Form.Label>
        
        <Form.Select
          name={wilayaName}
          value={wilayaValue}
          onChange={handleFieldChange}
          required={required}
          disabled={disabled}
          isInvalid={!!error?.wilaya}
          style={{
            ...styles.formControl,
            textAlign: isRTL ? 'right' : 'left',
            direction: isRTL ? 'rtl' : 'ltr'
          }}
        >
          <option value="">{t('selectWilaya', 'Selecciona la wilaya')}</option>
          {wilayasOptions}
        </Form.Select>
        
        <div className="text-muted small mt-1" style={{
          textAlign: isRTL ? 'left' : 'right',
          direction: 'ltr'
        }}>
          {t('wilayaHelp', 'Selecciona tu provincia')}
        </div>
        
        {error?.wilaya && (
          <Form.Control.Feedback type="invalid">
            {error.wilaya}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      {/* 📄 COMMUNE */}
      <Form.Group className={className}>
        <Form.Label style={styles.formLabel}>
          {communeLabel} {required && '*'}
        </Form.Label>
        
        <Form.Control
          type="text"
          name={communeName}
          value={communeValue}
          onChange={handleFieldChange}
          required={required}
          disabled={disabled}
          isInvalid={!!error?.commune}
          style={{
            ...styles.formControl,
            textAlign: isRTL ? 'right' : 'left',
            direction: isRTL ? 'rtl' : 'ltr'
          }}
          placeholder={t('communePlaceholder', 'Ej: Bab El Oued, Sidi Mhamed...')}
        />
        
        <div className="text-muted small mt-1" style={{
          textAlign: isRTL ? 'left' : 'right',
          direction: 'ltr'
        }}>
          {t('communeHelp', 'Nombre de tu ciudad/barrio')}
        </div>
        
        {error?.commune && (
          <Form.Control.Feedback type="invalid">
            {error.commune}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </>
  );
};

export default WilayaCommunesField;