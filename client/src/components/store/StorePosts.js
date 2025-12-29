import React from 'react'
import LoadIcon from '../../images/loading.gif'
import PostCard from '../PostCard'

const StorePosts = ({ posts, loading, auth }) => {
  if (loading)
    return <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />

  if (!posts || posts.length === 0)
    return <h5 className="text-center text-muted mt-4">Esta tienda no tiene publicaciones.</h5>

  return (
    <div className="store_posts mt-4">
      {posts.map(post => (
        <PostCard key={post._id} post={post} auth={auth} />
      ))}
    </div>
  )
}

export default StorePosts
