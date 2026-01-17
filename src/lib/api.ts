import axios from "axios";

const api = axios.create({
  baseURL: /*"http://localhost:5002/api" */"https://api.freelaverse.com/api"
});

export default api;

