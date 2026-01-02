import React from 'react'
import { Link } from 'react-router-dom'

const StoreCard = ({ store, onDelete }) => {
  return (
    <div className="store-card">
      <h3>{store.name}</h3>
      <p>{store.description}</p>
      <p>Categoría: {store.category}</p>
      <Link to={`/store/${store._id}`}>Ver</Link>
      <Link to={`/store/edit/${store._id}`}>Editar</Link>
      <button onClick={() => onDelete(store._id)}>Eliminar</button>
    </div>
  )
}

export default StoreCard
