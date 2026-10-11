import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import useAuthStore from "../../stores/authStore";
import "../Admin/Admin.css";

const userStatusLabels = {
  0: "Inativo",
  1: "Ativo",
  2: "Bloqueado",
};

const analysisStatusLabels = {
  0: "Pendente",
  1: "Processando",
  3: "Concluída",
  4: "Falha",
};

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function cadastroAdmin() {
    navigate("/cadastroAdmin");
  }

  function listUsers() {
    navigate("/listUsers");
  }

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function fetchAdminData() {
      setLoading(true);
      setError("");

      try {
        const [usersResponse, analysesResponse] = await Promise.all([
          api.get("users/", {
            params: { requested_by: user.id },
          }),
          api.get("analysis/all-analysis/", {
            params: { requested_by: user.id },
          }),
        ]);

        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
        setAnalyses(Array.isArray(analysesResponse.data) ? analysesResponse.data : []);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os dados do painel.");
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, [user?.id]);

  const titleRef = useRef(null);

  useEffect(() => {
    function setTitleHeight() {
      const el = titleRef.current;
      if (el) {
        const h = el.offsetHeight;
        document.documentElement.style.setProperty("--admin-title-height", `${h}px`);
      }
    }

    // set on mount and when window resizes
    setTitleHeight();
    window.addEventListener("resize", setTitleHeight);
    return () => window.removeEventListener("resize", setTitleHeight);
  }, []);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Painel de Controle - Administrador</h2>

        <div className="Functions-Admin">
          <button onClick={cadastroAdmin}>Cadastrar novos administradores</button>
          <button onClick={listUsers}>Visualizar usuários</button>
          <button id="btn-logout" onClick={() => navigate("/")}>Sair</button>
        </div>
      </header>

      <main className="admin-main">
        <p>Confira os principais dados do AnalisaAI</p>

        {error && <p className="error-message">{error}</p>}

        <div className="admin-grid">
          <div className="admin-card">
            <div className="title" ref={titleRef}>
                <h3 className="analise">Total de Analises</h3>
                <p className="card-number">{analyses.length}</p>
              </div>
            <div className="listagem">
              <div className="element">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Planta Identificada</th>
                      <th>Status</th>
                      <th>Hora de Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4">Carregando...</td>
                      </tr>
                    ) : analyses.length > 0 ? (
                      analyses.map((item) => (
                        <tr key={item.search_request_id}>
                          <td colSpan="1">#{item.search_request_id}</td>
                          <td colSpan="1">{item.result || "Sem resultado"}</td>
                          <td colSpan="1">{analysisStatusLabels[item.status] || "Desconhecido"}</td>
                          <td colSpan="1">{formatDate(item.request_date)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">Nenhuma análise encontrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="title">
              <h3 className="analise">Total de Usuários</h3>
              <p className="card-number">{users.length}</p>
            </div>
            <div className="listagem">
              <div className="element">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3">Carregando...</td>
                      </tr>
                    ) : users.length > 0 ? (
                      users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td>#{userItem.id}</td>
                          <td>{userItem.name}</td>
                          <td>{userStatusLabels[userItem.status] || "Desconhecido"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">Nenhum usuário encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
