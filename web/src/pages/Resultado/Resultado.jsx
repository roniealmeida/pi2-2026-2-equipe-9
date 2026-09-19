import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./Resultado.css";

import MenuLateral from "../MenuLateral/MenuLateral";
import useAnalysisStore from "../../stores/analysisStore";
import useAuthStore from "../../stores/authStore";
import Loading from "../../components/Loading";

import logoEscura from "../../assets/images/Logo-AnalisaAI-Escura.png";
import logoSimbolo from "../../assets/images/Logo-AnalisaAI-Simbolo.png";

export default function Resultado() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);

  const {
    analysis,
    loading,
    error,
    fetchAnalysisById,
  } = useAnalysisStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (id && user?.id) {
      fetchAnalysisById(id, user.id);
    }
  }, [id, user?.id, fetchAnalysisById]);

  /* ==================== CARREGAMENTO ==================== */

  if (loading) {
    return (
      <div className="resultado-page resultado-status">
        <Loading />
      </div>
    );
  }

  /* ==================== ERRO ==================== */

  if (error) {
    return (
      <div className="resultado-page resultado-status">
        <p>Erro ao carregar análise: {error}</p>

        <button
          type="button"
          onClick={() => navigate("/historico")}
        >
          Voltar ao Histórico
        </button>
      </div>
    );
  }

  /* ==================== SEM DADOS ==================== */

  if (!analysis || analysis.length === 0) {
    return (
      <div className="resultado-page resultado-status">
        <p>Carregando as informações da sua planta...</p>

        <button
          type="button"
          onClick={() => navigate("/historico")}
        >
          Voltar ao Histórico
        </button>
      </div>
    );
  }

  const planta = analysis[0];

  return (
    <div className="resultado-page">

      {/* ==================== CABEÇALHO ==================== */}

      <header className="resultado-header">
        <div className="resultado-cabecalho">

          <button
            type="button"
            className="resultado-menu"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className="resultado-logo"
            onClick={() => navigate("/home")}
          >
            <img
              className="resultado-logo-simbolo"
              src={logoSimbolo}
              alt=""
            />

            <img
              className="resultado-logo-texto"
              src={logoEscura}
              alt="AnalisaAI"
            />
          </div>

        </div>
      </header>

      {/* ==================== CONTEÚDO ==================== */}

      <main className="resultado-conteudo">

        <button
          type="button"
          className="resultado-voltar"
          onClick={() => navigate("/historico")}
        >
          ← Voltar ao Histórico
        </button>

        <h1>Detalhes da Planta</h1>

        <div className="resultado-informacoes">

          {/* FOTO + NOME CIENTÍFICO */}

          <div className="resultado-planta">

            <div className="resultado-foto">
              <img
                src={planta.image}
                alt={planta.common_name || "Planta analisada"}
              />
            </div>

            {planta.scientific_name && (
              <div className="resultado-cientifico">
                <span>Nome científico</span>
                <strong>{planta.scientific_name}</strong>
              </div>
            )}

          </div>

          {/* COLUNA 1 */}

          <div className="resultado-coluna">

            <div className="resultado-grupo">
              <span>Nome Popular</span>
              <strong>{planta.common_name}</strong>
            </div>

            <div className="resultado-grupo">
              <span>Descrição</span>
              <strong>{planta.description}</strong>
            </div>

            <div className="resultado-grupo">
              <span>
                Espécies suscetíveis à intoxicação
              </span>

              <strong>
                {planta.susceptible_animal_species?.join(", ")}
              </strong>
            </div>

          </div>

          {/* COLUNA 2 */}

          <div className="resultado-coluna">

            <div className="resultado-grupo">
              <span>Riscos para os seres humanos</span>
              <strong>{planta.human_risks}</strong>
            </div>

            <div className="resultado-grupo">
              <span>Sintomas comuns</span>

              <strong>
                {planta.common_symptoms?.join(", ")}
              </strong>
            </div>

            <div className="resultado-grupo">
              <span>Ações recomendadas</span>

              <strong>
                {planta.recommended_actions?.join(", ")}
              </strong>
            </div>

          </div>

        </div>

      </main>

      {/* ==================== MENU LATERAL ==================== */}

      <MenuLateral
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />

    </div>
  );
}