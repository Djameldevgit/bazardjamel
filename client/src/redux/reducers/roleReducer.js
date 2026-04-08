// 📂 redux/reducers/roleReducer.js - VERSIÓN CORREGIDA

import { ROLES_TYPES } from '../actions/roleAction';

const initialState = {
  loading: false,
  isAdmin: false,
  isModerator: false,
  isSuperUser: false,
  currentRole: 'user',
  lastUpdated: null,
  assignedCategories: []
};

export const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ROLES_TYPES.LOADING:
      return { ...state, loading: action.payload };
      
    case ROLES_TYPES.UPDATE_ROLE:
      return {
        ...state,
        currentRole: action.payload.newRole,
        isAdmin: action.payload.newRole === 'admin',
        isModerator: action.payload.newRole === 'moderator',
        isSuperUser: action.payload.newRole === 'Super-utilisateur',
        lastUpdated: Date.now()
      };
      
    case ROLES_TYPES.USER_ROLE:
      return {
        ...state,
        currentRole: 'user',
        isAdmin: false,
        isModerator: false,
        isSuperUser: false,
        lastUpdated: Date.now()
      };
      
    case ROLES_TYPES.SUPERUSER_ROLE:
      return {
        ...state,
        currentRole: 'Super-utilisateur',
        isAdmin: false,
        isModerator: false,
        isSuperUser: true,
        lastUpdated: Date.now()
      };
      
    case ROLES_TYPES.MODERADOR_ROLE:
      return {
        ...state,
        currentRole: 'moderator',
        isAdmin: false,
        isModerator: true,
        isSuperUser: false,
        lastUpdated: Date.now(),
        assignedCategories: action.payload.res?.user?.assignedCategories || []
      };
      
    case ROLES_TYPES.ADMIN_ROLE:
      return {
        ...state,
        currentRole: 'admin',
        isAdmin: true,
        isModerator: false,
        isSuperUser: false,
        lastUpdated: Date.now()
      };
      
    default:
      return state;
  }
};