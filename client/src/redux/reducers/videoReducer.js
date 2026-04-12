// redux/reducers/videoReducer.js
import { VIDEO_TYPES } from '../actions/videoAction';

const initialState = {
  loading: false,
  videos: [],
  featuredVideos: [],
  popularVideos: [],
  relatedVideos: [],
  currentVideo: null,
  total: 0,
  page: 1,
  totalPages: 0
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_TYPES.LOADING:
      return { ...state, loading: action.payload };
      
    case VIDEO_TYPES.GET_FEATURED_VIDEOS:
      return { ...state, featuredVideos: action.payload };
      
    case VIDEO_TYPES.GET_POPULAR_VIDEOS:
      return { ...state, popularVideos: action.payload };
      
    case VIDEO_TYPES.GET_RELATED_VIDEOS:
      return { ...state, relatedVideos: action.payload };
      
    case VIDEO_TYPES.GET_VIDEOS:
      return {
        ...state,
        videos: action.payload.page === 1 ? action.payload.videos : [...state.videos, ...action.payload.videos],
        total: action.payload.total,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        loading: false
      };
      
    case VIDEO_TYPES.GET_VIDEO:
      return { ...state, currentVideo: action.payload, loading: false };
      
    case VIDEO_TYPES.CREATE_VIDEO:
      return { ...state, videos: [action.payload, ...state.videos] };
      
    case VIDEO_TYPES.UPDATE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(v => v._id === action.payload._id ? action.payload : v),
        currentVideo: state.currentVideo?._id === action.payload._id ? action.payload : state.currentVideo
      };
      
    case VIDEO_TYPES.DELETE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter(v => v._id !== action.payload),
        currentVideo: state.currentVideo?._id === action.payload ? null : state.currentVideo
      };
      
    case VIDEO_TYPES.LIKE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(v => 
          v._id === action.payload.id 
            ? { ...v, likes: action.payload.likes, liked: action.payload.liked }
            : v
        ),
        featuredVideos: state.featuredVideos.map(v =>
          v._id === action.payload.id
            ? { ...v, likes: action.payload.likes, liked: action.payload.liked }
            : v
        ),
        popularVideos: state.popularVideos.map(v =>
          v._id === action.payload.id
            ? { ...v, likes: action.payload.likes, liked: action.payload.liked }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, likes: action.payload.likes, liked: action.payload.liked }
          : state.currentVideo
      };
      
    default:
      return state;
  }
};

export default videoReducer;