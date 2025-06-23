import { API_URL } from "./apiPath";
import axios from 'axios'


export const loginAdmin = async (email: string, password: string) => {
    const response = await axios.post(
      `${API_URL}/admin/login `,
      { email, password },
      {
        withCredentials: true, 
      }
    );
    return response;
  };


export const getUserInfo = async () => {
    const response = await axios.get(`${API_URL}/auth/get-user-info`, {
        withCredentials: true 
    });
return response.data; 
};
