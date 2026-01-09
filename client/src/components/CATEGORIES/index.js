// 📂 components/CATEGORIES/index.js
import categoryImmobilier from './categoryNivel/categoryImmobiler';
import categoryVehicules from './categoryNivel/categoryVehicules';
import categoryPiecesDetachees from './categoryNivel/categoryPiecesDetachees';
import categoryTelephones from './categoryNivel/categoryTelephones';
import categoryInformatique from './categoryNivel/categoryInformatique';

import categoryElectromenager from './categoryNivel/categoryElectromenager';
import categoryVetements from './categoryNivel/categoryVetements';
import categorySanteBeaute from './categoryNivel/categorySanteBeaute';
import categoryMeubles from './categoryNivel/categoryMeubles';
import categoryLoisirs from './categoryNivel/categoryLoisirs';

import categorySport from './categoryNivel/categorySport';
import categoryEmploi from './categoryNivel/categoryEmploi';
import categoryMateriaux from './categoryNivel/categoryMateriaux';
import categoryAlimentaires from './categoryNivel/categoryAlimentaires';
import categoryServices from './categoryNivel/categoryServices';

import categoryVoyages from './categoryNivel/categoryVoyages';
import categoryBoutiques from './categoryNivel/categoryBoutiques'; // ⭐ NUEVO
 
export const categoryHierarchy = {
  immobilier: categoryImmobilier,
  vehicules: categoryVehicules,
  piecesDetachees: categoryPiecesDetachees,
  telephones:categoryTelephones,
  informatique: categoryInformatique,

  electromenager: categoryElectromenager,
  vetements: categoryVetements,
  santebeaute: categorySanteBeaute,
  meubles: categoryMeubles,
  loisirs: categoryLoisirs,

  sport: categorySport,
  emploi: categoryEmploi,
  materiaux: categoryMateriaux,
  alimentaires: categoryAlimentaires,
  services: categoryServices,

  voyages: categoryVoyages,
  boutiques: categoryBoutiques, // ⭐ AÑADIR
};

export default categoryHierarchy;