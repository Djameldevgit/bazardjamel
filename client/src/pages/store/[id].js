import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getStore } from '../../redux/actions/storeAction'
import LoadIcon from '../../images/loading.gif'
import StoreInfo from '../../components/store/StoreInfo'
import StoreProducts from '../../components/store/StoreProduct'
 
 
const Store = () => {
  const { id } = useParams()
  const { store, auth } = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    if(!store.details[id]){
      dispatch(getStore(id, auth.token))
    }
  }, [id, dispatch, store.details, auth.token])

  const data = store.details[id]

  if(store.loading || !data) 
    return <img src={LoadIcon} alt="loading" className="d-block mx-auto" />

  return (
    <div className="store">
      <StoreInfo store={data} auth={auth} />
      <div className="store-products">
        {data.products?.map(product => (
          <StoreProducts key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}


export default Store
