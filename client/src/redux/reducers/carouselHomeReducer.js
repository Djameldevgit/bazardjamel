// frontend/src/redux/reducers/carouselReducer.js
import { CAROUSEL_TYPES } from '../actions/carouselHomeAction';

const initialState = {
  images: [],        // Para getCarouselImages
  homeImages: [],    // Para getHomeCarousel
  allImages: [],     // Para admin
  loading: false,
  error: null
};
const carouselHomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CAROUSEL_TYPES.GET_CAROUSEL_IMAGES:
      return {
        ...state,
        images: action.payload
      };
      
    case CAROUSEL_TYPES.GET_HOME_CAROUSEL:
      return {
        ...state,
        homeImages: action.payload
      };
    case CAROUSEL_TYPES.GET_CAROUSEL_IMAGES:
      return {
        ...state,
        images: action.payload
      };
      
    case CAROUSEL_TYPES.GET_ALL_CAROUSEL_IMAGES:
      return {
        ...state,
        allImages: action.payload
      };
      
    case CAROUSEL_TYPES.CREATE_CAROUSEL_IMAGE:
      return {
        ...state,
        allImages: [...state.allImages, action.payload]
      };
      
    case CAROUSEL_TYPES.UPDATE_CAROUSEL_IMAGE:
      return {
        ...state,
        allImages: state.allImages.map(img =>
          img._id === action.payload._id ? action.payload : img
        ),
        images: state.images.map(img =>
          img._id === action.payload._id ? action.payload : img
        )
      };
      
    case CAROUSEL_TYPES.DELETE_CAROUSEL_IMAGE:
      return {
        ...state,
        allImages: state.allImages.filter(img => img._id !== action.payload),
        images: state.images.filter(img => img._id !== action.payload)
      };
      
    case CAROUSEL_TYPES.REORDER_CAROUSEL_IMAGES:
      const updatedAllImages = state.allImages.map(img => {
        const found = action.payload.find(item => item.id === img._id);
        if (found) {
          return { ...img, order: found.order };
        }
        return img;
      });
      const updatedImages = state.images.map(img => {
        const found = action.payload.find(item => item.id === img._id);
        if (found) {
          return { ...img, order: found.order };
        }
        return img;
      });
      return {
        ...state,
        allImages: updatedAllImages.sort((a, b) => (a.order || 0) - (b.order || 0)),
        images: updatedImages.sort((a, b) => (a.order || 0) - (b.order || 0))
      };
      
    case CAROUSEL_TYPES.CAROUSEL_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case CAROUSEL_TYPES.CAROUSEL_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default carouselHomeReducer;