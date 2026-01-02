import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getStore, updateStore } from '../../redux/actions/storeAction'
import StoreForm from '../../components/store/StoreForm'

const EditStore = () => {
  const { id } = useParams()
  const { store, auth } = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStore(id, auth.token))
  }, [id, dispatch, auth.token])

  const handleSubmit = (storeData) => {
    dispatch(updateStore({ storeData, auth, id }))
  }

  return store ? (
    <div>
      <h2>Editar Tienda</h2>
      <StoreForm onSubmit={handleSubmit} storeData={store} />
    </div>
  ) : <p>Cargando...</p>
}

export default EditStore
