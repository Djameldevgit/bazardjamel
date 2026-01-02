import React from 'react'
import { Link } from 'react-router-dom'

const StoreProduct = ({ product }) => {
  if (!product) return null

  return (
    <div className="store-product-card">
      <img src={product.images[0]?.url} alt={product.name} className="product-image" />
      <h4>{product.name}</h4>
      <p>{product.description}</p>
      <p><strong>Precio:</strong> ${product.price}</p>
      <Link to={`/product/${product._id}`} className="btn btn-sm btn-outline-primary">
        Ver Producto
      </Link>
    </div>
  )
}

export default StoreProduct
