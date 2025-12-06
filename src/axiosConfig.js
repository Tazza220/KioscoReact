import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // cambia al puerto de tu API
});

export default api;
