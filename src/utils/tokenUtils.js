// frontend/src/utils/tokenUtils.js

/**
 * Get clean token from localStorage
 */
export const getToken = () => {
  const token = localStorage.getItem("userToken");
  
  if (!token) {
    return null;
  }
  
  // Remove any whitespace, quotes, or special characters
  let cleanToken = token.trim();
  
  // Remove surrounding quotes if present
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
    cleanToken = cleanToken.slice(1, -1);
  }
  
  // Remove any line breaks or spaces
  cleanToken = cleanToken.replace(/\s/g, '');
  
  return cleanToken;
};

/**
 * Set token in localStorage (cleaned)
 */
export const setToken = (token) => {
  if (!token) {
    localStorage.removeItem("userToken");
    return;
  }
  
  // Clean the token before storing
  let cleanToken = token.trim();
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
    cleanToken = cleanToken.slice(1, -1);
  }
  cleanToken = cleanToken.replace(/\s/g, '');
  
  localStorage.setItem("userToken", cleanToken);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  const userInfo = localStorage.getItem("userInfo");
  return !!(token && userInfo);
};

/**
 * Get user info from localStorage
 */
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error parsing user info:", error);
    return null;
  }
};

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("guestId");
};