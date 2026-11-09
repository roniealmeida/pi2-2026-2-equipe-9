import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  // Verifica token ou flag no Zustand ou no localStorage
  const tokenSalvo = localStorage.getItem("token");
  const estaAutenticado = isAuthenticated || token || !!tokenSalvo;

  if (!estaAutenticado) {
    // Redireciona para a tela de login enviando a rota original no state
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}