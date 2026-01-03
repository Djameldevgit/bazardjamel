// src/pages/categorySubCategory/SubcategoryPage.js - VERSIÓN ACTUALIZADA
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
  getPostsBySubcategory, 
  getPostsByImmobilierOperation 
} from '../../redux/actions/postAction';
import Posts from '../../components/home/Posts';

const SubcategoryPage = ({ categoryName, subcategoryId, page = "1" }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const { loading } = useSelector(state => state.homePosts || {});
  
  useEffect(() => {
    console.log('📂 SubcategoryPage:', {
      categoryName,
      subcategoryId,  // Puede ser "voitures" o "vente-appartement"
      page
    });
    
    // 🏠 CASO ESPECIAL: Inmuebles con jerarquía
    if (categoryName === "immobilier" && subcategoryId.includes('-')) {
      const parts = subcategoryId.split('-');
      const operation = parts[0]; // "vente", "location"
      const property = parts.slice(1).join(' '); // "appartement", "maison moderne"
      
      console.log('🏠 Inmueble con jerarquía:', { operation, property });
      
      // Para inmuebles, usar la acción específica
      dispatch(getPostsByImmobilierOperation(operation, parseInt(page)));
      
    } else {
      // 📂 CASO NORMAL: Subcategoría simple
      dispatch(getPostsBySubcategory(categoryName, subcategoryId, parseInt(page)));
    }
  }, [categoryName, subcategoryId, page, dispatch]);
  
  // Formatear título para mostrar
  const getDisplayTitle = () => {
    if (categoryName === "immobilier" && subcategoryId.includes('-')) {
      const parts = subcategoryId.split('-');
      return `${parts[0]} - ${parts.slice(1).join(' ')}`;
    }
    return subcategoryId.replace('-', ' ');
  };
  
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a 
                  href={`/${categoryName}/1`}
                  onClick={(e) => {
                    e.preventDefault();
                    history.push(`/${categoryName}/1`);
                  }}
                >
                  {categoryName}
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {getDisplayTitle()}
              </li>
            </ol>
          </nav>
          
          <h1 className="display-5 fw-bold">
            {categoryName} - {getDisplayTitle()}
          </h1>
        </div>
      </div>
      
      {/* Posts filtrados por subcategoría */}
      <div className="row">
        <div className="col-12">
          <Posts 
            fromSubcategoryPage={true}
            selectedCategory={categoryName}
            selectedSubcategory={subcategoryId}
            page={parseInt(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default SubcategoryPage;