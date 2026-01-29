// src/components/CATEGORIES/specificFields/VehiculesFields.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';
import Select from 'react-select'; // Importar react-select

// Campos que vamos a usar
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';
import DescriptionField from '../camposComun/DescriptionField';
import ModeleVehiculesField from '../camposComun/ModeleVehiculesField';
import MarqueVehiculesField from '../camposComun/MarqueVehiculesField';

const VehiculesFields = (props) => {
  // Opciones para optionduvoiture según tu código
  const optionduvoiture = [
    { label: 'Climatisation', value: 'Climatisation' },
    { label: 'Alarme', value: 'Alarme' },
    { label: 'Jantes alliage', value: 'Jantes alliage' },
    { label: 'Rétroviseurs électriques', value: 'Rétroviseurs électriques' },
    { label: 'Vitres électriques', value: 'Vitres électriques' },
    { label: 'ESP', value: 'ESP' },
    { label: 'Phares antibrouillard', value: 'Phares antibrouillard' },
    { label: 'Feux de jour', value: 'Feux de jour' },
    { label: 'Radar de recul', value: 'Radar de recul' },
    { label: 'Direction assistée', value: 'Direction assistée' },
    { label: 'Radio CD', value: 'Radio CD' },
    { label: 'Toit ouvrant', value: 'Toit ouvrant' },
    { label: 'Phares xénon', value: 'Phares xénon' },
    { label: 'Sièges chauffants', value: 'Sièges chauffants' },
    { label: 'Sièges en cuir', value: 'Sièges en cuir' },
    { label: 'Système de navigation (GPS)', value: 'GPS' },
    { label: 'Caméra de recul', value: 'Caméra de recul' },
    { label: 'Capteur de pluie', value: 'Capteur de pluie' },
    { label: 'Capteur de luminosité', value: 'Capteur de luminosité' },
    { label: 'Régulateur de vitesse', value: 'Régulateur de vitesse' },
    { label: 'Limiteur de vitesse', value: 'Limiteur de vitesse' },
    { label: 'Aide au stationnement', value: 'Aide au stationnement' },
    { label: 'Bluetooth', value: 'Bluetooth' },
    { label: 'Commande vocale', value: 'Commande vocale' },
    { label: 'Affichage tête haute', value: 'Affichage tête haute' },
    { label: 'Volant chauffant', value: 'Volant chauffant' },
    { label: 'Démarrage sans clé', value: 'Démarrage sans clé' },
    { label: 'Freinage d\'urgence automatique', value: 'Freinage d\'urgence automatique' },
    { label: 'Alerte de franchissement de ligne', value: 'Alerte de franchissement de ligne' },
    { label: 'Surveillance des angles morts', value: 'Surveillance des angles morts' },
    { label: 'Suspension adaptative', value: 'Suspension adaptative' },
    { label: 'Toit panoramique', value: 'Toit panoramique' },
    { label: 'Chargeur sans fil', value: 'Chargeur sans fil' },
    { label: 'Éclairage d\'ambiance', value: 'Éclairage d\'ambiance' },
    { label: 'Assistance au maintien de voie', value: 'Assistance au maintien de voie' }
  ];

  // Manejador para optionduvoiture con react-select
  const handleChangeOptionduvoiture = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    
    props.handleChangeInput({
      target: {
        name: 'optionduvoiture',
        value: values
      }
    });
  };

  // Obtener valores seleccionados para react-select
  const getSelectedOptions = () => {
    const selectedValues = props.postData?.optionduvoiture || [];
    return optionduvoiture.filter(option => 
      selectedValues.includes(option.value)
    );
  };

  // Campos adicionales específicos para vehículos
  const additionalFields = {
    // Componentes personalizados
    components: {
      'marque': (
        <MarqueField
          key="marque"
          mainCategory={props.mainCategory}
          subCategory={props.subCategory}
          fieldName="marque"
          postData={props.postData}
          handleChangeInput={props.handleChangeInput}
          isRTL={props.isRTL}
          t={props.t}
        />
      ),
      'modele': (
        <ModeleField
          key="modele"
          mainCategory={props.mainCategory}
          subCategory={props.subCategory}
          fieldName="modele"
          postData={props.postData}
          handleChangeInput={props.handleChangeInput}
          isRTL={props.isRTL}
          t={props.t}
        />
      ),
      'marqueVehicules': (
        <MarqueVehiculesField
          key="marqueVehicules"
          mainCategory={props.mainCategory}
          subCategory={props.subCategory}
          fieldName="marqueVehicules"
          postData={props.postData}
          handleChangeInput={props.handleChangeInput}
          isRTL={props.isRTL}
          t={props.t}
        />
      ),
      'modeleVehicules': (
        <ModeleVehiculesField
          key="modeleVehicules"
          mainCategory={props.mainCategory}
          subCategory={props.subCategory}
          fieldName="modeleVehicules"
          postData={props.postData}
          handleChangeInput={props.handleChangeInput}
          isRTL={props.isRTL}
          t={props.t}
        />
      ),

      
      'annee': (
        <div key="annee" className="form-field mb-3">
          <label htmlFor="annee" className="form-label fw-bold">
            Année {props.isRequired && <span className="text-danger">*</span>}
          </label>
          <select
            id="annee"
            name="annee"
            value={props.postData?.annee || ''}
            onChange={props.handleChangeInput}
            required={props.isRequired}
            dir={props.isRTL ? 'rtl' : 'ltr'}
            className="form-select form-select-lg"
          >
            <option value="">Sélectionner l'année</option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      ),
      'kilometrage': (
        <div key="kilometrage" className="form-field mb-3">
          <label htmlFor="kilometrage" className="form-label fw-bold">
            Kilométrage (km) {props.isRequired && <span className="text-danger">*</span>}
          </label>
          <input
            type="number"
            id="kilometrage"
            name="kilometrage"
            value={props.postData?.kilometrage || ''}
            onChange={props.handleChangeInput}
            min="0"
            step="1"
            placeholder="kilometrage en Km"
            required={props.isRequired}
            dir={props.isRTL ? 'rtl' : 'ltr'}
            className="form-control form-control-lg"
          />
        </div>
      ),
      'energie': (
        <div key="energie" className="form-field mb-3">
          <label htmlFor="energie" className="form-label fw-bold">
            Énergie {props.isRequired && <span className="text-danger">*</span>}
          </label>
          <select
            id="energie"
            name="energie"
            value={props.postData?.energie || ''}
            onChange={props.handleChangeInput}
            required={props.isRequired}
            dir={props.isRTL ? 'rtl' : 'ltr'}
            className="form-select form-select-lg"
          >
            <option value="">Energie</option>
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="GPL">GPL</option>
            <option value="Électrique">Électrique</option>
            <option value="Hybride">Hybride</option>
          </select>
        </div>
      ),
      'boite': (
        <div key="boite" className="form-field mb-3">
          <label htmlFor="boite" className="form-label fw-bold">
            Boîte de vitesses
          </label>
          <select
            id="boite"
            name="boite"
            value={props.postData?.boite || ''}
            onChange={props.handleChangeInput}
            dir={props.isRTL ? 'rtl' : 'ltr'}
            className="form-select form-select-lg"
          >
            <option value="">Boite</option>
            <option value="Manuelle">Manuelle</option>
            <option value="Automatique">Automatique</option>
            <option value="Semi-Automatique">Semi Automatique</option>
          </select>
        </div>
      ),
      'finition': (
        <div key="finition" className="form-field mb-3">
          <label htmlFor="finition" className="form-label fw-bold">
            Finition
          </label>
          <input
            type="text"
            id="finition"
            name="finition"
            value={props.postData?.finition || ''}
            onChange={props.handleChangeInput}
            placeholder="finition"
            dir={props.isRTL ? 'rtl' : 'ltr'}
            className="form-control form-control-lg"
          />
        </div>
      ),
      'moteur': (
        <div key="moteur" className="form-field mb-3">
          <label htmlFor="moteur" className="form-label fw-bold">
            Moteur
          </label>
          <input
            type="text"
            id="moteur"
            name="moteur"
            value={props.postData?.moteur || ''}
            onChange={props.handleChangeInput}
            placeholder="Moteur"
            dir={props.isRTL ? 'rtl' : 'ltr'}
            className="form-control form-control-lg"
          />
        </div>
      ),
      'couleur': (
        <div key="couleur" className="form-field mb-3">
          <label htmlFor="couleur" className="form-label fw-bold">
            Couleur
          </label>
          <select
            id="couleur"
            name="couleur"
            value={props.postData?.couleur || ''}
            onChange={props.handleChangeInput}
            dir={props.isRTL ? 'rtl' : 'ltr'}
            className="form-select form-select-lg"
          >
            <option value="">Couleur</option>
            <option value="Blanc">Blanc</option>
            <option value="Noir">Noir</option>
            <option value="Gris">Gris</option>
            <option value="Argent">Argent</option>
            <option value="Bleu">Bleu</option>
            <option value="Bleu clair">Bleu clair</option>
            <option value="Bleu marine">Bleu marine</option>
            <option value="Rouge">Rouge</option>
            <option value="Bordeaux">Bordeaux</option>
            <option value="Vert">Vert</option>
            <option value="Vert foncé">Vert foncé</option>
            <option value="Jaune">Jaune</option>
            <option value="Orange">Orange</option>
            <option value="Marron">Marron</option>
            <option value="Beige">Beige</option>
            <option value="Violet">Violet</option>
            <option value="Rose">Rose</option>
            <option value="Obergine">Obergine</option>
            <option value="Doré">Doré</option>
            <option value="Bronze">Bronze</option>
          </select>
        </div>
      ),
      'papiers': (
        <div key="papiers" className="form-field mb-3">
          <label htmlFor="papiers" className="form-label fw-bold">
            Papiers
          </label>
          <select
            id="papiers"
            name="papiers"
            value={props.postData?.papiers || ''}
            onChange={props.handleChangeInput}
            dir={props.isRTL ? 'rtl' : 'ltr'}
            className="form-select form-select-lg"
          >
            <option value="">Papiers</option>
            <option value="Carte Gris / Safia">Carte Gris / Safia</option>
            <option value="Carte Jaune">Carte Jaune</option>
            <option value="Licence / Délai">Licence / Délai</option>
          </select>
        </div>
      ),
      'optionduvoiture': (
        <div key="optionduvoiture" className="form-field mb-3">
          <label htmlFor="optionduvoiture" className="form-label fw-bold">
            Options du véhicule
          </label>
          <Select
            id="optionduvoiture"
            name="optionduvoiture"
            value={getSelectedOptions()}
            onChange={handleChangeOptionduvoiture}
            options={optionduvoiture}
            isMulti
            isSearchable
            closeMenuOnSelect={false}
            placeholder="Sélectionnez les options..."
            noOptionsMessage={() => "Aucune option trouvée"}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? '#0d6efd' : '#ced4da',
                boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none',
                '&:hover': {
                  borderColor: '#0d6efd'
                },
                padding: '8px 12px',
                fontSize: '1rem',
                minHeight: '56px'
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#e7f1ff',
                borderRadius: '4px'
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#0d6efd',
                fontWeight: '500'
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: '#0d6efd',
                ':hover': {
                  backgroundColor: '#0d6efd',
                  color: 'white'
                }
              })
            }}
          />
          <div className="form-text text-muted mt-1">
            Sélectionnez une ou plusieurs options (recherche disponible)
          </div>
        </div>
      ),

      





    },

    // Campos personalizados con prefijo "custom:"
    customComponents: {}
  };

  return (
    <BaseCategoryField
      {...props}
      additionalFields={additionalFields}
    />
  );
};

export default VehiculesFields;