 
// 📂 actions/postAction.js - VERSIÓN LIMPIA
import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'
import axios from 'axios'
import { BASE_URL } from '../../utils/config'
 
//import { BASE_URL } from '../utils/config';
 
export const POST_TYPES = {
  // Estados básicos
  LOADING_POST: 'LOADING_POST',
  CREATE_POST: 'CREATE_POST',
  GET_POST: 'GET_POST',
  GET_POSTS: 'GET_POSTS',
  GET_POST_BY_ID: 'GET_POST_BY_ID',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  GET_CATEGORY_POSTS:'GET_CATEGORY_POSTS',
  GET_CATEGORY_POSTS_SUCCESS:'GET_CATEGORY_POSTS_SUCCESS',
  GET_CATEGORY_POSTS_FAIL:'GET_CATEGORY_POSTS_FAIL',
  GET_SIMILAR_POSTS: 'GET_SIMILAR_POSTS',
  LOADING_SIMILAR_POSTS: 'LOADING_SIMILAR_POSTS',
  CLEAR_SIMILAR_POSTS: 'CLEAR_SIMILAR_POSTS',
  SET_POST_FILTERS:'SET_POST_FILTERS',
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

export const setPostFilters = (filters) => ({
  type: POST_TYPES.SET_POST_FILTERS,
  payload: filters
});
export const getCategoryPosts = (categorySlug, subSlug = null, articleSlug = null, page = 1, limit = 12) => async (dispatch) => {
    try {
      dispatch({ type: types.GET_CATEGORY_POSTS });
  
      // ⭐ CONSTRUIR ENDPOINT CORRECTO
      let endpoint = `${API_URL}/api/posts/filter`;
      let params = { 
        category: categorySlug,
        page: page,
        limit: limit
      };
      
      // Añadir subcategoría si existe
      if (subSlug) params.sub = subSlug;
      
      console.log('🔍 Consultando endpoint:', endpoint);
      console.log('📊 Parámetros:', params);
  
      const { data } = await axios.get(endpoint, { params });
      
      console.log('✅ Respuesta del servidor:', {
        success: data.success,
        postsCount: data.posts ? data.posts.length : 0,
        childrenCount: data.children ? data.children.length : 0,
        categoryInfo: data.categoryInfo ? data.categoryInfo.name : 'No info'
      });
  
      // ⭐ VERIFICAR ESTRUCTURA DE DATOS
      if (data.posts && data.posts.length > 0) {
        console.log('📦 Primer post recibido:', {
          id: data.posts[0]._id,
          title: data.posts[0].title,
          images: data.posts[0].images ? data.posts[0].images.length : 0,
          user: data.posts[0].user
        });
      }
  
      // ⭐ OBTENER ICONOS REALES DE LAS CATEGORÍAS
      if (data.children && data.children.length > 0) {
        console.log('🎨 Información de iconos de children:');
        data.children.forEach((child, i) => {
          const iconInfo = child.icon 
            ? `✅ ${child.icon} (${child.iconType || 'no-type'})` 
            : '❌ NO TIENE ICONO';
          
          console.log(`${i+1}. ${child.name} - ${iconInfo}`);
        });
      }
  
      // ⭐ ACTUALIZAR ESTADO ACTIVO
      if (categorySlug) {
        dispatch({ 
          type: types.SET_ACTIVE_CATEGORY, 
          payload: { slug: categorySlug, ...data.categoryInfo } 
        });
      }
      if (subSlug) {
        dispatch({ 
          type: types.SET_ACTIVE_SUBCATEGORY, 
          payload: { slug: subSlug } 
        });
      }
  
      // ⭐ PREPARAR PAYLOAD CON ESTRUCTURA CORRECTA
      const payload = {
        // Información de categoría
        categoryInfo: data.categoryInfo || {},
        
        // Hijos (subcategorías)
        children: Array.isArray(data.children) 
          ? data.children.map(child => ({
              ...child,
              // Asegurar que tenga valores por defecto para icono
              icon: child.icon || getDefaultIcon(child.name),
              iconType: child.iconType || 'emoji',
              iconColor: child.iconColor || '#666666',
              bgColor: child.bgColor || '#FFFFFF'
            }))
          : [],
        
        // Posts
        posts: Array.isArray(data.posts) 
          ? data.posts.map(post => ({
              ...post,
              // Asegurar que las imágenes tengan formato correcto
              images: Array.isArray(post.images) 
                ? post.images.map(img => ({
                    url: typeof img === 'string' ? img : img.url,
                    isMain: img.isMain || false
                  }))
                : []
            }))
          : [],
        
        // Paginación
        pagination: {
          currentPage: page,
          hasMore: data.hasMore || false,
          totalPages: data.totalPages || Math.ceil((data.total || 0) / limit),
          totalPosts: data.total || 0,
          limit: limit
        }
      };
  
      console.log('📤 Payload final para reducer:', {
        postsCount: payload.posts.length,
        childrenCount: payload.children.length,
        hasMore: payload.pagination.hasMore
      });
  
      // ⭐ DESPACHAR AL REDUCER
      dispatch({
        type: types.GET_CATEGORY_POSTS_SUCCESS,
        payload: payload
      });
  
      return {
        success: true,
        ...payload
      };
  
    } catch (error) {
      console.error('❌ Error en getCategoryPosts:', error.response || error.message);
      
      dispatch({
        type: types.GET_CATEGORY_POSTS_FAIL,
        payload: error.response?.data?.message || error.message
      });
  
      return {
        success: false,
        posts: [],
        children: [],
        categoryInfo: {},
        pagination: {
          currentPage: page,
          hasMore: false,
          totalPages: 0,
          totalPosts: 0
        }
      };
    }
  };
  
  // Helper para iconos por defecto
  const getDefaultIcon = (categoryName) => {
    const iconMap = {
      'Voitures': '🚗',
      'Motos': '🏍️',
      'Vélos': '🚲',
      'Camion': '🚚',
      'Bus': '🚌',
      'Engin': '🚜',
      'Tracteurs': '🚜',
      'Immobilier': '🏠',
      'Electronique': '📱',
      'Mode': '👗',
      'Maison': '🏡',
      'Services': '🛠️',
      'Emploi': '💼',
      'Autres': '📦'
    };
    
    return iconMap[categoryName] || '📦';
  };
// 📂 redux/actions/postAction.js
// 📂 redux/actions/postAction.js
// 📂 redux/actions/postAction.js
export const createPost = ({ 
  postData, 
  images, 
  auth 
}) => async (dispatch) => {
  console.time('⏱️ createPost action time');
  let media = []
  
  try {
    console.log('🟡 createPost action iniciada');
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
    
    // Verificar si hay imágenes para subir
    if(images.length > 0) {
      console.log(`📤 Subiendo ${images.length} imágenes...`);
      console.time('🖼️ Image upload time');
      media = await imageUpload(images);
      console.timeEnd('🖼️ Image upload time');
      console.log('✅ Imágenes subidas:', media.length);
    }

    // 📌 Preparar datos finales para enviar
    const postToSend = {
      ...postData,
      images: media
    };

    console.log('📦 Datos a enviar al API:', postToSend);

    // 📌 ENVIAR DATOS AL API
    console.time('🌐 API call time');
    const res = await postDataAPI('posts', postToSend, auth.token);
    console.timeEnd('🌐 API call time');
    
    console.log('✅ Respuesta del API:', res.data);

    dispatch({ 
      type: POST_TYPES.CREATE_POST, 
      payload: {
        ...res.data.newPost, 
        user: auth.user,
        categorySpecificData: postData.categorySpecificData || {}
      } 
    });

    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} });

   

  } catch (err) {
    console.error('❌ Error en createPost action:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response?.data?.msg || err.message}
    });
  } finally {
    console.timeEnd('⏱️ createPost action time');
  }
}

// 📂 redux/actions/postAction.js

// 🎯 ACCIÓN UPDATE - CORREGIDA para recibir postId en lugar de status
export const updatePost = ({
  postId,    // ✅ Recibe postId
  postData, 
  images, 
  auth
}) => async (dispatch) => {
  let media = []
  
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    // ✅ Filtrar imágenes nuevas (no existentes)
    const imgNewUrl = images.filter(img => !img.isExisting);
    const imgOldUrl = images.filter(img => img.isExisting);
    
    // Subir solo imágenes nuevas
    if (imgNewUrl.length > 0) {
      media = await imageUpload(imgNewUrl);
    }

    // ✅ Combinar imágenes antiguas + nuevas
    const allImages = [...imgOldUrl, ...media];
    
    // ✅ Usar postId en lugar de status._id
    const res = await patchDataAPI(`post/${postId}`, {  // ← postId aquí
      ...postData,  // ← Enviar postData directamente
      images: allImages 
    }, auth.token);
    
    dispatch({ 
      type: POST_TYPES.UPDATE_POST, 
      payload: res.data.updatedPost 
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.msg } 
    });
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { 
        error: err.response?.data?.msg || 
               'Échec de la mise à jour' 
      }
    });
    throw err;
  }
}
 

export const getPost = (id) => async (dispatch) => {
    try {
        console.log('🔍 Fetching post with ID:', id)
        
        // ✅ Usar axios directamente con BASE_URL
        const res = await axios.get(`${BASE_URL}/api/post/${id}`)
        
        console.log('✅ Post response:', res.data)
        
        dispatch({ 
            type: POST_TYPES.GET_POST, 
            payload: res.data.post 
        })
        
    } catch (err) {
        console.error('❌ Error getting post:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            url: `${BASE_URL}/api/post/${id}`
        })
        
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data?.msg || 
                       err.message || 
                       'Error loading post'
            }
        })
    }
}

 

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
/*export const getSimilarPosts = (postId, options = {}) => async (dispatch, getState) => {
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
  };*/
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

 