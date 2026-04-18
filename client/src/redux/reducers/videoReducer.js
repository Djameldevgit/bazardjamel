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
  totalPages: 0,
  hasMore: true,
  children: [],
  // Estado para videos por categoría
  musicLibrary: [],
  musicLoading: false,
  musicError: null,

  videosByCategory: {},
  loadingByCategory: {},
  // Estado para comentarios
  comments: [],
  commentsTotal: 0,
  commentsPage: 1,
  hasMoreComments: true,
  commentsLoading: false
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_TYPES.LOADING:
      return { ...state, loading: action.payload };

    case VIDEO_TYPES.LOADING_BY_CATEGORY:
      console.log('📦 LOADING_BY_CATEGORY:', action.payload);
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
      console.log('📦 GET_VIDEOS - page:', action.payload.page, 'videos:', action.payload.videos?.length);
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
      console.log('📦 GET_VIDEOS_BY_CATEGORY:', action.payload.categorySlug);
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
    // ACCIONES DE COMENTARIOS
    // ============================================

    case VIDEO_TYPES.COMMENTS_LOADING:
      return { ...state, commentsLoading: action.payload };

    case VIDEO_TYPES.GET_COMMENTS:
      return {
        ...state,
        comments: action.payload.page === 1
          ? action.payload.comments
          : [...state.comments, ...action.payload.comments],
        commentsTotal: action.payload.total,
        commentsPage: action.payload.page,
        hasMoreComments: action.payload.hasMore,
        commentsLoading: false
      };

    case VIDEO_TYPES.ADD_COMMENT:
      return {
        ...state,
        comments: [action.payload, ...state.comments],
        commentsTotal: state.commentsTotal + 1,
        currentVideo: state.currentVideo
          ? {
            ...state.currentVideo,
            comments: [action.payload, ...(state.currentVideo.comments || [])]
          }
          : state.currentVideo
      };

    case VIDEO_TYPES.DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(c => c._id !== action.payload.commentId),
        commentsTotal: state.commentsTotal - 1,
        currentVideo: state.currentVideo
          ? {
            ...state.currentVideo,
            comments: (state.currentVideo.comments || []).filter(c => c._id !== action.payload.commentId)
          }
          : state.currentVideo
      };

    case VIDEO_TYPES.LIKE_COMMENT:
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment._id === action.payload.commentId
            ? { ...comment, likes: action.payload.likes, liked: action.payload.liked }
            : comment
        ),
        currentVideo: state.currentVideo
          ? {
            ...state.currentVideo,
            comments: (state.currentVideo.comments || []).map(comment =>
              comment._id === action.payload.commentId
                ? { ...comment, likes: action.payload.likes, liked: action.payload.liked }
                : comment
            )
          }
          : state.currentVideo
      };

    case VIDEO_TYPES.ADD_COMMENT_REPLY:
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment._id === action.payload.commentId
            ? {
              ...comment,
              replies: [...(comment.replies || []), action.payload.reply]
            }
            : comment
        ),
        currentVideo: state.currentVideo
          ? {
            ...state.currentVideo,
            comments: (state.currentVideo.comments || []).map(comment =>
              comment._id === action.payload.commentId
                ? {
                  ...comment,
                  replies: [...(comment.replies || []), action.payload.reply]
                }
                : comment
            )
          }
          : state.currentVideo
      };

    case VIDEO_TYPES.CLEAR_COMMENTS:
      return {
        ...state,
        comments: [],
        commentsTotal: 0,
        commentsPage: 1,
        hasMoreComments: true,
        commentsLoading: false
      };
    case VIDEO_TYPES.MUSIC_LOADING:
      return { ...state, musicLoading: action.payload };
    case VIDEO_TYPES.GET_MUSIC_LIBRARY:
      return { ...state, musicLibrary: action.payload, musicError: null };
    case VIDEO_TYPES.MUSIC_ERROR:
      return { ...state, musicError: action.payload };
    default:
      return state;
  }
};

export default videoReducer;