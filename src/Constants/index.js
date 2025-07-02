// Application Constants

// Manager Ranks
export const MANAGER_RANKS = [
    { value: '', label: 'Select rank' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Senior Manager', label: 'Senior Manager' },
    { value: 'Director', label: 'Director' },
    { value: 'Senior Director', label: 'Senior Director' },
    { value: 'VP', label: 'Vice President' },
    { value: 'SVP', label: 'Senior Vice President' }
];

// Common Departments
export const DEPARTMENTS = [
    'Marketing',
    'Sales',
    'Operations',
    'Finance',
    'Human Resources',
    'Engineering',
    'IT',
    'Legal',
    'Customer Service',
    'Research & Development'
];

// API Endpoints
export const API_ENDPOINTS = {
    MANAGERS: '/managers',
    MANAGER_DETAILS: (id) => `/managers/${id}/summary`,
    CREATE_MANAGER: '/managers',
    UPDATE_MANAGER: (id) => `/managers/${id}`,
    DELETE_MANAGER: (id) => `/managers/${id}`,
    MANAGER_ROUNDS: (id) => `/managers/${id}/rounds`
};

// Loading States
export const LOADING_STATES = {
    IDLE: 'idle',
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error - please check your connection',
    SERVER_ERROR: 'Server error - please try again later',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    VALIDATION_ERROR: 'Please check your input and try again',
    UNKNOWN_ERROR: 'An unexpected error occurred'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    MANAGER_CREATED: 'Manager created successfully',
    MANAGER_UPDATED: 'Manager updated successfully',
    MANAGER_DELETED: 'Manager deleted successfully'
};

// Form Validation Rules
export const VALIDATION_RULES = {
    NAME: {
        required: true,
        minLength: 2,
        maxLength: 100
    },
    RANK: {
        required: true
    },
    DEPARTMENT: {
        required: true,
        minLength: 2,
        maxLength: 50
    }
};

// UI Constants
export const UI_CONSTANTS = {
    ITEMS_PER_PAGE: 10,
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 5000,
    MODAL_ANIMATION_DURATION: 200
};

// Routes
export const ROUTES = {
    HOME: '/',
    MANAGERS: '/managers',
    MANAGER_DETAILS: (id) => `/managers/${id}`,
    CREATE_MANAGER: '/managers/new',
    EDIT_MANAGER: (id) => `/managers/edit/${id}`
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER_PREFERENCES: 'userPreferences',
    THEME: 'theme'
};

// Theme Colors
export const THEME_COLORS = {
    PRIMARY: '#0b80ee',
    SECONDARY: '#60758a',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#dc3545',
    INFO: '#3b82f6'
};

// Responsive Breakpoints
export const BREAKPOINTS = {
    MOBILE: '480px',
    TABLET: '768px',
    DESKTOP: '1024px',
    LARGE_DESKTOP: '1440px'
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'DD/MM/YYYY',
    API: 'YYYY-MM-DD',
    FULL: 'DD/MM/YYYY HH:mm:ss'
};

// Regex Patterns
export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[+]?[1-9][\d\s\-()]{7,15}$/,
    NAME: /^[a-zA-Z\s\u0600-\u06FF]{2,100}$/
};