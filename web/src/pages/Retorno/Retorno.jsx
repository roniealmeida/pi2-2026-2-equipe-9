import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import MenuLateral from "../MenuLateral/MenuLateral";
import Loading from "../../components/Loading";

import logoClara from "../../assets/images/Logo-AnalisaAI.png";
import fotoTeste from "../../assets/images/fototeste.jpeg";

import "./Retorno.css";
import useAnalysisStore from "../../stores/analysisStore";
import useAuthStore from "../../stores/authStore";

export default function Retorno() {
  const [menuAberto, setMenuAberto] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    analysis,
    loading,
    error,
    fetchAnalysisById,
  } = useAnalysisStore();

  const { user } = useAuthStore();

  // Recarrega os dados da análise se o estado estiver vazio (ex: F5)
  useEffect(() => {
    if ((!analysis || (Array.isArray(analysis) && analysis.length === 0)) && id && user?.id) {
      fetchAnalysisById(id, user.id);
    }
  }, [id, user?.id, analysis, fetchAnalysisById]);

  const imagemEnviada = location.state?.imagemUrl || fotoTeste;

  // Função utilitária para formatação de listas
  const formatList = (field) => {
    if (!field) return "Não informado";
    if (Array.isArray(field)) return field.length > 0 ? field.join(", ") : "Não informado";
    return field;
  };

  /* ==================== 1. ESTADO DE CARREGAMENTO ==================== */
  if (loading) {
    return (
      <div className="retorno-page retorno-status">
        <Loading />
        <p>A carregar o resultado da sua análise...</p>
      </div>
    );
  }

  /* ==================== 2. ESTADO DE ERRO ==================== */
  if (error) {
    return (
      <div className="retorno-page">
        <header className="retorno-header">
          <div className="retorno-cabecalho">
            <button
              type="button"
              className="retorno-menu"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div
              className="retorno-logo"
              onClick={() => navigate("/home")}
              style={{ cursor: "pointer" }}
            >
              <img
                className="retorno-logo-texto"
                src={logoClara}
                alt="AnalisaAI"
              />
            </div>
          </div>
        </header>

        <main className="retorno-erro">
          <h2>Erro ao carregar o resultado</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/home")}
          >
            Voltar para o início
          </button>
        </main>

        <MenuLateral
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
        />
      </div>
    );
  }

  /* ==================== 3. ESTADO VAZIO / SEM DADOS ==================== */
  if (!analysis || (Array.isArray(analysis) && analysis.length === 0)) {
    return (
      <div className="retorno-page">
        <header className="retorno-header">
          <div className="retorno-cabecalho">
            <button
              type="button"
              className="retorno-menu"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div
              className="retorno-logo"
              onClick={() => navigate("/home")}
              style={{ cursor: "pointer" }}
            >
              <img
                className="retorno-logo-texto"
                src={logoClara}
                alt="AnalisaAI"
              />
            </div>
          </div>
        </header>

        <main className="retorno-erro">
          <h2>Análise não encontrada</h2>
          <p>Não foi possível recuperar os dados desta análise.</p>

          <button
            type="button"
            onClick={() => navigate("/home")}
          >
            Voltar para o início
          </button>
        </main>

        <MenuLateral
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
        />
      </div>
    );
  }

  // Desestruturação segura considerando diferentes formatos de retorno
  const rawItem = Array.isArray(analysis) ? analysis[0] : analysis;
  const planta = rawItem?.analysis_result || rawItem || {};

  const commonName = planta.CommonName || planta.common_name || "Não informado";
  const scientificName = planta.ScientificName || planta.scientific_name;
  const humanRisks = planta.HumanRisks || planta.human_risks || "Não informado";
  const susceptibleSpecies = planta.SusceptibleAnimalSpecies || planta.susceptible_animal_species;
  const commonSymptoms = planta.CommonSymptoms || planta.common_symptoms;
  const recommendedActions = planta.RecommendedActions || planta.recommended_actions;

  /* ==================== 4. ESTADO DE SUCESSO ==================== */
  return (
    <div className="retorno-page">
      <header className="retorno-header">
        <div className="retorno-cabecalho">
          <button
            type="button"
            className="retorno-menu"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className="retorno-logo"
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer" }}
          >
            <img
              className="retorno-logo-texto"
              src={logoClara}
              alt="AnalisaAI"
            />
          </div>
        </div>
      </header>

      <main className="retorno-conteudo">
        <h1>Planta detectada</h1>

        <div className="retorno-informacoes">
          <div className="retorno-planta">
            <div className="retorno-imagem">
              <img
                src={imagemEnviada}
                alt={`Foto de ${commonName}`}
              />
            </div>

            {scientificName && (
              <div className="retorno-nome-cientifico">
                <span>Nome científico</span>
                <strong>{scientificName}</strong>
              </div>
            )}
          </div>

          <div className="retorno-coluna">
            <div className="retorno-grupo">
              <span>Nome Popular</span>
              <strong>{commonName}</strong>
            </div>

            <div className="retorno-grupo">
              <span>
                Espécie animal suscetível
                <br />
                a intoxicação
              </span>

              <strong>
                {formatList(susceptibleSpecies)}
              </strong>
            </div>

            <div className="retorno-grupo">
              <span>Riscos para os seres humanos</span>
              <strong>{humanRisks}</strong>
            </div>
          </div>

          <div className="retorno-coluna retorno-coluna-direita">
            <div className="retorno-grupo">
              <span>Sintomas comuns</span>
              <strong>
                {formatList(commonSymptoms)}
              </strong>
            </div>

            <div className="retorno-grupo">
              <span>Ações recomendadas</span>
              <strong>
                {formatList(recommendedActions)}
              </strong>
            </div>
          </div>
        </div>
      </main>

      <MenuLateral
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />
    </div>
  );
}