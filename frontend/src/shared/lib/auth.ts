// src/shared/lib/auth.ts

const TOKEN_KEY = "vrm_token";
const ROLE_KEY = "vrm_role";

export const setSession = (token: string, role: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // exp is in seconds → convert to ms
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      clearSession();
      return false;
    }

    return true;
  } catch (error) {
    clearSession();
    return false;
  }
};