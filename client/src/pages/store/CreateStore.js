import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStore } from '../../redux/actions/storeAction'
import StoreForm from '../../components/store/StoreForm'

const CreateStore = () => {
  const { auth } = useSelector(state => state)
  const dispatch = useDispatch()

  const handleSubmit = (storeData) => {
    dispatch(createStore({ storeData, auth }))
  }

  return (
    <div>
      <h2>Crear Tienda</h2>
      <StoreForm onSubmit={handleSubmit} />
    </div>
  )
}

export default CreateStore
