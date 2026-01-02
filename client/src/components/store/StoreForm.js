import React, { useState, useEffect } from 'react'

const StoreForm = ({ onSubmit, storeData }) => {
  const [name, setName] = useState(storeData?.name || '')
  const [description, setDescription] = useState(storeData?.description || '')
  const [category, setCategory] = useState(storeData?.category || 'Otros')
  const [images, setImages] = useState(storeData?.images || [])

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit({ name, description, category, images })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nombre de la tienda" value={name} onChange={e => setName(e.target.value)} required />
      <textarea placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="Boutiques">Boutiques</option>
        <option value="Electrónica">Electrónica</option>
        <option value="Restaurantes">Restaurantes</option>
        <option value="Supermercados">Supermercados</option>
        <option value="Ropa">Ropa</option>
        <option value="Hogar">Hogar</option>
        <option value="Belleza">Belleza</option>
        <option value="Deportes">Deportes</option>
        <option value="Tecnología">Tecnología</option>
        <option value="Otros">Otros</option>
      </select>
      {/* Aquí podrías integrar subida de imágenes */}
      <button type="submit">Guardar</button>
    </form>
  )
}

export default StoreForm
