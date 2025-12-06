import axios from "axios";

// Por defecto
let baseURL = "https://localhost:7014/api";

// Si estás en otra PC, cambia el puerto o host
if (window.location.hostname === "EL22-PC01") {
  baseURL = "https://localhost:5000/api";
}

// Crear instancia de axios
const api = axios.create({ baseURL });

export default api;
