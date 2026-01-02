import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStores, deleteStore } from '../../redux/actions/storeAction'
import StoreCard from '../../components/store/StoreCard'

const StoresList = () => {
  const { stores, auth, loading } = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStores(auth.token))
  }, [dispatch, auth.token])

  const handleDelete = (id) => {
    dispatch(deleteStore({ id, auth }))
  }

  return loading ? <p>Cargando...</p> : (
    <div>
      {stores.map(store => (
        <StoreCard key={store._id} store={store} onDelete={handleDelete} />
      ))}
    </div>
  )
}

export default StoresList
