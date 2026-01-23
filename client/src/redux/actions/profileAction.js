import { GLOBALTYPES, DeleteData } from './globalTypes'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { imageUpload } from '../../utils/imageUpload'
import { createNotify, removeNotify } from '../actions/notifyAction'


export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_PROFILE_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    GET_ID: 'GET_PROFILE_ID',
    GET_POSTS: 'GET_PROFILE_POSTS',
    UPDATE_POST: 'UPDATE_PROFILE_POST'
}


// actions/profileAction.js
export const getProfileUsers = ({id, auth}) => async (dispatch) => {
    dispatch({type: PROFILE_TYPES.GET_ID, payload: id})

    try {
        dispatch({type: PROFILE_TYPES.LOADING, payload: true})
        
        // 🔥 PROBLEMA: Estás usando res y res1 sin await
        // Solución: Usar Promise.all para esperar ambas promesas
        const [usersRes, postsRes] = await Promise.all([
            getDataAPI(`user/${id}`, auth.token),
            getDataAPI(`user_posts/${id}?limit=9&page=1`, auth.token) // Añadir paginación
        ]);

        // Verificar si las respuestas son exitosas
        if (!usersRes.data || !usersRes.data.user) {
            throw new Error('Usuario no encontrado');
        }

        // Preparar datos estructurados
        const userData = {
            ...usersRes.data.user,
            _id: id
        };

        const postsData = {
            _id: id,
            posts: postsRes.data.posts || [],
            result: postsRes.data.pagination?.totalPosts || postsRes.data.result || 0,
            page: 1
        };

        console.log('📦 Datos obtenidos:', {
            user: userData,
            posts: postsData
        });

        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: userData
        });

        dispatch({
            type: PROFILE_TYPES.GET_POSTS,
            payload: postsData // Cambiado de {...posts.data, _id: id, page: 2}
        });

        dispatch({type: PROFILE_TYPES.LOADING, payload: false});
        
    } catch (err) {
        console.error('❌ Error en getProfileUsers:', err);
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response?.data?.msg || 'Error al cargar perfil'}
        });
        dispatch({type: PROFILE_TYPES.LOADING, payload: false});
    }
}

export const updateProfileUser = ({userData, avatar, auth}) => async (dispatch) => {
   
    if(userData.username.length > 25)
    return dispatch({type: GLOBALTYPES.ALERT, payload: {error: "Your full name too long."}})

    if(userData.story.length > 200)
    return dispatch({type: GLOBALTYPES.ALERT, payload: {error: "Your story too long."}})

    try {
        let media;
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        if(avatar) media = await imageUpload([avatar])

        const res = await patchDataAPI("user", {
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar
        }, auth.token)

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                ...auth,
                user: {
                    ...auth.user, ...userData,
                    avatar: avatar ? media[0].url : auth.user.avatar,
                }
            }
        })

        dispatch({type: GLOBALTYPES.ALERT, payload: {success: res.data.msg}})
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}

export const follow = ({users, user, auth, socket}) => async (dispatch) => {
    let newUser;
    
    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: [...user.followers, auth.user]}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers: [...item.followers, auth.user]}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: {
            ...auth,
            user: {...auth.user, following: [...auth.user.following, newUser]}
        }
    })


    try {
        const res = await patchDataAPI(`user/${user._id}/follow`, null, auth.token)
        socket.emit('follow', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}

export const unfollow = ({users, user, auth, socket}) => async (dispatch) => {

    let newUser;

    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: DeleteData(user.followers, auth.user._id)}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers: DeleteData(item.followers, auth.user._id)}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: {
            ...auth,
            user: { 
                ...auth.user, 
                following: DeleteData(auth.user.following, newUser._id) 
            }
        }
    })
   

    try {
        const res = await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token)
        socket.emit('unFollow', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(removeNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}