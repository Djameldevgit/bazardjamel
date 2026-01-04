import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'
import { POST_TYPES_APROVE } from './postAproveAction';

// redux/actions/postAction.js
export const POST_TYPES = {
    // ... tus constantes existentes (NO LAS CAMBIES)
    LOADING_POST: 'LOADING_POST',
    CREATE_POST: 'CREATE_POST',
    GET_POST: 'GET_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
   
 
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST',
    GET_POSTS_BY_CATEGORY: 'GET_POSTS_BY_CATEGORY',
    GET_CATEGORIES: 'GET_CATEGORIES',
    GET_SUBCATEGORY_POSTS:'GET_SUBCATEGORY_POSTS',
    GET_CATEGORIES_PAGINATED: 'GET_CATEGORIES_PAGINATED',
    ERROR_POST: 'ERROR_POST',
    GET_IMMOBILIER_POSTS: 'GET_IMMOBILIER_POSTS',
    CLEAR_IMMOBILIER_POSTS: 'CLEAR_IMMOBILIER_POSTS',
    // ✅ AÑADE ESTOS NUEVOS TYPES
    GET_SIMILAR_POSTS: 'GET_SIMILAR_POSTS',
    LOADING_SIMILAR_POSTS: 'LOADING_SIMILAR_POSTS',
    CLEAR_SIMILAR_POSTS: 'CLEAR_SIMILAR_POSTS'
}

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
                text: 'Creating post...' // Mensaje de carga
            } 
        })
        
        if(images.length > 0) media = await imageUpload(images)

        // 📌 ENVIAR DATOS ORGANIZADOS
        const res = await postDataAPI('posts', { 
            ...postData,
            images: media 
        }, auth.token)

        // ✅ 1. DISPATCH PARA AGREGAR POST AL ESTADO
        dispatch({ 
            type: POST_TYPES.CREATE_POST, 
            payload: {
                ...res.data.newPost, 
                user: auth.user,
                categorySpecificData: postData.categorySpecificData || {}
            } 
        })

        // ✅ 2. ALERT DE ÉXITO (diferentes opciones)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: '✅ Post created successfully!'
               
            } 
        })

        // ✅ 3. OPCIONAL: Alert que se auto-elimina después de 3 segundos
        setTimeout(() => {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {} // Limpiar alert
            })
        }, 3000)

        // Notify (opcional)
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
 
 
export const clearUserPosts = (userId) => (dispatch) => {
    dispatch({
        type: POST_TYPES.CLEAR_USER_POSTS,
        payload: { userId }
    });
};
// En tu action getSimilarPosts
export const getSimilarPosts = (postId, options = {}) => async (dispatch, getState) => {
    try {
        console.log('🚀 ======= INICIO BÚSQUEDA SIMILARES =======');
        console.log('📌 Post ID objetivo:', postId);
        
        dispatch({ 
            type: POST_TYPES.LOADING_SIMILAR_POSTS, 
            payload: true 
        });
        
        // ✅ Obtener el estado completo
        const state = getState();
        console.log('📊 Estado root keys:', Object.keys(state));
        
        // ✅ Acceder a los reducers correctos
        const homePostsState = state.homePosts || {};
        const detailPostState = state.detailPost;
        
        console.log('📊 homePosts estado:', Object.keys(homePostsState));
        console.log('📊 detailPost estado:', detailPostState);
        
        // Buscar el post en diferentes lugares
        let currentPost = null;
        
        // 1. En detailPost reducer
        if (detailPostState && detailPostState._id === postId) {
            currentPost = detailPostState;
            console.log('✅ Post encontrado en detailPost reducer');
        }
        
        // 2. En posts array de homePosts
        if (!currentPost && homePostsState.posts) {
            currentPost = homePostsState.posts.find(p => p._id === postId);
            if (currentPost) {
                console.log('✅ Post encontrado en homePosts.posts');
            }
        }
        
        // 3. Si no está, obtener de API
        if (!currentPost) {
            console.log('📥 Post no encontrado en redux, obteniendo de API...');
            try {
                const res = await getDataAPI(`post/${postId}`);
                currentPost = res.data?.post || res.data;
                
                // Guardar en detailPost
                dispatch({
                    type: 'GET_POST',
                    payload: currentPost
                });
                
                console.log('📦 Post guardado en detailPost');
            } catch (err) {
                console.error('❌ Error obteniendo post:', err);
                dispatch({ 
                    type: POST_TYPES.LOADING_SIMILAR_POSTS, 
                    payload: false 
                });
                return;
            }
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
        
        console.log('✅ Post encontrado para similares:', {
            id: currentPost._id,
            categorie: currentPost.categorie,
            subCategory: currentPost.subCategory,
            title: currentPost.title
        });
        
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
        
        console.log('🌐 Llamando API:', `/posts/similar?${params}`);
        
        // Llamada a API
        const res = await getDataAPI(`posts/similar?${params}`);
        
        console.log('📦 Respuesta API:', {
            success: res.data.success,
            postsCount: res.data.posts?.length,
            data: res.data
        });
        
        if (res.data.success) {
            // ✅ Dispatch al reducer correcto: homePosts
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


// src/redux/actions/storeAction.js - AGREGAR ESTO:
export const getStoreBySlug = (slug) => async (dispatch) => {
    try {
      dispatch({ type: 'STORE_LOADING', payload: true });
      
      const res = await getDataAPI(`stores/slug/${slug}`);
      
      dispatch({
        type: 'GET_STORE_BY_SLUG',
        payload: res.data.store
      });
      
      dispatch({ type: 'STORE_LOADING', payload: false });
      
    } catch (err) {
      dispatch({
        type: 'STORE_ERROR',
        payload: err.response?.data?.msg || 'Error loading store'
      });
      dispatch({ type: 'STORE_LOADING', payload: false });
    }
  };






 export const getPostsByCategory = (category, page = 1, filters = {}) => async (dispatch, getState) => {
    try {
        const { auth } = getState();
        
        // 📌 DEPURACIÓN
        console.log('🔍 getPostsByCategory INPUT:', {
            category,
            page,
            filters,
            categoryType: typeof category
        });
        
        // Construir URL
        const encodedCategory = encodeURIComponent(category);
        let url = `posts/category/${encodedCategory}`;
        
        // Parámetros
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', filters.limit || 12);
        
        url += `?${params.toString()}`;
        
        console.log('📡 API URL:', `/api/${url}`);
        
        // Hacer petición
        const res = await getDataAPI(url, auth.token);
        
        console.log('✅ API RESPONSE:', {
            status: res.status,
            dataKeys: Object.keys(res.data),
            postsCount: res.data.posts?.length,
            total: res.data.total,
            success: res.data.success
        });
        
        // Verificar si hay posts
        if (!res.data.posts || res.data.posts.length === 0) {
            console.warn('⚠️ No posts found in response');
            console.log('📄 Full response:', res.data);
        }
        
        // Extraer posts
        const posts = res.data.posts || [];
        
        dispatch({
            type: POST_TYPES.GET_POSTS_BY_CATEGORY,
            payload: {
                posts: posts,
                page: page,
                result: res.data.total || posts.length,
                category: category,
                total: res.data.total || 0,
                totalPages: res.data.totalPages || 1,
                success: res.data.success
            }
        });
        
        return {
            success: true,
            posts: posts,
            total: res.data.total || 0
        };
        
    } catch (err) {
        console.error('❌ ERROR in getPostsByCategory:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            url: err.config?.url
        });
        
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { 
                error: err.response?.data?.msg || 
                      'Error al cargar posts de categoría' 
            }
        });
        
        return {
            success: false,
            error: err.message
        };
    }
};
  
 
export const ImmobilerHierarchyPage = (operation, property, page = 1, options = {}) => 
    async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true });
        
        const limit = options.limit || 12;
        const skip = (page - 1) * limit;
        
        // Nueva API para immobiler con propiedad específica
        const res = await getDataAPI(
            `posts/category/immobilier/operation/${operation}/property/${property}?limit=${limit}&skip=${skip}`
        );
        
        dispatch({
            type: POST_TYPES.GET_IMMOBILIER_POSTS,
            payload: {
                posts: res.data.posts,
                operation: operation,
                propertyType: property,
                page: page,
                total: res.data.total
            }
        });
        
        dispatch({ type: GLOBALTYPES.LOADING, payload: false });
        return res.data;
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || 'Error al cargar posts de immobiler' }
        });
        dispatch({ type: GLOBALTYPES.LOADING, payload: false });
        throw err;
    }
};
// Busca esta función y verifica que tenga return dispatch
export const getPostsBySubcategory = (category, subcategory, page = 1, options = {}) => async (dispatch) => {
    try {
      // Agrega este console.log para debug
      console.log('🔍 getPostsBySubcategory called:', { category, subcategory, page });
      
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { loading: true } 
      });
      
      // IMPORTANTE: Si category es 'store', redirige a la lógica de stores
      if (category === 'store' || category === 'stores') {
        console.log('🔄 Redirecting to store logic for:', subcategory);
        
        // Aquí deberías llamar a getStoreAction en lugar de getPostsBySubcategory
        dispatch({ 
          type: GLOBALTYPES.ALERT, 
          payload: { loading: false } 
        });
        
        // Redirigir a la página de store
        window.location.href = `/store/${subcategory}`;
        return;
      }
      
      const limit = options.limit || 12;
      const res = await getDataAPI(
        `posts/category/${category}/${subcategory}?page=${page}&limit=${limit}`
      );
      
      console.log('📦 Posts by subcategory response:', res.data);
      
      // Asegúrate de que el tipo de acción esté definido
      const actionType = 'GET_POSTS_BY_SUBCATEGORY'; // O tu constante definida
      
      dispatch({
        type: actionType, // ESTO NO DEBE SER undefined
        payload: {
          posts: res.data.posts || [],
          total: res.data.total || 0,
          category,
          subcategory,
          page
        }
      });
      
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { loading: false } 
      });
      
      return res.data;
      
    } catch (err) {
      console.error('❌ ERROR in getPostsBySubcategory:', {
        category,
        subcategory,
        error: err.message,
        response: err.response?.data
      });
      
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { 
          error: err.response?.data?.msg || err.message,
          loading: false
        } 
      });
      
      throw err;
    }
  };


// Acción para crear post (ya la tienes, pero asegurar que guarda categoría)
// actions/postAction.js - createPost actualizada
 
/*export const getPostsBySubcategory = (categoryName, subcategoryId, page = 1, options = {}) => 
    async (dispatch, getState) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true });
        
        const { auth } = getState();
        const limit = options.limit || 9;
        
        // URL encode para manejar espacios y caracteres especiales
        const encodedCategory = encodeURIComponent(categoryName);
        const encodedSubcategory = encodeURIComponent(subcategoryId);
        
        const res = await getDataAPI(
            `posts/category/${encodedCategory}/subcategory/${encodedSubcategory}?page=${page}&limit=${limit}`,
            auth.token
        );
        
        console.log(`✅ Subcategoría ${subcategoryId} - Posts cargados:`, res.data.posts?.length);
        
        dispatch({
            type: POST_TYPES.GET_SUBCATEGORY_POSTS,
            payload: {
                posts: res.data.posts,
                category: categoryName,
                subcategory: subcategoryId,
                page: page,
                total: res.data.total,
                hasMore: res.data.hasMore
            }
        });
        
        dispatch({ type: GLOBALTYPES.LOADING, payload: false });
        return res.data;
        
    } catch (err) {
        console.error('❌ Error en getPostsBySubcategory action:', err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { 
                error: err.response?.data?.msg || 'Error al cargar subcategoría' 
            }
        });
        dispatch({ type: GLOBALTYPES.LOADING, payload: false });
        throw err;
    }
};
*/
// redux/actions/postAction.js
export const getPostsByImmobilierOperation = (operationId, page = 1, options = {}) => 
    async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true });
        
        const limit = options.limit || 9;
        const skip = (page - 1) * limit;
        
        // Nueva API para immobiler
        const res = await getDataAPI(
            `posts/category/immobilier/operation/${operationId}?limit=${limit}&skip=${skip}`
        );
        
        dispatch({
            type: POST_TYPES.GET_IMMOBILIER_POSTS,
            payload: {
                posts: res.data.posts,
                operation: operationId,
                page: page,
                total: res.data.total
            }
        });
        
        dispatch({ type: GLOBALTYPES.LOADING, payload: false });
        return res.data;
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || 'Error al cargar posts de immobiler' }
        });
        dispatch({ type: GLOBALTYPES.LOADING, payload: false });
        throw err;
    }
};
export const getSubCategories = (categoryName) => async (dispatch, getState) => {
    try {
        const { auth } = getState();
        const encodedCategory = encodeURIComponent(categoryName);
        
        const res = await getDataAPI(
            `categories/${encodedCategory}/subcategories`,
            auth.token
        );
        
        dispatch({
            type: 'GET_SUBCATEGORIES',
            payload: {
                category: categoryName,
                subcategories: res.data.subcategories
            }
        });
        
        return res.data;
        
    } catch (err) {
        console.error('Error obteniendo subcategorías:', err);
        throw err;
    }
};
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
        // ✅ USAR CONSTANTE CORRECTA
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

        // ✅ AQUÍ ESTÁ EL ERROR - USAR CONSTANTE CORRECTA
        dispatch({ 
            type: POST_TYPES.UPDATE_POST,  // ← Verifica que esta constante existe
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
        
        // ✅ Si POST_TYPES.UPDATE_POST_FAIL existe, úsala:
        dispatch({
            type: POST_TYPES.UPDATE_POST_FAIL || GLOBALTYPES.ALERT,
            payload: { 
                error: err.response?.data?.msg || 'Échec de la mise à jour accion' 
            }
        });
    }
}
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