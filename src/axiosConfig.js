import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7014/api", // cambia al puerto de tu API
});

export default api;
