import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8086/api"
});

export default API;