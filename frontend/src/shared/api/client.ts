import axios from "axios";
import { API_BASE_URL } from "../config/env";

const client = axios.create({
  baseURL: API_BASE_URL, // e.g. http://127.0.0.1:8000/api
  headers: {
    "Content-Type": "application/json",
  },
});

/* Attach access token */
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vrm_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* Handle 401 with refresh token */
client.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    // avoid infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("vrm_refresh");

        if (!refresh) {
          throw new Error("No refresh token");
        }

        //  CORRECT refresh API
        const res = await axios.post(
          "http://127.0.0.1:8000/api/auth/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        //  store new access token
        localStorage.setItem("vrm_token", newAccess);

        //  retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }

        return client(originalRequest);

      } catch (refreshError) {

        //  refresh failed → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default client;