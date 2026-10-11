import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MenuLateral from "../MenuLateral/MenuLateral";

import logoEscura from "../../assets/images/Logo-AnalisaAI-Escura.png";
import logoSimbolo from "../../assets/images/Logo-AnalisaAI-Simbolo.png";
import fotoTeste from "../../assets/images/fototeste.jpeg";

import "./Retorno.css";
import useAnalysisStore from "../../stores/analysisStore";

export default function Retorno() {
  const [menuAberto, setMenuAberto] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { analysis } = useAnalysisStore();

  const imagemEnviada = location.state?.imagemUrl || fotoTeste;

  if (!analysis || analysis.length === 0) {
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
            >
              <img
                className="retorno-logo-simbolo"
                src={logoSimbolo}
                alt=""
              />

              <img
                className="retorno-logo-texto"
                src={logoEscura}
                alt="AnalisaAI"
              />
            </div>
          </div>
        </header>

        <main className="retorno-erro">
          <h2>Erro ao analisar a sua foto</h2>

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

  const planta = analysis[0];

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
          >
            <img
              className="retorno-logo-simbolo"
              src={logoSimbolo}
              alt=""
            />

            <img
              className="retorno-logo-texto"
              src={logoEscura}
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
                alt={`Foto de ${planta.CommonName}`}
              />
            </div>

            <div className="retorno-nome-cientifico">
              <span>Nome científico</span>
              <strong>{planta.ScientificName}</strong>
            </div>
          </div>

          <div className="retorno-coluna">
            <div className="retorno-grupo">
              <span>Nome Popular</span>
              <strong>{planta.CommonName}</strong>
            </div>

            <div className="retorno-grupo">
              <span>
                Espécie animal suscetível
                <br />
                a intoxicação
              </span>

              <strong>
                {planta.SusceptibleAnimalSpecies?.join(", ")}
              </strong>
            </div>

            <div className="retorno-grupo">
              <span>Riscos para os seres humanos</span>
              <strong>{planta.HumanRisks}</strong>
            </div>
          </div>

          <div className="retorno-coluna retorno-coluna-direita">
            <div className="retorno-grupo">
              <span>Sintomas comuns</span>
              <strong>
                {planta.CommonSymptoms?.join(", ")}
              </strong>
            </div>

            <div className="retorno-grupo">
              <span>Ações recomendadas</span>
              <strong>
                {planta.RecommendedActions?.join(", ")}
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