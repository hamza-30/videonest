import { useState } from "react";
import { authService } from "../services/authService";
import { useAuthContext } from "../context/auth/AuthContextProvider";

function useAuth() {
  const { setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (body) => {
    setLoading(true);
    try {
      const response = await authService.login(body);
      setUser(response.data.user);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (body) => {
    setLoading(true);
    try {
      const response = await authService.signup(body);
      setUser(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { getCurrentUser, login, signup, logout, loading, error };
}

export default useAuth;
