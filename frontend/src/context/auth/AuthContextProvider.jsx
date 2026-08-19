import { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { authService } from "../../services/authService";
import Loading from "../../components/Loading";

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

export const useAuthContext = () => {
  return useContext(AuthContext);
};
