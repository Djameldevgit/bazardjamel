// src/pages/Store/StoreDetail.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
 import { getStoreBySlug } from '../../redux/actions/postAction';
 
import Posts from '../../components/home/Posts';

const StoreDetail = ({ boutiqueSlug }) => {
  const dispatch = useDispatch();
  const { store, loading } = useSelector(state => state.store);
  
  useEffect(() => {
    if (boutiqueSlug) {
      dispatch(getStoreBySlug(boutiqueSlug));
    }
  }, [dispatch, boutiqueSlug]);
  
  if (loading) return <div>Loading...</div>;
  if (!store) return <div>Boutique no encontrada</div>;
  
  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-md-3">
          <img 
            src={store.logo} 
            alt={store.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-9">
          <h1>{store.name}</h1>
          <p>{store.description}</p>
          <div className="d-flex gap-2">
            <button className="btn btn-primary">Contactar</button>
            <button className="btn btn-outline-secondary">Seguir</button>
          </div>
        </div>
      </div>
      
      <div className="mt-5">
        <h3>Productos de esta boutique</h3>
        <Posts 
          selectedCategory="store" 
          selectedSubcategory={store._id}
        />
      </div>
    </div>
  );
};

export default StoreDetail;