import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import EditarPerfil from "../pages/EditarPerfil/EditarPerfil";
import Historico from "../pages/Historico/Historico"; 
import Retorno from "../pages/Retorno/Retorno"; 
import Resultado from "../pages/Resultado/Resultado"; 
import Cadastrar from "../pages/Cadastro/Cadastrar";
import Propriedade from "../pages/Cadastro/Propriedade";
import Admin from "../pages/Admin/Admin";
import CadastroAdmin from "../pages/Admin/CadastroAdmin/CadastroAdmin"
import ListUsers from "../pages/Admin/ListUsers/ListUsers"
import OpcoesCad from "../pages/Cadastro/OpcoesCad";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/home" element={<Home />} />
      <Route path="/opcoesCadastro" element={<OpcoesCad />} />
      <Route path="/editar-perfil" element={<EditarPerfil />} />
      <Route path="/historico" element={<Historico />} />
      
      <Route path="/cadastro" element={<Cadastrar />} />
      <Route path="/propriedade" element={<Propriedade />} />
      
      <Route path="/retorno/:id" element={<Retorno />} />
      
      <Route path="/resultado/:id" element={<Resultado />} />

      <Route path="/admin" element={<Admin />} />
      <Route path="/cadastroAdmin" element={<CadastroAdmin />} />
      <Route path="/listUsers" element={<ListUsers />} />
    </Routes>
  );
}