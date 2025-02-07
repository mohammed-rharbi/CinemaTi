import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosInstance = axios.create({ 
  baseURL: process.env.EXPO_PUBLIC_SERTY,
});
axiosInstance.interceptors.request.use(
 async function (config) {
    const token =await AsyncStorage.getItem('token');


    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    //   config.headers['Content-Type']='multipart/form-data'
    // }
    config.headers['Content-Type'] = 'application/json'
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  function (error) {

    return Promise.reject(error); 
  }
);

export default axiosInstance;