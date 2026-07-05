import axios from "axios";
import getBaseURL from "./getBaseURL";

const apiRequest = axios.create({
  baseURL: getBaseURL(import.meta.env.VITE_API_PORT) + "/api",
});
// const apiRequest = axios.create({
//   baseURL: "http://localhost:2000/api",
// });

export default apiRequest;
