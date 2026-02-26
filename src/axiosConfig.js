import axios from "axios";

const { protocol, hostname } = window.location;

const api = axios.create({
  baseURL: `${protocol}//${hostname}:5000/api`,
});

export default api;
