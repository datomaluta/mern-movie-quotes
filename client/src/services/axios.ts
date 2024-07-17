import axios from "axios";

export const instance = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "http://localhost:5173/api",
  headers: {
    "Content-Type": "application/json",
  },
});
