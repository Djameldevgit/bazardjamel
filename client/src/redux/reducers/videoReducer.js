// redux/reducers/videoReducer.js - LIMPIO (sin comentarios)

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
  totalPages: 0,
  hasMore: true,
  children: [],
  pendingVideo: null,
  musicLibrary: [],
  musicLoading: false,
  musicError: null,
  videosByCategory: {},
  loadingByCategory: {},
  
  // ✅ Trending videos
  trendingVideos: [],
  trendingLoading: false,
  trendingHasMore: true,
  trendingPage: 1,
  trendingTimeWindow: 'week'
  // ❌ ELIMINADO: comments, commentsTotal, etc.
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_TYPES.LOADING:
      return { ...state, loading: action.payload };

    case VIDEO_TYPES.LOADING_BY_CATEGORY:
      return {
        ...state,
        loadingByCategory: {
          ...state.loadingByCategory,
          [action.payload.categorySlug]: action.payload.loading
        }
      };

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
        hasMore: action.payload.hasMore,
        children: action.payload.children || [],
        loading: false
      };

    case VIDEO_TYPES.GET_VIDEO:
      return { ...state, currentVideo: action.payload, loading: false };

    case VIDEO_TYPES.GET_VIDEOS_BY_CATEGORY:
      return {
        ...state,
        videosByCategory: {
          ...state.videosByCategory,
          [action.payload.categorySlug]: {
            videos: action.payload.videos || [],
            total: action.payload.total || 0,
            page: action.payload.page || 1,
            totalPages: action.payload.totalPages || 1,
            hasMore: action.payload.hasMore || false,
            children: action.payload.children || []
          }
        },
        loadingByCategory: {
          ...state.loadingByCategory,
          [action.payload.categorySlug]: false
        }
      };

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
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, likes: action.payload.likes, liked: action.payload.liked }
          : state.currentVideo
      };

    case VIDEO_TYPES.SHARE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(v =>
          v._id === action.payload.id
            ? { ...v, shares: action.payload.shares, shared: action.payload.shared }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, shares: action.payload.shares, shared: action.payload.shared }
          : state.currentVideo
      };

    // ============================================
    // MÚSICA
    // ============================================
    case VIDEO_TYPES.MUSIC_LOADING:
      return { ...state, musicLoading: action.payload };

    case VIDEO_TYPES.GET_MUSIC_LIBRARY:
      return { ...state, musicLibrary: action.payload, musicError: null };

    case VIDEO_TYPES.MUSIC_ERROR:
      return { ...state, musicError: action.payload };

    // ============================================
    // VIDEO PENDIENTE
    // ============================================
    case VIDEO_TYPES.GET_PENDING_VIDEO:
      return { 
        ...state, 
        pendingVideo: action.payload,
        currentVideo: null,
        loading: false 
      };

    // ============================================
    // TRENDING VIDEOS
    // ============================================
    case VIDEO_TYPES.TRENDING_LOADING:
      return { ...state, trendingLoading: true };

    case VIDEO_TYPES.GET_TRENDING_VIDEOS:
      return {
        ...state,
        trendingVideos: action.payload.videos,
        trendingLoading: false,
        trendingHasMore: action.payload.hasMore,
        trendingPage: action.payload.page,
        trendingTimeWindow: action.payload.timeWindow
      };

    case VIDEO_TYPES.LOAD_MORE_TRENDING:
      return {
        ...state,
        trendingVideos: [...state.trendingVideos, ...action.payload.videos],
        trendingHasMore: action.payload.hasMore,
        trendingPage: action.payload.page
      };

    // ❌ ELIMINAR TODOS LOS CASOS DE COMENTARIOS

    default:
      return state;
  }
};

export default videoReducer;