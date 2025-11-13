import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/", // Pastikan path benar
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    console.log('🔐 API Interceptor - Request details:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'None'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to headers');
    } else {
      console.warn('⚠️ No token found for API request');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    return Promise.reject(error);
  }
);

export default api;