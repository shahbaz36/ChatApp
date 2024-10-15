import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ChatContext } from "../../Context/ChatContext";

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useContext(ChatContext);

  if (!isAuth) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
