import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import { toast } from "react-hot-toast";

function useAuth() {
  const { setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (body) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(body);
      setUser(response.data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (body) => {
    setLoading(true);
    setError(null);

    try {
      await authService.signup(body);
      toast.success("Account created! Please login your account");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Logout failed");
      toast.error(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return { login, signup, logout, loading, error };
}

export default useAuth;
