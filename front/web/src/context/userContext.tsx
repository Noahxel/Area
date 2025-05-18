import { createContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';

export interface IUserContext {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  createUser: (username: string, email: string, password: string, setError: (e: any) => void) => Promise<any>;
  signOut: () => void;
  getUserInfo: () => Promise<{username: string, email: string, connectServices: string[]}>;
  updateInfo: (email: string, username: string, oldPassword: string, newPassword: string) => Promise<any>;
  token: string | null;
  getGoogleToken: () => Promise<any>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  deleteUser: () => Promise<any>;
  confirmAccount: (token: string) => Promise<any>;
  disconnectService: (serviceName: string) => Promise<any>;
  confirmEmailChange: (token: string) => Promise<any>;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));

  const signUp = async (email: string, password: string) => {
    try {
      const response = await axios.post('https://api.techparisarea.com/auth/register', { email, password });
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        setToken(response.data.token);
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  }

  const confirmAccount = async (token: string) => {
    try {
      const response = await axios.get(`https://api.techparisarea.com/auth/confirm/${token}`);

      console.log('Received response from API:', response.data);
      return { status: response.status, message: response.data.message };
    } catch (error) {
      console.error("Error updating infos:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error("Server responded with:", error.response.data);
        return { status: error.response.status, message: error.response.data.message };
      } else {
        throw error;
      }
    }
  }

  const confirmEmailChange = async (token: string) => {
    try {
      const response = await axios.get(`https://api.techparisarea.com/auth/confirm-email-change/${token}`);

      console.log('Received response from API:', response.data);
      return { status: response.status, message: response.data.message };
    } catch (error) {
      console.error("Error updating infos:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error("Server responded with:", error.response.data);
        return { status: error.response.status, message: error.response.data.message };
      } else {
        throw error;
      }
    }
  }


  const signIn = async (email: string, password: string): Promise<any> => {
    console.log(`Attempting to sign in user with email: ${email}`);

    try {
      const response = await axios.post('https://api.techparisarea.com/auth/sign-in', { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Received response from API:', response.data);

      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        setToken(response.data.token);
        console.log('User successfully signed in and token saved.');
      } else {
        console.log('No token received in response.');
      }

      return response.data;

    } catch (error) {
      console.error("Error signing in:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error("Server responded with:", error.response.data);
        return error.response.data;
      } else {
        throw error;
      }
    }
  }

  const createUser = async (username: string, email: string, password: string, setError: (e: any) => void) => {
    try {
        const res = await axios.post(`https://api.techparisarea.com/auth/sign-up`, {username, email, password});
        if (res.data.token) {
          localStorage.setItem('userToken', res.data.token);
          setToken(res.data.token);
          console.log('User successfully signed in and token saved.');
        } else {
          console.log('No token received in response.');
        }
        return res;
    } catch(e: any) {
        setError(e.response.data.message);
        console.log(e);
    }
  }

  const signOut = () => {
    localStorage.removeItem('userToken');
    setToken(null);
  };

  const deleteUser = async () => {
    try {
      const response = await axios.delete('https://api.techparisarea.com/users/delete', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Received response from API:', response.data);
      signOut();
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server responded with:", error.response.data);
        return error.response.data;
      }
    }
  }

  const getGoogleToken = async () => {
    try {
          const res = await axios.get("https://api.techparisarea.com/auth/google/callback");
          if (res.data.token) {
            localStorage.setItem('userToken', res.data.token);
            setToken(res.data.token);
            console.log("User successfully connected to google and token saved.");
          } else {
            console.log("No token received in response.");
          }
          return res;
    } catch (error) {
      console.error("Error while getting google token : ", error);
    }
  }

  const getUserInfo = async () => {
    try {
      const response = await axios.get('https://api.techparisarea.com/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const disconnectService = async (serviceName: string): Promise<any> => {
    try {
      const response = await axios.delete(`https://api.techparisarea.com/users/disconnect/${serviceName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error disconnecting service:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server responded with:", error.response.data);
        return error.response.data;
      } else {
        throw error;
      }
    }
  };

  const updateInfo = async (email: string, username: string, oldPassword: string, newPassword: string) => {
    console.log(`UPDATING INFOS...`);

    try {
      const response = await axios.put('https://api.techparisarea.com/profile/update', { email, username, oldPassword, newPassword }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Received response from API:', response.data);
      return { status: response.status, message: response.data.message };
    } catch (error) {
      console.error("Error updating infos:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error("Server responded with:", error.response.data);
        return { status: error.response.status, message: error.response.data.message };
      } else {
        throw error;
      }
    }
};




  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken && storedToken !== token) {
      setToken(storedToken);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{signUp, signIn, createUser, deleteUser, signOut, getGoogleToken, token, getUserInfo, updateInfo, setToken, confirmAccount, disconnectService, confirmEmailChange}}>
      {children}
    </UserContext.Provider>
  )
}
