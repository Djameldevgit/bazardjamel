// reducers/profileReducer.js
import { PROFILE_TYPES } from '../actions/profileAction'
import { EditData } from '../actions/globalTypes'

const initialState = {
    loading: false,
    ids: [],
    users: [],
    posts: []
}

const profileReducer = (state = initialState, action) => {
    switch (action.type){
        case PROFILE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };

        case PROFILE_TYPES.GET_USER:
            return {
                ...state,
                users: state.users.some(user => user._id === action.payload._id) 
                    ? state.users.map(user => 
                        user._id === action.payload._id 
                            ? {...user, ...action.payload} 
                            : user
                      )
                    : [...state.users, action.payload]
            };

        case PROFILE_TYPES.GET_ID:
            return {
                ...state,
                ids: state.ids.includes(action.payload) 
                    ? state.ids 
                    : [...state.ids, action.payload]
            };

        case PROFILE_TYPES.GET_POSTS:
            // Buscar si ya existe un post con ese ID
            const existingPostIndex = state.posts.findIndex(p => p._id === action.payload._id);
            
            if (existingPostIndex >= 0) {
                // Actualizar posts existentes
                const updatedPosts = [...state.posts];
                updatedPosts[existingPostIndex] = {
                    ...updatedPosts[existingPostIndex],
                    ...action.payload,
                    posts: [...action.payload.posts] // Reemplazar completamente
                };
                
                return {
                    ...state,
                    posts: updatedPosts
                };
            } else {
                // Añadir nuevos posts
                return {
                    ...state,
                    posts: [...state.posts, action.payload]
                };
            }

        case PROFILE_TYPES.UPDATE_POST:
            const postIndex = state.posts.findIndex(item => item._id === action.payload._id);
            
            if (postIndex >= 0) {
                const currentPosts = state.posts[postIndex].posts || [];
                const updatedPosts = [...state.posts];
                
                updatedPosts[postIndex] = {
                    ...updatedPosts[postIndex],
                    posts: [...currentPosts, ...(action.payload.posts || [])],
                    page: action.payload.page || updatedPosts[postIndex].page + 1,
                    result: action.payload.result || updatedPosts[postIndex].result
                };

                return {
                    ...state,
                    posts: updatedPosts
                };
            }
            
            return state;

        case PROFILE_TYPES.FOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };

        case PROFILE_TYPES.UNFOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };

        default:
            return state;
    }
}

export default profileReducer