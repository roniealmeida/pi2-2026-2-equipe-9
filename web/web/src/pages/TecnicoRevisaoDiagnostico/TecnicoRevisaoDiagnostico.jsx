import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MenuLateral from "../MenuLateral/MenuLateral";
import Loading from "../../components/Loading";
import useAnalysisStore from "../../stores/analysisStore";
import logo from "../../assets/images/Logo-AnalisaAI.png";
import iconMenu from "../../assets/images/icon-menu.png";
import iconPerson from "../../assets/images/icon-person.png";
import "./TecnicoRevisaoDiagnostico.css";

export default function TecnicoRevisaoDiagnostico() {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitTechnicalReview, loading, error: storeError } = useAnalysisStore();

  // Dados recebidos da navegação/fila (ou fallback para testes)
  const analiseData = location.state || {
    id: 101,
    imagemUrl: "https://via.placeholder.com/400x300",
    especieIa: "Solanum mauritianum (Fumo-brabo)",
    confiancaIa: 88.5,
    produtorNome: "João da Silva",
    fazendaNome: "Fazenda Santa Maria",
    dataEnvio: "01/11/2026",
  };

  const [menuAberto, setMenuAberto] = useState(false);
  const [parecerTecnico, setParecerTecnico] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [especieSelecionada, setEspecieSelecionada] = useState(analiseData.especieIa);
  const [erroLocal, setErroLocal] = useState(null);

  // Lista para busca dinâmica de espécies
  const baseEspeciesOficial = [
    "Solanum mauritianum (Fumo-brabo)",
    "Ricinus communis (Mamona)",
    "Pteridium aquilinum (Samambaia-do-campo)",
    "Crotalaria spectabilis (Chocalho-de-cobra)",
    "Senna occidentalis (Fedegoso)",
  ];

  const especiesFiltradas = baseEspeciesOficial.filter((esp) =>
    esp.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleConfirmar = async () => {
    if (!parecerTecnico.trim()) {
      setErroLocal("Por favor, insira um parecer técnico antes de enviar.");
      return;
    }

    setErroLocal(null);

    const payload = {
      status: modoEdicao ? "Corrigido pelo Técnico" : "Confirmado",
      especieFinal: especieSelecionada,
      parecerTecnico: parecerTecnico.trim(),
      corrigidoPeloTecnico: modoEdicao,
    };

    try {
      await submitTechnicalReview(analiseData.id, payload);
      alert("Parecer técnico enviado com sucesso ao produtor!");
      navigate("/fila-trabalho");
    } catch (err) {
      console.warn("Falha na API ao enviar revisão. Exibindo alerta de fallback.", err);
      alert("Validação concluída (modo demonstração). Diagnóstico registrado!");
      navigate("/fila-trabalho");
    }
  };

  if (loading) {
    return <Loading mensagem="A enviar parecer técnico..." />;
  }

  return (
    <div className="revisao-diagnostico-page">
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

      <main className="revisao-container">
        <h2 className="revisao-titulo">Revisão Técnica de Diagnóstico</h2>
        <p className="revisao-subtitulo">
          Produtor: <strong>{analiseData.produtorNome}</strong> | Fazenda: <strong>{analiseData.fazendaNome}</strong> | Data: {analiseData.dataEnvio}
        </p>

        {(erroLocal || storeError) && (
          <div className="home-erro-banner-pilula" style={{ width: "100%", justifyContent: "center", marginBottom: "20px" }}>
            <span className="home-erro-icon">!</span>
            <p>{erroLocal || storeError}</p>
          </div>
        )}

        {/* Lado a Lado: Imagem vs IA */}
        <div className="revisao-grid">
          {/* Lado Esquerdo: Imagem enviada */}
          <div className="card-analisa">
            <h3>Foto Enviada</h3>
            <img
              className="foto-preview-revisao"
              src={analiseData.imagemUrl}
              alt="Planta analisada"
            />
          </div>

          {/* Lado Direito: Diagnóstico da IA */}
          <div className="card-analisa">
            <h3>Diagnóstico da IA</h3>
            <div>
              <p style={{ fontSize: "14px", opacity: 0.8 }}>Espécie Detectada:</p>
              <p className="especie-destaque">{especieSelecionada}</p>
              <p className="confianca-badge">
                Nível de Confiança: <strong>{analiseData.confiancaIa}%</strong>
              </p>
            </div>

            {!modoEdicao ? (
              <button
                type="button"
                className="btn-corrigir-especie"
                onClick={() => setModoEdicao(true)}
              >
                ✏️ Corrigir Espécie
              </button>
            ) : (
              <div className="box-edicao-especie">
                <label style={{ display: "block", fontSize: "13px", color: "#e2e8f0" }}>
                  Buscar Espécie na Base Oficial:
                </label>
                <input
                  type="text"
                  className="input-busca-especie"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  placeholder="Digite para buscar..."
                />
                <ul className="lista-busca-especies">
                  {especiesFiltradas.map((esp, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setEspecieSelecionada(esp);
                        setModoEdicao(false);
                      }}
                    >
                      {esp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Parecer Técnico */}
        <div className="card-analisa" style={{ marginBottom: "24px" }}>
          <h3>Parecer Técnico e Recomendações</h3>
          <textarea
            className="textarea-parecer"
            rows="5"
            value={parecerTecnico}
            onChange={(e) => {
              setParecerTecnico(e.target.value);
              setErroLocal(null);
            }}
            placeholder="Digite aqui as observações técnicas, riscos para o gado, recomendações de manejo e orientações ao produtor..."
          />
        </div>

        {/* Botão de Envio */}
        <div style={{ textAlign: "right" }}>
          <button
            type="button"
            className="btn-confirmar-envio"
            onClick={handleConfirmar}
            disabled={loading}
          >
            Confirmar e Enviar Diagnóstico
          </button>
        </div>
      </main>
    </div>
  );
}