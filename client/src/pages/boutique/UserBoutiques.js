// components/UserBoutiques.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBoutique } from '../../redux/actions/boutiqueAction';
 
const UserBoutiques = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { userBoutiques, loading } = useSelector(state => state.boutique);

  useEffect(() => {
    if (auth.token) {
      dispatch(getBoutique(auth));
    }
  }, [dispatch, auth.token]);

  if (loading) return <Spinner />;

  return (
    <div className="user-boutiques">
      <h2>Mes Boutiques</h2>
      {userBoutiques.length === 0 ? (
        <p>Vous n'avez pas encore de boutique</p>
      ) : (
        <div className="boutiques-grid">
          {userBoutiques.map(boutique => (
            <BoutiqueCard key={boutique._id} boutique={boutique} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBoutiques;