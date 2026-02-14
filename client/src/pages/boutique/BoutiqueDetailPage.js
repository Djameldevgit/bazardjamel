// pages/BoutiqueDetailPage.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBoutique } from '../../redux/actions/boutiqueAction';
const BoutiqueDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBoutique, loading } = useSelector(state => state.boutique);

  useEffect(() => {
    if (id) {
      dispatch(getBoutique(id));
    }
  }, [id, dispatch]);

  if (loading) return <Spinner />;
  if (!currentBoutique) return <NotFound />;

  return (
    <div className="boutique-detail">
      <h1>{currentBoutique.nom_boutique}</h1>
      <p>{currentBoutique.description_boutique}</p>
      {/* Resto de la información */}
    </div>
  );
};
export default BoutiqueDetailPage