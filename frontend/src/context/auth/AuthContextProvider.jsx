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
        const currentUser = await apiClient.get("/api/v1/users/current-user");
        setUser(currentUser);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

export const useAuthContext = () => {
  return useContext(AuthContext);
};
