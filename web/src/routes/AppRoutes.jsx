import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import EditarPerfil from "../pages/EditarPerfil/EditarPerfil";
import AlterarSenha from "../pages/EditarPerfil/AlterarSenha/AlterarSenha";
import Historico from "../pages/Historico/Historico"; 
import Retorno from "../pages/Retorno/Retorno"; 
import Resultado from "../pages/Resultado/Resultado"; 
import Cadastrar from "../pages/Cadastro/Cadastrar";
import Propriedade from "../pages/Cadastro/Propriedade";
import Admin from "../pages/Admin/Admin";
import CadastroAdmin from "../pages/Admin/CadastroAdmin/CadastroAdmin";
import ListUsers from "../pages/Admin/ListUsers/ListUsers";
import OpcoesCad from "../pages/Cadastro/OpcoesCad";
import CadastroProdutor from "../pages/Cadastro/CadastroProdutor";
import CadastroTecnico from "../pages/Cadastro/CadastroTecnico";

import TecnicoFilaTrabalho from "../pages/TecnicoFilaTrabalho/TecnicoFilaTrabalho";
import TecnicoRevisaoDiagnostico from "../pages/TecnicoRevisaoDiagnostico/TecnicoRevisaoDiagnostico";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🟢 ROTAS PÚBLICAS (Acesso sem login) */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastrar />} />
      <Route path="/opcoesCadastro" element={<OpcoesCad />} />
      <Route path="/cadastroProdutor" element={<CadastroProdutor />} />
      <Route path="/cadastroTecnico" element={<CadastroTecnico />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editar-perfil"
        element={
          <ProtectedRoute>
            <EditarPerfil />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alterar-senha"
        element={
          <ProtectedRoute>
            <AlterarSenha />
          </ProtectedRoute>
        }
      />
      <Route
        path="/historico"
        element={
          <ProtectedRoute>
            <Historico />
          </ProtectedRoute>
        }
      />
      <Route
        path="/propriedade"
        element={
          <ProtectedRoute>
            <Propriedade />
          </ProtectedRoute>
        }
      />
      <Route
        path="/retorno/:id"
        element={
          <ProtectedRoute>
            <Retorno />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resultado/:id"
        element={
          <ProtectedRoute>
            <Resultado />
          </ProtectedRoute>
        }
      />


      <Route
        path="/fila-trabalho"
        element={
          <ProtectedRoute>
            <TecnicoFilaTrabalho />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revisao-diagnostico"
        element={
          <ProtectedRoute>
            <TecnicoRevisaoDiagnostico />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cadastroAdmin"
        element={
          <ProtectedRoute>
            <CadastroAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/listUsers"
        element={
          <ProtectedRoute>
            <ListUsers />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}