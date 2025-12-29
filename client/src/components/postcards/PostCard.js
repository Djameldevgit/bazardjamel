import React from 'react'
 
import CardBodyCarousel from '../home/post_card/CardBodyCarousel';
 
 

const PostCard = ({post }) => {
    return (
        <div className="card my-3"> 
                
            <CardBodyCarousel  post={post}  />
            
          
        </div>
    )
}

export default PostCard
