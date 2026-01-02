import React from 'react'
import { Link } from 'react-router-dom'

const StoreInfo = ({ store, auth }) => {
  if (!store) return <p>Cargando información de la tienda...</p>

  const isOwner = auth.user._id === store.owner._id

  return (
    <div className="store-info">
      <h2>{store.name}</h2>
      <p><strong>Categoría:</strong> {store.category}</p>
      <p>{store.description}</p>
      <p><strong>Dueño:</strong> {store.owner.username}</p>
      <p><strong>Seguidores:</strong> {store.followers?.length || 0}</p>

      {isOwner && (
        <div className="store-actions">
          <Link to={`/store/edit/${store._id}`} className="btn btn-primary">Editar Tienda</Link>
        </div>
      )}
    </div>
  )
}

export default StoreInfo
