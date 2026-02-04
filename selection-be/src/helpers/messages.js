// Message codes and texts
const MESSAGES = {
    // Authentication (1000-1099)
    1001: 'User already exists',
    1002: 'Invalid credentials',
    1003: 'No token provided',
    1004: 'Token is not valid',
    1005: 'User registered successfully',
    1006: 'Login successful',

    // User (1100-1199)
    1101: 'User not found',
    1102: 'User deleted',
    1103: 'Users fetched successfully',
    1104: 'User created successfully',
    1105: 'User updated successfully',

    // General (1200-1299)
    1201: 'Internal server error',
    1202: 'Bad request',

    // Selection (2000-2099)
    2001: 'Selections fetched successfully',
    2002: 'Selection not found',
    2003: 'Selection created successfully',
    2004: 'Selection updated successfully',
    2005: 'Selection deleted successfully',

    // Selection Order (2100-2199)
    2101: 'Selection orders fetched successfully',
    2102: 'Selection order created successfully',

    // Selection Details (2200-2299)
    2201: 'Selection details fetched successfully',
    2202: 'Selection details created successfully',

    // Authorization
    4003: 'Access denied. Admin rights required.',
};

export const get_message = (code) => {
    return MESSAGES[code] || 'Unknown message';
};

// For backward compatibility
export const AUTH_MESSAGES = {
    USER_EXISTS: 1001,
    INVALID_CREDENTIALS: 1002,
    NO_TOKEN: 1003,
    INVALID_TOKEN: 1004,
    REGISTRATION_SUCCESS: 1005,
    LOGIN_SUCCESS: 1006,
};

export const USER_MESSAGES = {
    USER_NOT_FOUND: 1101,
    USER_DELETED: 1102,
    USERS_FETCHED: 1103,
    USER_CREATED: 1104,
    USER_UPDATED: 1105,
};

export const GENERAL_MESSAGES = {
    INTERNAL_ERROR: 1201,
    BAD_REQUEST: 1202,
};
