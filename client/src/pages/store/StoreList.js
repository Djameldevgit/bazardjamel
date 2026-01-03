// src/pages/boutique/SList.js (antes store/StoreList.js)
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStores } from '../../redux/actions/storeAction';

const StoreList = ({ page = "1" }) => {
  const dispatch = useDispatch();
  const { stores, loading } = useSelector(state => state.store);
  
  useEffect(() => {
    dispatch(getStores({ page: parseInt(page) }));
  }, [dispatch, page]);
  
  return (
    <div className="container py-4">
      <h1>Store</h1>
      <div className="row">
        {stores.map(store => (
          <div key={store._id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{store.name}</h5>
                <p className="card-text">{store.description}</p>
                <Link 
                  to={`/boutique-${store.slug}/1`}
                  className="btn btn-primary"
                >
                  Ver Boutique
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;