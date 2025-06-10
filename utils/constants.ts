// API Configuration
export const API_ENDPOINTS = {
  USERS: "/users",
  POSTS: "/posts",
  COMMENTS: "/comments",
  ALBUMS: "/albums",
  PHOTOS: "/photos",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Cache times (in milliseconds)
export const CACHE_TIME = {
  SHORT: 2 * 1000, // 2 giây
  MEDIUM: 5 * 1000, // 5 giây
  LONG: 10 * 1000, // 10 giây
  VERY_LONG: 30 * 1000, // 30 giây
} as const;

// Loading states
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

// Form validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "current_user",
  THEME: "app_theme",
  LANGUAGE: "app_language",
} as const;

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
