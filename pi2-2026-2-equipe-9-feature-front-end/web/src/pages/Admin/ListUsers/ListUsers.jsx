import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Admin.css";
import "./ListUsers.css";
import BotaoMenu from "../../../components/MenuSusp";
import api from "../../../api/api";
import useAuthStore from "../../../stores/authStore";

export default function ListUsers() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAdmins() {
    if (!user?.id) {
      setAdmins([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const resp = await api.get("users/admins/list/", { params: { requested_by: user.id } });
      setAdmins(Array.isArray(resp.data) ? resp.data : []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar administradores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, [user?.id]);

  async function toggleStatus(targetUser) {
    if (!user?.id) return;

    const newStatus = targetUser.status === 1 ? 2 : 1;

    try {
      await api.patch("users/status/", {
        requested_by: user.id,
        user_id: targetUser.id,
        status: newStatus,
      });

      await fetchAdmins();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status do usuário");
    }
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Painel de Controle - Administrador</h2>

        <div className="Functions-Admin">
          <button className="voltar" onClick={() => navigate("/admin")}>Voltar</button>
          <button className="btn-logout" id="btn-logout" onClick={() => navigate("/")}>Sair</button>
        </div>
      </header>

      <main>
        <div className="admin-card-users admin-card">
          <div className="title">
            <h3 className="analise">Total de Administradores</h3>
            <p className="card-number">{admins.length}</p>
          </div>

          <div className="listagem">
            <div className="element">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5">Carregando...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="5">{error}</td></tr>
                  ) : admins.length === 0 ? (
                    <tr><td colSpan="5">Nenhum administrador encontrado.</td></tr>
                  ) : (
                    admins.map((a) => (
                      <tr key={a.id}>
                        <td>#{a.id}</td>
                        <td>{a.name}</td>
                        <td>{a.phone}</td>
                        <td>{a.status === 1 ? "Ativo" : a.status === 2 ? "Bloqueado" : "Desconhecido"}</td>
                        <td>
                          <BotaoMenu
                            currentStatus={a.status}
                            onToggleStatus={() => toggleStatus(a)}
                            label="Ações"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}