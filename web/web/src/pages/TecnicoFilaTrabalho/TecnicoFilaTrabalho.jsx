import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../MenuLateral/MenuLateral";
import Loading from "../../components/Loading";
import useAnalysisStore from "../../stores/analysisStore";
import logo from "../../assets/images/Logo-AnalisaAI.png";
import iconMenu from "../../assets/images/icon-menu.png";
import iconPerson from "../../assets/images/icon-person.png";
import "./TecnicoFilaTrabalho.css";

export default function TecnicoFilaTrabalho() {
  const navigate = useNavigate();
  const { fetchPendingAnalyses, pendingAnalyses, loading, error } = useAnalysisStore();

  const [menuAberto, setMenuAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  useEffect(() => {
    if (typeof fetchPendingAnalyses === "function") {
      fetchPendingAnalyses();
    }
  }, [fetchPendingAnalyses]);

  const dadosExibicao = (pendingAnalyses && pendingAnalyses.length > 0)
    ? pendingAnalyses
    : [
        {
          id: 101,
          produtorNome: "João da Silva",
          fazendaNome: "Fazenda Santa Maria",
          dataEnvio: "01/11/2026",
          especieIa: "Solanum mauritianum (Fumo-brabo)",
          confiancaIa: 88.5,
          status: "Pendente",
          imagemUrl: "https://via.placeholder.com/150",
        },
        {
          id: 102,
          produtorNome: "Maria Oliveira",
          fazendaNome: "Sítio Boa Vista",
          dataEnvio: "01/11/2026",
          especieIa: "Ricinus communis (Mamona)",
          confiancaIa: 94.2,
          status: "Pendente",
          imagemUrl: "https://via.placeholder.com/150",
        },
        {
          id: 103,
          produtorNome: "Carlos Eduardo",
          fazendaNome: "Estância Verde",
          dataEnvio: "31/10/2026",
          especieIa: "Pteridium aquilinum (Samambaia-do-campo)",
          confiancaIa: 79.0,
          status: "Revisado",
          imagemUrl: "https://via.placeholder.com/150",
        },
      ];

  const dadosFiltrados = dadosExibicao.filter((item) => {
    const textoMatch =
      (item.produtorNome || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
      (item.fazendaNome || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
      (item.especieIa || "").toLowerCase().includes(termoBusca.toLowerCase());

    const statusMatch =
      filtroStatus === "TODOS" ||
      (filtroStatus === "PENDENTES" && item.status === "Pendente") ||
      (filtroStatus === "REVISADOS" && item.status !== "Pendente");

    return textoMatch && statusMatch;
  });

  const totalPendentes = dadosExibicao.filter((i) => i.status === "Pendente").length;
  const totalConcluidasHoje = dadosExibicao.filter((i) => i.status !== "Pendente").length;

  if (loading) {
    return <Loading mensagem="A carregar fila de trabalho técnica..." />;
  }

  return (
    <div className="tecnico-fila-page">
      {/* Cabeçalho Ajustado */}
      <header className="tecnico-cabecalho">
        <img
          className="icon-menu-btn"
          src={iconMenu}
          alt="Menu"
          onClick={() => setMenuAberto(true)}
        />
        <img
          className="logo-btn"
          src={logo}
          alt="AnalisaAI"
          onClick={() => navigate("/home")}
        />
        <img
          className="icon-person-btn"
          src={iconPerson}
          alt="Perfil"
          onClick={() => navigate("/editar-perfil")}
        />
      </header>

      <MenuLateral menuAberto={menuAberto} setMenuAberto={setMenuAberto} />

      <main className="fila-container">
        <div className="fila-header-titulo">
          <h2>Painel do Técnico Agrícola</h2>
          <p>Validação de diagnósticos e emissão de pareceres especializados</p>
        </div>

        {error && (
          <div className="home-erro-banner-pilula">
            <span className="home-erro-icon">!</span>
            <p>Conexão com a API indisponível no momento. Exibindo dados de demonstração.</p>
          </div>
        )}

        {/* Cards de Métricas */}
        <div className="metricas-grid">
          <div className="card-analisa card-metrica">
            <div className="card-metrica-info">
              <span className="card-metrica-label">Pendentes na Fila</span>
              <span className="card-metrica-valor">{totalPendentes}</span>
            </div>
          </div>

          <div className="card-analisa card-metrica">
            <div className="card-metrica-info">
              <span className="card-metrica-label">Precisão Acumulada IA</span>
              <span className="card-metrica-valor">92.4%</span>
            </div>
          </div>

          <div className="card-analisa card-metrica">
            <div className="card-metrica-info">
              <span className="card-metrica-label">Concluídas Hoje</span>
              <span className="card-metrica-valor">{totalConcluidasHoje}</span>
            </div>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="card-analisa fila-filtros-bar">
          <input
            type="text"
            className="input-busca-fila"
            placeholder="Buscar por produtor, fazenda ou espécie..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />

          <div className="botoes-filtro-status">
            <button
              type="button"
              className={`btn-filtro ${filtroStatus === "TODOS" ? "ativo" : ""}`}
              onClick={() => setFiltroStatus("TODOS")}
            >
              Todos
            </button>
            <button
              type="button"
              className={`btn-filtro ${filtroStatus === "PENDENTES" ? "ativo" : ""}`}
              onClick={() => setFiltroStatus("PENDENTES")}
            >
              Pendentes
            </button>
            <button
              type="button"
              className={`btn-filtro ${filtroStatus === "REVISADOS" ? "ativo" : ""}`}
              onClick={() => setFiltroStatus("REVISADOS")}
            >
              Revisados
            </button>
          </div>
        </div>

        {/* Tabela da Fila */}
        <div className="card-analisa tabela-wrapper">
          <table className="tabela-fila">
            <thead>
              <tr>
                <th>Data</th>
                <th>Produtor</th>
                <th>Fazenda</th>
                <th>Diagnóstico IA</th>
                <th>Confiança</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>
                    Nenhuma análise encontrada.
                  </td>
                </tr>
              ) : (
                dadosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td>{item.dataEnvio}</td>
                    <td style={{ fontWeight: 600 }}>{item.produtorNome}</td>
                    <td>{item.fazendaNome}</td>
                    <td>{item.especieIa}</td>
                    <td>
                      <span className="badge-confianca">{item.confiancaIa}%</span>
                    </td>
                    <td>
                      <span className={`status-pill ${item.status === "Pendente" ? "status-pendente" : "status-revisado"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className="btn-acao-revisar"
                        onClick={() => navigate("/revisao-diagnostico", { state: item })}
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}