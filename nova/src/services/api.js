import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://nova-backend-bznk.onrender.com/api"
    : "/api");

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default API; 