import { GLOBALTYPES } from './globalTypes'
import { postDataAPI, deleteDataAPI, getDataAPI, patchDataAPI } from '../../utils/fetchData'

export const NOTIFY_TYPES = {
    GET_NOTIFIES: 'GET_NOTIFIES',
    CREATE_NOTIFY: 'CREATE_NOTIFY',
    REMOVE_NOTIFY: 'REMOVE_NOTIFY',
    UPDATE_NOTIFY: 'UPDATE_NOTIFY',
    UPDATE_SOUND: 'UPDATE_SOUND',
    DELETE_ALL_NOTIFIES: 'DELETE_ALL_NOTIFIES'
}

// redux/actions/notifyAction.js - createNotify MEJORADO
export const createNotify = ({msg, auth, socket}) => async (dispatch) => {
    try {
        // ✅ Validaciones
        if (!auth || !auth.token) {
            console.error('❌ createNotify: Auth no disponible');
            return null;
        }
        
        if (!socket) {
            console.error('❌ createNotify: Socket no disponible');
            return null;
        }
        
        // ✅ Asegurar que recipients sea siempre un array
        let recipients = msg.recipients;
        if (!Array.isArray(recipients)) {
            recipients = [recipients];
        }
        
        const notifyMsg = {
            id: msg.id || auth.user._id,
            recipients: recipients,
            url: msg.url,
            text: msg.text,
            content: msg.content || '',
            image: msg.image || '',
            type: msg.type
        };
        
        console.log('📤 createNotify - Enviando a API:', {
            recipients: notifyMsg.recipients,
            text: notifyMsg.text,
            type: notifyMsg.type
        });
        
        // ✅ Guardar en base de datos
        const res = await postDataAPI('notify', notifyMsg, auth.token);
        
        console.log('📤 createNotify - Respuesta API:', res.data);
        
        // ✅ Emitir por socket
        const socketData = {
            ...res.data.notify,
            user: {
                _id: auth.user._id,
                username: auth.user.username,
                avatar: auth.user.avatar
            }
        };
        
        socket.emit('createNotify', socketData);
        
        return res.data;
    } catch (err) {
        console.error('❌ createNotify - Error:', err.response?.data || err.message);
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response?.data?.msg || 'Erreur de notification'}
        });
        return null;
    }
};
export const removeNotify = ({msg, auth, socket}) => async (dispatch) => {
    try {
        await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, auth.token)
        
        socket.emit('removeNotify', msg)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getNotifies = (token) => async (dispatch) => {
    try {
        const res = await getDataAPI('notifies', token)
        
        dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}


export const isReadNotify = ({msg, auth}) => async (dispatch) => {
    dispatch({type: NOTIFY_TYPES.UPDATE_NOTIFY, payload: {...msg, isRead: true}})
    try {
        await patchDataAPI(`/isReadNotify/${msg._id}`, null, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteAllNotifies = (token) => async (dispatch) => {
    dispatch({type: NOTIFY_TYPES.DELETE_ALL_NOTIFIES, payload: []})
    try {
        await deleteDataAPI('deleteAllNotify', token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}