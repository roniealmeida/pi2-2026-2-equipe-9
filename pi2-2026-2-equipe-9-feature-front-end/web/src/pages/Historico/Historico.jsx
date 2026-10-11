import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MenuLateral from "../MenuLateral/MenuLateral";
import CardPlanta from "../../components/CardPlanta";
import Loading from "../../components/Loading";

import useAnalysisStore from "../../stores/analysisStore";
import useAuthStore from "../../stores/authStore";

import logoEscura from "../../assets/images/Logo-AnalisaAI-Escura.png";
import logoSimbolo from "../../assets/images/Logo-AnalisaAI-Simbolo.png";

import "./Historico.css";

export default function Historico() {
  const [menuAberto, setMenuAberto] = useState(false);

  const navigate = useNavigate();

  const {
    analysisHistory,
    loading,
    error,
    fetchAnalysisHistory,
  } = useAnalysisStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchAnalysisHistory(user.id);
    }
  }, [user?.id]);

  return (
    <div className="historico-page">

      {/* CABEÇALHO */}

      <header className="historico-header">
        <div className="historico-cabecalho">

          <button
            type="button"
            className="historico-menu"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className="historico-logo"
            onClick={() => navigate("/home")}
          >
            <img
              className="historico-logo-simbolo"
              src={logoSimbolo}
              alt=""
            />

            <img
              className="historico-logo-texto"
              src={logoEscura}
              alt="AnalisaAI"
            />
          </div>

        </div>
      </header>

      {/* CONTEÚDO */}

      <main className="historico-conteudo">

        <h1>Histórico</h1>

        {/* CARREGAMENTO */}

        {loading && (
          <div className="historico-status">
            <Loading />
          </div>
        )}

        {/* ERRO */}

        {!loading && error && (
          <div className="historico-status historico-erro">
            <p>Erro ao carregar histórico: {error}</p>
          </div>
        )}

        {/* HISTÓRICO VAZIO */}

        {!loading && !error && analysisHistory.length === 0 && (
          <div className="historico-status">
            <p>Nenhuma análise realizada ainda</p>
          </div>
        )}

        {/* LISTAGEM */}

        {!loading && !error && analysisHistory.length > 0 && (
          <div className="historico-listagem">

            {analysisHistory.map((planta) => (
              <CardPlanta
                key={planta.search_request_id}
                imagem={planta.image}
                nome={planta.analysis_result?.common_name}
                descricao={planta.analysis_result?.Description}
                rotaLink={`/resultado/${planta.search_request_id}`}
              />
            ))}

          </div>
        )}

      </main>

      <MenuLateral
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />

    </div>
  );
}