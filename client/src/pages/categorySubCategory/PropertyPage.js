import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// ... similar a SubcategoryPage pero con dos parámetros

const PropertyPage = () => {
  const { operationId, propertyId } = useParams();
  const dispatch = useDispatch();
  
  // Aquí deberías tener una acción especial para filtrar por dos niveles
  // Ejemplo: getPostsByImmobilier(operationId, propertyId, page)
  
  return (
    <div>
      <h1>Immobilier - {operationId} - {propertyId}</h1>
      {/* Mostrar posts filtrados por operación y tipo de propiedad */}
    </div>
  );
};

export default PropertyPage;