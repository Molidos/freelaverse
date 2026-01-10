import axios from "axios";

const api = axios.create({
  baseURL: "https://api.freelaverse.com/api",
});

export default api;

