 
// 📂 actions/postAction.js - VERSIÓN LIMPIA
import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'

export const POST_TYPES = {
  // Estados básicos
  LOADING_POST: 'LOADING_POST',
  CREATE_POST: 'CREATE_POST',
  GET_POST: 'GET_POST',
  GET_POSTS: 'GET_POSTS',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  GET_CATEGORY_POSTS:'GET_CATEGORY_POSTS',
  GET_CATEGORY_POSTS_SUCCESS:'GET_CATEGORY_POSTS_SUCCESS',
  GET_CATEGORY_POSTS_FAIL:'GET_CATEGORY_POSTS_FAIL',
  GET_SIMILAR_POSTS: 'GET_SIMILAR_POSTS',
  LOADING_SIMILAR_POSTS: 'LOADING_SIMILAR_POSTS',
  CLEAR_SIMILAR_POSTS: 'CLEAR_SIMILAR_POSTS',
  
  // Errores
  ERROR_POST: 'ERROR_POST',
  CLEAR_POST_ERROR: 'CLEAR_POST_ERROR',
  
  // Reset
  RESET_POST_STATE: 'RESET_POST_STATE',
  
  // Likes/Saves
  LIKE_POST: 'LIKE_POST',
  UNLIKE_POST: 'UNLIKE_POST',
  SAVE_POST: 'SAVE_POST',
  UNSAVE_POST: 'UNSAVE_POST'
};

// 📂 actions/categoryAction.js - Debe tener
// 📂 actions/categoryAction.js - getCategoryPosts CORREGIDO
export const getCategoryPosts = (categorySlug, subSlug = null, articleSlug = null, page = 1, limit = 12) => async (dispatch) => {
    try {
      console.log('🎯 CATEGORY ACTION: getCategoryPosts', { 
        categorySlug, 
        subSlug, 
        articleSlug, 
        page, 
        limit 
      });
  
      const params = { 
        page, 
        limit, 
        category: categorySlug 
      };
      
      if (subSlug) params.sub = subSlug;
      if (articleSlug) params.article = articleSlug;
  
      console.log('📡 Llamando API con params:', params);
      
      // ⭐ IMPORTANTE: La URL correcta
      const { data } = await getDataAPI(`${API_URL}/posts/filter`, { params });
      
      console.log('✅ Respuesta recibida:', { 
        success: data.success,
        postsCount: data.posts?.length || 0,
        total: data.total,
        hasMore: data.hasMore,
        category: data.category?.name
      });
  
      // Dispatch al reducer de CATEGORÍAS (no al de posts)
      dispatch({
        type: types.GET_CATEGORY_POSTS_SUCCESS,
        payload: {
          categoryInfo: data.category || {},
          children: data.children || [],
          posts: data.posts || [],
          currentPage: page,
          hasMore: data.hasMore || false,
          totalPages: data.totalPages || 1,
          totalPosts: data.total || 0
        }
      });
  
      return data;
  
    } catch (error) {
      console.error('❌ Error en getCategoryPosts:', {
        message: error.message,
        response: error.response?.data,
        url: error.config?.url
      });
      
      dispatch({
        type: types.GET_CATEGORY_POSTS_FAIL,
        payload: error.response?.data?.message || 'Error al obtener posts de categoría'
      });
  
      throw error;
    }
  };
export const createPost = ({ postData, images, auth, socket }) => async (dispatch) => {
    let media = []
    try {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { loading: true, text: 'Creating post...' } 
        })
        
        if(images.length > 0) media = await imageUpload(images)

        const res = await postDataAPI('posts', { ...postData, images: media }, auth.token);
        
        dispatch({ 
            type: POST_TYPES.CREATE_POST, 
            payload: {
                ...res.data.newPost, 
                user: auth.user
            } 
        })

        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { success: '✅ Post created successfully!' } 
        })

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

/**
 * Obtener todos los posts (paginados)
 */
export const getPosts = (page = 1, limit = 12) => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: true })
        
        const res = await getDataAPI(`posts?page=${page}&limit=${limit}`)
        
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: {
                posts: res.data.posts || [],
                page: res.data.page || page,
                total: res.data.total || 0,
                totalPages: res.data.totalPages || 1,
                hasMore: res.data.hasMore || false
            }
        })

        dispatch({ type: POST_TYPES.LOADING_POST, payload: false })
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response?.data?.msg || 'Error loading posts'}
        })
        dispatch({ type: POST_TYPES.LOADING_POST, payload: false })
    }
}

/**
 * Obtener un post por ID
 */
export const getPost = (id) => async (dispatch) => {
    try {
        const res = await getDataAPI(`post/${id}`)
        dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response?.data?.msg || 'Error loading post'}
        })
    }
}

/**
 * Actualizar un post
 */
export const updatePost = ({ id, postData, images, auth }) => async (dispatch) => {
    let media = []
    
    const imgNewUrl = images.filter(img => !img.isExisting)
    const imgOldUrl = images.filter(img => img.isExisting)

    try {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { loading: true } 
        })
        
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
                error: err.response?.data?.msg || 'Update failed' 
            }
        });
    }
}

/**
 * Eliminar un post
 */
export const deletePost = ({ post, auth, socket }) => async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post })

    try {
        await deleteDataAPI(`post/${post._id}`, auth.token)

        // Notify
        const msg = {
            id: post._id,
            text: 'deleted a post.',
            recipients: post.user.followers,
            url: `/profile/${auth.user._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response?.data?.msg || 'Error deleting post'}
        })
    }
}

// ========== ACCIONES DE INTERACCIÓN ==========

/**
 * Like a un post
 */
export const likePost = ({ post, auth, socket }) => async (dispatch) => {
    const newPost = {...post, likes: [...post.likes, auth.user]}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    socket.emit('likePost', newPost)

    try {
        await patchDataAPI(`post/${post._id}/like`, null, auth.token)
        
        // Notify
        const msg = {
            id: auth.user._id,
            text: 'liked your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0]?.url
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response?.data?.msg || 'Error liking post'}
        })
    }
}

/**
 * Unlike a un post
 */
export const unLikePost = ({ post, auth, socket }) => async (dispatch) => {
    const newPost = {...post, likes: post.likes.filter(like => like._id !== auth.user._id)}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    socket.emit('unLikePost', newPost)

    try {
        await patchDataAPI(`post/${post._id}/unlike`, null, auth.token)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'unliked your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response?.data?.msg || 'Error unliking post'}
        })
    }
}

/**
 * Guardar post
 */
export const savePost = ({ post, auth }) => async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`savePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response?.data?.msg || 'Error saving post'}
        })
    }
}

/**
 * Quitar post guardado
 */
export const unSavePost = ({ post, auth }) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`unSavePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response?.data?.msg || 'Error unsaving post'}
        })
    }
}

// ========== ACCIONES AUXILIARES ==========

/**
 * Obtener posts similares
 */
export const getSimilarPosts = (postId, options = {}) => async (dispatch, getState) => {
    try {
        dispatch({ type: POST_TYPES.LOADING_SIMILAR_POSTS, payload: true })
        
        // Obtener el post actual para saber su categoría
        const state = getState();
        let currentPost = state.detailPost;
        
        if (!currentPost || currentPost._id !== postId) {
            const res = await getDataAPI(`post/${postId}`);
            currentPost = res.data?.post || res.data;
        }
        
        if (!currentPost || !currentPost.category) {
            dispatch({ type: POST_TYPES.LOADING_SIMILAR_POSTS, payload: false });
            return;
        }
        
        // Llamar a la API de posts similares
        const params = new URLSearchParams({
            category: currentPost.category._id || currentPost.category,
            excludeId: postId,
            limit: options.limit || 6,
            page: options.page || 1
        });
        
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
        }
        
        dispatch({ type: POST_TYPES.LOADING_SIMILAR_POSTS, payload: false });
        
    } catch (err) {
        console.error('❌ Error en getSimilarPosts:', err.message);
        dispatch({ type: POST_TYPES.LOADING_SIMILAR_POSTS, payload: false });
    }
}


  export const clearSimilarPosts = () => (dispatch) => {
    dispatch({ type: POST_TYPES.CLEAR_SIMILAR_POSTS });
  };
  export const getCategories = (page = 1, limit = 2) => async (dispatch, getState) => {
    try {
        const { auth } = getState();
        const res = await getDataAPI(`categories/paginated?page=${page}&limit=${limit}`, auth.token);
        
        dispatch({
            type: POST_TYPES.GET_CATEGORIES_PAGINATED,
            payload: {
                categories: res.data.categories,
                page: res.data.page,
                total: res.data.total,
                totalPages: res.data.totalPages,
                hasMore: res.data.hasMore
            }
        });
        
        return res.data;
    } catch (err) {
        dispatch({
            type: 'ALERT',
            payload: { error: err.response?.data?.msg || 'Error al cargar categorías' }
        });
        throw err;
    }
};

 