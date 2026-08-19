import { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { apiClient } from "../../services/api";

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiClient.get("/api/v1/users/current-user");
        setUser(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

export const useAuthContext = () => {
  return useContext(AuthContext);
};
