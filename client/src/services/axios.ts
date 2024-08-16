import axios from "axios";
import { getLanguageFromLocalStorage } from "../utils/getLanguage";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:5173/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    // Retrieve language from local storage
    const language = getLanguageFromLocalStorage(); // Retrieve the language setting

    // Add language to headers or query params
    config.headers["Accept-Language"] = language;
    // or if you prefer query params, you can modify the URL like this
    // config.params = { ...config.params, lng: language };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
