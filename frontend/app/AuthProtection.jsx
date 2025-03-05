import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthProtection = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn) {
      navigate(-1);
    }
  }, [isLoggedIn, navigate]);

  return !isLoggedIn ? children : null;
};

export default AuthProtection;
