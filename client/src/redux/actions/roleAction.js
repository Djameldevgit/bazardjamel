// 📂 redux/actions/roleAction.js - VERSIÓN CORREGIDA

import { patchDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from './globalTypes'

export const ROLES_TYPES = {
  LOADING: 'LOADING',
  USER_ROLE: 'USER_ROLE',
  SUPERUSER_ROLE: 'SUPERUSER_ROLE',
  MODERADOR_ROLE: 'MODERADOR_ROLE',
  ADMIN_ROLE: 'ADMIN_ROLE',
  UPDATE_ROLE: 'UPDATE_ROLE'
}

// 🔥 ACTUALIZAR ROL GENÉRICO
export const updateUserRole = (userId, newRole, token) => async (dispatch, getState) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    // ✅ Ruta corregida para coincidir con el backend
    const res = await patchDataAPI(`role/update/${userId}`, { role: newRole }, token);

    dispatch({
      type: ROLES_TYPES.UPDATE_ROLE,
      payload: {
        userId,
        newRole,
        updatedUser: res.data.user
      }
    });

    const { auth } = getState();
    if (auth.user?._id === userId) {
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: res.data.user
        }
      });
    }

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.msg } 
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { 
        error: err.response?.data?.msg || 'Error updating role' 
      }
    });
    throw err;
  }
};

// 👤 ASIGNAR ROL DE USUARIO NORMAL
export const roleuserautenticado = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true });
    
    // ✅ Ruta corregida
    const res = await patchDataAPI(`role/assign-user/${user._id}`, { role: 'user' }, auth.token);
    
    dispatch({
      type: ROLES_TYPES.USER_ROLE,
      payload: { user, res: res.data }
    });

    // Actualizar auth si es el usuario actual
    if (auth.user?._id === user._id) {
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: { ...auth, user: { ...auth.user, role: 'user' } }
      });
    }

    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  }
};

// ⭐ ASIGNAR ROL DE SUPER USUARIO
export const rolesuperuser = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true });

    // ✅ Ruta corregida
    const res = await patchDataAPI(`role/assign-superuser/${user._id}`, { role: 'Super-utilisateur' }, auth.token);

    dispatch({
      type: ROLES_TYPES.SUPERUSER_ROLE,
      payload: { user: { ...user, role: 'Super-utilisateur' } }
    });

    if (auth.user?._id === user._id) {
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: { ...auth, user: { ...auth.user, role: 'Super-utilisateur' } }
      });
    }

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message },
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  }
};

// 🛡️ ASIGNAR ROL DE MODERADOR
export const rolemoderador = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true });
    
    // ✅ Ruta corregida
    const res = await patchDataAPI(`role/assign-moderator/${user._id}`, { role: 'moderator' }, auth.token);

    dispatch({
      type: ROLES_TYPES.MODERADOR_ROLE,
      payload: { user, res: res.data }
    });

    if (auth.user?._id === user._id) {
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: { ...auth, user: { ...auth.user, role: 'moderator' } }
      });
    }

    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  }
};

// 👑 ASIGNAR ROL DE ADMIN
export const roleadmin = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true });
    
    // ✅ Ruta corregida
    const res = await patchDataAPI(`role/assign-admin/${user._id}`, { role: 'admin' }, auth.token);

    dispatch({
      type: ROLES_TYPES.ADMIN_ROLE,
      payload: { user, res: res.data }
    });

    if (auth.user?._id === user._id) {
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: { ...auth, user: { ...auth.user, role: 'admin' } }
      });
    }

    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  }
};