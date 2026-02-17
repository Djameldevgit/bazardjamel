import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getPost } from '../redux/actions/postAction'
import LoadIcon from '../images/loading.gif'
import PostCard from '../components/PostCard';

const PostId = () => {
    const { id } = useParams()
    const [post, setPost] = useState([])

    const { detailPost } = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('📌 Post ID from params:', id); // Verifica el ID
        
        // ✅ CORREGIDO: Solo pasar el ID
        if (id) {
            dispatch(getPost(id))
        }
    }, [dispatch, id])

    useEffect(() => {
        // ✅ Filtrar el post después de cargar
        if (detailPost.length > 0 && id) {
            const newArr = detailPost.filter(post => post._id === id)
            setPost(newArr)
            console.log('📊 Post encontrado:', newArr.length > 0 ? '✅' : '❌ No encontrado');
        }
    }, [detailPost, id])

    return (
        <div className="posts">
            {
                post.length === 0 &&
                <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
            }

            {
                post.map(item => (
                    <PostCard key={item._id} post={item} />
                ))
            }
        </div>
    )
}

export default PostId