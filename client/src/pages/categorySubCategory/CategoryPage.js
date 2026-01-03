import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getPostsByCategory } from '../../redux/actions/postAction'
import { getCategoryUrl } from '../../utils/slugUtils'
import Posts from '../../components/home/Posts'

const CategoryPage = ({ categoryName, page = "1" }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [subcategories, setSubcategories] = useState([])
  
  const { categories } = useSelector(state => state.post || {})
  
  useEffect(() => {
    if (categoryName) {
      dispatch(getPostsByCategory(categoryName, parseInt(page)))
      
      // Encontrar subcategorías
      const category = categories?.find(cat => 
        cat.slug === categoryName || cat.name.toLowerCase() === categoryName.toLowerCase()
      )
      
      if (category?.subcategories) {
        setSubcategories(category.subcategories)
      }
    }
  }, [categoryName, page, dispatch, categories])
  
  const handleSubcategoryClick = (subcategory) => {
    history.push(getCategoryUrl(categoryName, subcategory.slug, 1))
  }
  
  return (
    <div className="container py-4">
      <h1>{categoryName}</h1>
      
      {subcategories.length > 0 && (
        <div className="mb-4">
          <h3>Sous-catégories</h3>
          <div className="d-flex flex-wrap gap-2">
            {subcategories.map(sub => (
              <button
                key={sub._id}
                onClick={() => handleSubcategoryClick(sub)}
                className="btn btn-outline-primary"
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <Posts 
        fromCategoryPage={true}
        selectedCategory={categoryName}
        page={parseInt(page)}
      />
    </div>
  )
}

export default CategoryPage