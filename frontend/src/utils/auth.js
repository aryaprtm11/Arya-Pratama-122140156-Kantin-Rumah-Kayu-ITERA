// Utility functions untuk autentikasi
export const isAuthenticated = () => {
  const userData = sessionStorage.getItem('user');
  return userData !== null;
};

export const getCurrentUser = () => {
  const userData = sessionStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      sessionStorage.removeItem('user');
      return null;
    }
  }
  return null;
};

export const logout = () => {
  sessionStorage.removeItem('user');
  window.dispatchEvent(new Event('userLogout'));
};

export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  return true;
}; 