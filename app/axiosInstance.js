import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const token = cookies.get("token");

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    Authorization: `Bearer ${token}`,
    // "Content-Type": "application/json",
  },
});

export default axiosInstance;
