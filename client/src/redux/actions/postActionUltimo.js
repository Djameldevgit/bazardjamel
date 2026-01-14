 
import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'
import { POST_TYPES_APROVE } from './postAproveAction';
 

// redux/actions/postAction.js
// 📂 redux/actions/postAction.js
export const POST_TYPES = {
    // TUS CONSTANTES EXISTENTES
    LOADING_POST: 'LOADING_POST',
    CREATE_POST: 'CREATE_POST',
    GET_POST: 'GET_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    DELETE_POST: 'DELETE_POST',
   
    GET_CATEGORIES: 'GET_CATEGORIES',
    GET_SUBCATEGORY_POSTS: 'GET_SUBCATEGORY_POSTS',
    GET_CATEGORIES_PAGINATED: 'GET_CATEGORIES_PAGINATED',
    ERROR_POST: 'ERROR_POST',
    GET_POSTS_BY_CATEGORY: 'GET_POSTS_BY_CATEGORY', 
    // TUS CONSTANTES PARA POSTS SIMILARES
    GET_SIMILAR_POSTS: 'GET_SIMILAR_POSTS',
    LOADING_SIMILAR_POSTS: 'LOADING_SIMILAR_POSTS',
    CLEAR_SIMILAR_POSTS: 'CLEAR_SIMILAR_POSTS',
    
    // ✅ NUEVAS CONSTANTES PARA SISTEMA JERÁRQUICO
    GET_POSTS_BY_CATEGORY_HIERARCHY: 'GET_POSTS_BY_CATEGORY_HIERARCHY',
    GET_POSTS_BY_SUBSUBCATEGORY: 'GET_POSTS_BY_SUBSUBCATEGORY',
    GET_SUBSUBCATEGORIES: 'GET_SUBSUBCATEGORIES',
    GET_CATEGORIES_HIERARCHY: 'GET_CATEGORIES_HIERARCHY',
    
    // Estados de carga específicos
    LOADING_CATEGORY_HIERARCHY: 'LOADING_CATEGORY_HIERARCHY',
    LOADING_SUBSUBCATEGORIES: 'LOADING_SUBSUBCATEGORIES',
    
    // Para manejar posts por niveles
    SET_CURRENT_CATEGORY_LEVEL: 'SET_CURRENT_CATEGORY_LEVEL',
    CLEAR_CATEGORY_HIERARCHY: 'CLEAR_CATEGORY_HIERARCHY'
};

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
 // En postAction.js
export const getCategories = (page = 1, limit = 2) => async (dispatch, getState) => {
  try {
      console.log(`📡 Llamando API categorías - Página ${page}, Límite ${limit}`);
      
      const { auth } = getState();
      const token = auth?.token;
      
      const res = await getDataAPI(
          `categories/paginated?page=${page}&limit=${limit}`,
          token
      );
      
      console.log('📥 Respuesta categorías completa:', res.data);
      
      if (!res.data.success) {
          throw new Error(res.data.msg || 'Error al cargar categorías');
      }
      
      // ✅ Mapear categorie a category para consistencia
      const formattedCategories = (res.data.categories || []).map(cat => ({
          ...cat,
          name: cat.displayName || cat.name || 'Sin nombre',
          // Si el backend devuelve categorie, mapearlo a category
          category: cat.categorie || cat.name,
          slug: cat.slug || (cat.name ? cat.name.toLowerCase().replace(/\s+/g, '-') : 'sin-nombre'),
          emoji: cat.emoji || '📁'
      }));
      
      console.log('✅ Categorías formateadas:', formattedCategories);
      
      dispatch({
          type: POST_TYPES.GET_CATEGORIES_PAGINATED,
          payload: {
              categories: formattedCategories,
              page: res.data.page || page,
              total: res.data.total || 0,
              hasMore: res.data.hasMore || false
          }
      });
      
      return res.data;
      
  } catch (err) {
      console.error('❌ Error en getCategories:', err);
      dispatch({
          type: POST_TYPES.ERROR_POST,
          payload: err.response?.data?.msg || 'Error cargando categorías'
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


// redux/actions/categoryAction.js
export const getCategoryProducts = (categorySlug, page = 1, level = 'auto') => async (dispatch) => {
    try {
      dispatch({ type: POST_TYPES .LOADING, payload: true });
      
      // Determinar nivel automáticamente si no se especifica
      const endpoint = level === 'auto' 
        ? `/api/categories/products/${categorySlug}/${page}`
        : `/api/categories/${level}/${categorySlug}/${page}`;
      
      const res = await getDataAPI(endpoint);
      
      dispatch({
        type: POST_TYPES .GET_CATEGORY_PRODUCTS,
        payload: {
          categorySlug,
          ...res.data,
          level: res.data.category?.level || 1
        }
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || 'Error loading products' }
      });
    } finally {
      dispatch({ type: POST_TYPES .LOADING, payload: false });
    }
  };
  
  export const getCategoryChildren = (parentSlug) => async (dispatch) => {
    try {
      dispatch({ type: POST_TYPES .LOADING_CHILDREN, payload: true });
      
      const res = await getDataAPI(`categories/children/${parentSlug}`);
      
      dispatch({
        type: POST_TYPES .GET_CATEGORY_CHILDREN,
        payload: {
          parentSlug,
          children: res.data
        }
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || 'Error loading subcategories' }
      });
      return [];
    } finally {
      dispatch({ type: POST_TYPES .LOADING_CHILDREN, payload: false });
    }
  };

// Añade esta acción para obtener subcategorías
export const getSubCategoriesByCategory = (categorySlug) => async (dispatch) => {
    try {
      dispatch({ type: POST_TYPES .LOADING_SUBCATEGORIES, payload: true });
      
      const res = await getDataAPI(`categories/${categorySlug}/subcategories`);
      
      dispatch({
        type: POST_TYPES .GET_SUBCATEGORIES,
        payload: {
          categorySlug,
          subcategories: res.data.subcategories
        }
      });
      
      return res.data.subcategories;
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response?.data?.msg || 'Error loading subcategories'
        }
      });
      return [];
    } finally {
      dispatch({ type: POST_TYPES .LOADING_SUBCATEGORIES, payload: false });
    }
  };
  
  // Y esta para obtener posts por subcategoría
  export const getPostsBySubcategory = (categorySlug, subcategorySlug, page = 1, limit = 12) => async (dispatch) => {
    try {
      dispatch({ type: POST_TYPES .LOADING, payload: true });
      
      const res = await getDataAPI(`posts/category/${categorySlug}/${subcategorySlug}?page=${page}&limit=${limit}`);
      
      dispatch({
        type: POST_TYPES .GET_POSTS_BY_SUBCATEGORY,
        payload: {
          categorySlug,
          subcategorySlug,
          posts: res.data.posts,
          result: res.data.result,
          page
        }
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response?.data?.msg || 'Error loading posts'
        }
      });
    } finally {
      dispatch({ type: POST_TYPES .LOADING, payload: false });
    }
  };
// 📂 redux/actions/postAction.js
// Añade esta acción junto con las otras

// ========== GET POSTS BY CATEGORY HIERARCHY (Niveles 1, 2, y 3) ==========
export const getPostsByCategoryHierarchy = (level1, level2 = null, level3 = null, page = 1, limit = 12) => async (dispatch) => {
    try {
      dispatch({ type: POST_TYPES.LOADING_POST, payload: true });
      
      
      console.log(`📡 Llamando API: ${level1}${level2 ? '/' + level2 : ''}${level3 ? '/' + level3 : ''} - Página ${page}`);
      
      // Construir la URL según los niveles proporcionados
      let url = `posts/hierarchy/${level1}`;
      if (level2) url += `/${level2}`;
      if (level3) url += `/${level3}`;
      
      // Añadir parámetros de paginación
      url += `?page=${page}&limit=${limit}`;
      
      const res = await  getDataAPI(url);
      
      console.log('📥 Respuesta API:', {
        success: res.data.success,
        postsCount: res.data.posts?.length,
        total: res.data.total,
        page: res.data.currentPage,
        hasSublevels: res.data.sublevels?.length > 0
      });
      
      // Determinar qué acción Redux usar según el nivel
      const actionPayload = {
        level1,
        level2,
        level3,
        posts: res.data.posts || [],
        page: res.data.currentPage || page,
        total: res.data.total || 0,
        totalPages: res.data.pages || Math.ceil((res.data.total || 0) / limit),
        sublevels: res.data.sublevels || [],
        categoryPath: res.data.categoryPath || 
                     (level3 ? `${level1}/${level2}/${level3}` : 
                      level2 ? `${level1}/${level2}` : level1)
      };
      
      // Dispatch según el nivel
      if (level3) {
        // Nivel 3: Sub-subcategoría
        dispatch({
          type: POST_TYPES.GET_POSTS_BY_CATEGORY_HIERARCHY,
          payload: actionPayload
        });
      } else if (level2) {
        // Nivel 2: Subcategoría
        dispatch({
          type: POST_TYPES.GET_POSTS_BY_CATEGORY_HIERARCHY,
          payload: actionPayload
        });
      } else {
        // Nivel 1: Categoría
        dispatch({
          type: POST_TYPES.GET_POSTS_BY_CATEGORY_HIERARCHY,
          payload: actionPayload
        });
      }
      
      return res.data;
      
    } catch (err) {
      console.error('❌ Error en getPostsByCategoryHierarchy:', err);
      
      dispatch({
        type: POST_TYPES.ERROR_POST,
        payload: err.response?.data?.msg || 
                 err.message || 
                 'Error al cargar los anuncios'
      });
      
      // Retornar datos vacíos para que el componente pueda manejar el error
      return {
        success: false,
        posts: [],
        total: 0,
        pages: 0,
        currentPage: page,
        error: err.response?.data?.msg || 'Error del servidor'
      };
    } finally {
      dispatch({ type: POST_TYPES.LOADING_POST, payload: false });
    }
  };
  
  // ========== GET SUB-SUBCATEGORIES (Nivel 3) ==========
  export const getSubSubCategories = (category, subcategory) => async (dispatch) => {
    try {
      dispatch({ type: POST_TYPES.LOADING_SUBSUBCATEGORIES, payload: true });
      
      console.log(`📡 Buscando sub-subcategorías: ${category}/${subcategory}`);
      
      const res = await getDataAPI(`categories/${category}/${subcategory}/subsubcategories`);
      
      console.log('📥 Sub-subcategorías encontradas:', {
        count: res.data.subSubCategories?.length,
        category: res.data.category,
        subcategory: res.data.subcategory
      });
      
      dispatch({
        type: POST_TYPES.GET_SUBSUBCATEGORIES,
        payload: {
          category,
          subcategory,
          subSubCategories: res.data.subSubCategories || []
        }
      });
      
      return res.data.subSubCategories || [];
      
    } catch (err) {
      console.error('❌ Error en getSubSubCategories:', err);
      
      dispatch({
        type: POST_TYPES.ERROR_POST,
        payload: err.response?.data?.msg || 'Error cargando sub-categorías'
      });
      
      return [];
    } finally {
      dispatch({ type: POST_TYPES.LOADING_SUBSUBCATEGORIES, payload: false });
    }
  };
  
  // ========== GET CATEGORIES HIERARCHY ==========
  export const getCategoriesHierarchy = () => async (dispatch) => {
    try {
      dispatch({ type: POST_TYPES.LOADING_CATEGORY_HIERARCHY, payload: true });
      
      console.log('📡 Obteniendo jerarquía completa de categorías...');
      
      const res = await getDataAPI('categories/hierarchy');
      
      console.log('📥 Jerarquía recibida:', {
        categoriesCount: res.data.hierarchy?.length,
        totalCategories: res.data.totalCategories
      });
      
      dispatch({
        type: POST_TYPES.GET_CATEGORIES_HIERARCHY,
        payload: res.data.hierarchy || []
      });
      
      return res.data.hierarchy || [];
      
    } catch (err) {
      console.error('❌ Error en getCategoriesHierarchy:', err);
      
      // No dispatch error aquí para no interrumpir la UI
      return [];
    } finally {
      dispatch({ type: POST_TYPES.LOADING_CATEGORY_HIERARCHY, payload: false });
    }
  };
  
  // ========== SET CURRENT CATEGORY LEVEL ==========
  export const setCurrentCategoryLevel = (level, category = null, subcategory = null, subsubcategory = null) => ({
    type: POST_TYPES.SET_CURRENT_CATEGORY_LEVEL,
    payload: { level, category, subcategory, subsubcategory }
  });
  
  // ========== CLEAR CATEGORY HIERARCHY ==========
  export const clearCategoryHierarchy = () => ({
    type: POST_TYPES.CLEAR_CATEGORY_HIERARCHY
  });
// 📂 redux/actions/postAction.js
export const getPostsByCategory = (category, page = 1, limit = 12) => async (dispatch) => {
    try {
      dispatch({ type: POST_TYPES .LOADING_POST, payload: true });
      
      console.log(`📡 Cargando posts para categoría: ${category}, página: ${page}`);
      
      const res = await getDataAPI(`posts/category/${category}?page=${page}&limit=${limit}`);
      
      console.log('📥 Respuesta categoría:', {
        success: res.data.success,
        postsCount: res.data.posts?.length,
        total: res.data.total
      });
      
      dispatch({
        type: POST_TYPES .GET_POSTS_BY_CATEGORY,
        payload: {
          category,
          posts: res.data.posts || [],
          page: res.data.currentPage || page,
          total: res.data.total || 0,
          totalPages: res.data.pages || Math.ceil((res.data.total || 0) / limit),
          result: res.data.result || res.data.posts?.length || 0
        }
      });
      
      return res.data;
      
    } catch (err) {
      console.error('❌ Error en getPostsByCategory:', err);
      
      dispatch({
        type: POST_TYPES .ERROR_POST,
        payload: { error: err.response?.data?.msg || 'Error cargando categoría' }
      });
      
      return {
        success: false,
        posts: [],
        total: 0,
        pages: 0,
        currentPage: page
      };
    } finally {
      dispatch({ type: POST_TYPES .LOADING_POST, payload: false });
    }
  };
 
 
// Busca esta función y verifica que tenga return dispatch
 


// Acción para crear post (ya la tienes, pero asegurar que guarda categoría)
// actions/postAction.js - createPost actualizada
 
/*export const getPostsBySubcategory = (categoryName, subcategoryId, page = 1, options = {}) => 
    async (dispatch, getState) => {
    try {
        dispatch({ type: POST_TYPES .LOADING, payload: true });
        
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
        
        dispatch({ type: POST_TYPES .LOADING, payload: false });
        return res.data;
        
    } catch (err) {
        console.error('❌ Error en getPostsBySubcategory action:', err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { 
                error: err.response?.data?.msg || 'Error al cargar subcategoría' 
            }
        });
        dispatch({ type: POST_TYPES .LOADING, payload: false });
        throw err;
    }
};
*/
// redux/actions/postAction.js
 
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
    dispatch({ type: POST_TYPES .AUTH, payload: {...auth, user: newUser}})

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
    dispatch({ type: POST_TYPES .AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`unSavePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}