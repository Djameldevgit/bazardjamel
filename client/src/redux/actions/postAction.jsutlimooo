// redux/actions/postAction.js
import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'

export const POST_TYPES = {
    LOADING_POST: 'LOADING_POST',
    CREATE_POST: 'CREATE_POST',
    GET_POST: 'GET_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    DELETE_POST: 'DELETE_POST',
    ERROR_POST: 'ERROR_POST',
    
    // Posts similares
    GET_SIMILAR_POSTS: 'GET_SIMILAR_POSTS',
    LOADING_SIMILAR_POSTS: 'LOADING_SIMILAR_POSTS',
    CLEAR_SIMILAR_POSTS: 'CLEAR_SIMILAR_POSTS',
};

// 📌 CREAR POST
export const createPost = ({ 
    postData, 
    images, 
    auth, 
    socket 
}) => async (dispatch) => {
    let media = []
    try {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { 
                loading: true,
                text: 'Creating post...'
            } 
        })
        
        if(images.length > 0) media = await imageUpload(images)

        const res = await postDataAPI('posts', { 
            ...postData,
            images: media 
        }, auth.token)

        dispatch({ 
            type: POST_TYPES.CREATE_POST, 
            payload: {
                ...res.data.newPost, 
                user: auth.user,
                categorySpecificData: postData.categorySpecificData || {}
            } 
        })

        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: '✅ Post created successfully!'
            } 
        })

        setTimeout(() => {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {}
            })
        }, 3000)

        // Notify
        const msg = {
            id: res.data.newPost._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${res.data.newPost._id}`,
            content: postData.description, 
            image: media[0]?.url
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data?.msg || err.message || 'Error creating post'
            }
        })
    }
}

// 📌 OBTENER POSTS SIMILARES
export const getSimilarPosts = (postId, options = {}) => async (dispatch, getState) => {
    try {
        console.log('🚀 ======= INICIO BÚSQUEDA SIMILARES =======');
        
        dispatch({ 
            type: POST_TYPES.LOADING_SIMILAR_POSTS, 
            payload: true 
        });
        
        const state = getState();
        const homePostsState = state.homePosts || {};
        const detailPostState = state.detailPost;
        
        let currentPost = null;
        
        // Buscar el post en diferentes lugares
        if (detailPostState && detailPostState._id === postId) {
            currentPost = detailPostState;
        }
        
        if (!currentPost && homePostsState.posts) {
            currentPost = homePostsState.posts.find(p => p._id === postId);
        }
        
        // Si no está, obtener de API
        if (!currentPost) {
            const res = await getDataAPI(`post/${postId}`);
            currentPost = res.data?.post || res.data;
            
            dispatch({
                type: 'GET_POST',
                payload: currentPost
            });
        }
        
        // Validar que tengamos el post
        if (!currentPost) {
            console.error('❌ NO SE PUDO OBTENER EL POST');
            dispatch({ 
                type: POST_TYPES.LOADING_SIMILAR_POSTS, 
                payload: false 
            });
            return;
        }
        
        // Validar categoría y subcategoría
        if (!currentPost.categorie || !currentPost.subCategory) {
            console.error('❌ Post sin categoría completa');
            dispatch({ 
                type: POST_TYPES.LOADING_SIMILAR_POSTS, 
                payload: false 
            });
            return;
        }
        
        // Construir parámetros
        const params = new URLSearchParams({
            categorie: currentPost.categorie,
            subCategory: currentPost.subCategory,
            excludeId: postId,
            limit: options.limit || 6,
            page: options.page || 1
        });
        
        // Llamada a API
        const res = await getDataAPI(`posts/similar?${params}`);
        
        if (res.data.success) {
            dispatch({
                type: POST_TYPES.GET_SIMILAR_POSTS,
                payload: {
                    posts: res.data.posts || [],
                    page: options.page || 1,
                    total: res.data.total || 0,
                    currentPostId: postId
                }
            });
        } else {
            throw new Error(res.data.message || 'Error en el servidor');
        }
        
    } catch (err) {
        console.error('❌ ERROR en getSimilarPosts:', err.message);
        
        dispatch({ 
            type: POST_TYPES.ERROR_POST, 
            payload: err.message 
        });
        
        dispatch({ 
            type: POST_TYPES.LOADING_SIMILAR_POSTS, 
            payload: false 
        });
    }
};

// 📌 LIMPIAR POSTS SIMILARES
export const clearSimilarPosts = () => (dispatch) => {
    dispatch({ type: POST_TYPES.CLEAR_SIMILAR_POSTS });
};

// 📌 ACTUALIZAR POST
export const updatePost = ({
    id,
    postData,
    images, 
    auth
}) => async (dispatch) => {
    let media = []
    
    const imgNewUrl = images.filter(img => !img.isExisting)
    const imgOldUrl = images.filter(img => img.isExisting)

    try {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { loading: true } 
        });
        
        console.log('🔄 updatePost con ID:', id);
        
        if (imgNewUrl.length > 0) {
            media = await imageUpload(imgNewUrl);
        }

        const allImages = [...imgOldUrl, ...media];

        const res = await patchDataAPI(`post/${id}`, { 
            postData: {
                ...postData,
                content: postData.description || postData.content
            },
            images: allImages 
        }, auth.token);

        dispatch({ 
            type: POST_TYPES.UPDATE_POST,
            payload: res.data.newPost 
        });
        
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { 
                success: res.data.msg || 'Post updated successfully!' 
            } 
        });
        
    } catch (err) {
        console.error('❌ Error en updatePost:', err.response?.data || err.message);
        
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { 
                error: err.response?.data?.msg || 'Échec de la mise à jour accion' 
            }
        });
    }
}

// 📌 OBTENER TODOS LOS POSTS
export const getPosts = () => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: true })
        const res = await getDataAPI('posts')
        
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: {...res.data, page: 2}
        })

        dispatch({ type: POST_TYPES.LOADING_POST, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

// 📌 OBTENER UN POST ESPECÍFICO
export const getPost = ({detailPost, id }) => async (dispatch) => {
    if(detailPost.every(post => post._id !== id)){
        try {
            const res = await getDataAPI(`post/${id}` )
            dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post })
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
}

// 📌 ELIMINAR POST
export const deletePost = ({post, auth, socket}) => async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post })

    try {
        const res = await deleteDataAPI(`post/${post._id}`, auth.token)

        // Notify
        const msg = {
            id: post._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

// 📌 LIKE POST
export const likePost = ({post, auth, socket}) => async (dispatch) => {
    const newPost = {...post, likes: [...post.likes, auth.user]}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('likePost', newPost)

    try {
        await patchDataAPI(`post/${post._id}/like`, null, auth.token)
        
        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

// 📌 UNLIKE POST
export const unLikePost = ({post, auth, socket}) => async (dispatch) => {
    const newPost = {...post, likes: post.likes.filter(like => like._id !== auth.user._id)}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('unLikePost', newPost)

    try {
        await patchDataAPI(`post/${post._id}/unlike`, null, auth.token)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

// 📌 GUARDAR POST
export const savePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`savePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

// 📌 QUITAR POST GUARDADO
export const unSavePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`unSavePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

// 📌 LIMPIAR POSTS DE USUARIO (si lo necesitas)
export const clearUserPosts = (userId) => (dispatch) => {
    dispatch({
        type: 'CLEAR_USER_POSTS',
        payload: { userId }
    });
};