// api/apiHandler.js
import axios from "axios";

const BASE_URL = "http://localhost:8055/api";
// const BASE_URL="http://192.168.1.70:8080/api";
/* ---------------- AXIOS INSTANCE ---------------- */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------- COMMON GET ---------------- */
export const doGet = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("GET Error:", error);
    throw error?.response?.data || error;
  }
};

/* ---------------- COMMON POST ---------------- */
export const doPost = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(url, data, {
      timeout: 600000, // 10 minutes for data-heavy operations
      ...config
    });
    return response.data;
  } catch (error) {
    console.error("POST Error:", error);
    throw error?.response?.data || error;
  }
};

/* ---------------- COMMON PUT ---------------- */
export const doPut = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(url, data, {
      timeout: 600000, // 10 minutes for data-heavy operations
      ...config
    });
    return response.data;
  } catch (error) {
    console.error("PUT Error:", error);
    throw error?.response?.data || error;
  }
};

/* ---------------- COMMON POST (FORM DATA) ---------------- */
export const doPostForm = async (url, formData) => {
  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2 minutes for file uploads
    });
    return response.data;
  } catch (error) {
    console.error("POST FORM Error:", error);
    throw error?.response?.data || error;
  }
};

export default apiClient;
