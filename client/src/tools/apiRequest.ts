import axios from "axios";
import getBaseURL from "./getBaseURL";

const apiRequest = axios.create({
  baseURL: getBaseURL(import.meta.env.VITE_API_PORT) + "/api",
});

export default apiRequest;
