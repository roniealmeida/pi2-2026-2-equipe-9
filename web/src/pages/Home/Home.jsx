import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "./HeaderPadrao.css";

import MenuLateral from "../MenuLateral/MenuLateral";
import Loading from "../../components/Loading";

import logo from "../../assets/images/Logo-AnalisaAI.png";
import iconSelecionar from "../../assets/images/icon-selecionar.png";

import { toBase64 } from "../../utils/converter";
import useAnalysisStore from "../../stores/analysisStore";

export default function Home() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [erroEnvio, setErroEnvio] = useState(null);
  const [tipoErro, setTipoErro] = useState("arquivo"); // "arquivo" | "analise"

  const { createAnalysis, searchRequestId } = useAnalysisStore();

  const navigate = useNavigate();

  const extensoesPermitidas = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/webp",
    "image/raw",
  ];

  const aoSelecionarFoto = async (event) => {
    const arquivo = event.target.files?.[0];

    if (arquivo) {
      const tipoValido =
        extensoesPermitidas.includes(arquivo.type) ||
        /\.(jpg|jpeg|png|heic|webp|raw)$/i.test(arquivo.name);

      if (!tipoValido) {
        setTipoErro("arquivo");
        setErroEnvio("O arquivo escolhido não é compatível.");
        setImagemPreview(null);
        setImageBase64("");
        event.target.value = "";
        return;
      }

      if (imagemPreview) {
        URL.revokeObjectURL(imagemPreview);
      }
      setErroEnvio(null);
      const urlTemporaria = URL.createObjectURL(arquivo);

      setImagemPreview(urlTemporaria);
      try {
        const base64Converted = await toBase64(arquivo);
        setImageBase64(base64Converted);
      } catch {
        setTipoErro("arquivo");
        setErroEnvio("O arquivo escolhido não é compatível.");
        setImagemPreview(null);
        setImageBase64("");
      }
    }
  };

  const escolherOutraFoto = () => {
    if (imagemPreview) {
      URL.revokeObjectURL(imagemPreview);
    }
    setImagemPreview(null);
    setImageBase64("");
    setErroEnvio(null);
  };

  const extrairMensagemBackend = (err) => {
    const data = err?.response?.data;
    if (!data) return "";
    if (typeof data === "string") return data;

    const candidato =
      data.message ||
      data.detail ||
      data.error ||
      data.erro ||
      data.image ||
      data.non_field_errors;

    if (Array.isArray(candidato)) {
      return candidato.join(" ");
    }
    if (typeof candidato === "object" && candidato !== null) {
      return Object.values(candidato).flat().join(" ");
    }
    return String(candidato || "");
  };

  const interpretarErroAnalise = (err) => {
    const msgBackend = extrairMensagemBackend(err);
    const texto = msgBackend.toLowerCase();

    // Ignora mensagens técnicas do Axios/HTTP (ex: "Request failed with status code 400")
    const ehMensagemTecnica =
      !msgBackend ||
      texto.includes("request failed") ||
      texto.includes("status code") ||
      texto.includes("network error") ||
      texto.includes("timeout") ||
      texto.includes("<!doctype html");

    if (
      texto.includes("not a plant") ||
      texto.includes("no plant") ||
      texto.includes("não é uma planta") ||
      texto.includes("nao e uma planta") ||
      texto.includes("não corresponde a uma planta") ||
      texto.includes("invalid image content") ||
      texto.includes("nenhuma planta")
    ) {
      return "A imagem enviada não corresponde a uma planta. Envie a foto de uma folha, caule ou planta inteira.";
    }

    if (
      texto.includes("not identified") ||
      texto.includes("unknown") ||
      texto.includes("low confidence") ||
      texto.includes("não foi possível identificar") ||
      texto.includes("nao foi possivel identificar") ||
      texto.includes("unrecognized") ||
      texto.includes("não encontrada") ||
      texto.includes("nao encontrada")
    ) {
      return "Não foi possível identificar a planta na imagem. Tente tirar uma foto mais próxima e com boa iluminação.";
    }

    if (!ehMensagemTecnica && msgBackend.length <= 160) {
      return msgBackend;
    }

    return "A imagem enviada não corresponde a uma planta ou não pôde ser identificada. Tente novamente com outra foto.";
  };

  const confirmarEnvio = async (e) => {
    e.preventDefault();

    if (!imageBase64) {
      setTipoErro("arquivo");
      setErroEnvio("Por favor, selecione uma imagem válida.");
      return;
    }

    try {
      setCarregando(true);
      setErroEnvio(null);

      const result = await createAnalysis(imageBase64);

      const statusRetorno = String(
        result?.status || result?.classification || result?.message || ""
      ).toLowerCase();

      if (
        result?.is_plant === false ||
        statusRetorno.includes("not_a_plant") ||
        statusRetorno.includes("não é uma planta")
      ) {
        setCarregando(false);
        setTipoErro("analise");
        setErroEnvio(
          "A imagem enviada não corresponde a uma planta. Por favor, selecione a foto de uma planta."
        );
        return;
      }

      const activeSearchId =
        result?.search_request_id ||
        result?.id ||
        useAnalysisStore.getState().searchRequestId ||
        searchRequestId;

      setCarregando(false);

      if (activeSearchId) {
        navigate(`/retorno/${activeSearchId}`, {
          state: {
            imagemUrl: imagemPreview,
          },
        });
      } else {
        setTipoErro("analise");
        setErroEnvio(
          "Não foi possível identificar a planta na imagem enviada. Tente novamente."
        );
      }
    } catch (err) {
      console.error("ERRO REAL AO ANALISAR:", err);
      setCarregando(false);
      setTipoErro("analise");
      setErroEnvio(interpretarErroAnalise(err));
    }
  };

  if (carregando) {
    return <Loading mensagem="Analisando a sua imagem com IA..." />;
  }

  return (
    <div
      className={
        imagemPreview
          ? "home-page modo-confirmacao"
          : "home-page"
      }
    >
      {/* ==================== CABEÇALHO PADRÃO ==================== */}
      <header className="cabecalho-padrao">
        <div className="cabecalho-padrao-esquerda">
          <button
            type="button"
            className="botao-menu-padrao"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className="logo-padrao"
            onClick={() => navigate("/home")}
          >
            <img src={logo} alt="AnalisaAI" />
          </div>
        </div>
      </header>

      {/* ==================== MENU LATERAL ==================== */}
      <MenuLateral
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />

      {/* ==================== CONTEÚDO ==================== */}
      <main>
        <div id="corpo">
          {erroEnvio ? (
            <div className="container-erro-incompativel">
              <div className="home-erro-banner-pilula">
                <span className="home-erro-icon">!</span>
                <p>{erroEnvio}</p>
              </div>

              {tipoErro === "arquivo" ? (
                <>
                  <p className="subtexto-erro-incompativel">
                    Seu arquivo não possui um formato compatível ou pode estar corrompido.
                    <br />
                    Tente novamente.
                  </p>

                  <div className="box-icone-arquivo-erro">
                    <div className="icone-documento-invalido">📄</div>
                  </div>

                  <p className="formatos-aceitos-texto">
                    Formatos aceitos: .jpg, .png, .heic, .webp e .raw
                  </p>
                </>
              ) : (
                <p className="subtexto-erro-incompativel">
                  Certifique-se de que a foto mostra claramente uma planta, com boa iluminação e foco, sem outros objetos cobrindo a folha.
                </p>
              )}

              <div className="botoes-erro-incompativel">
                <button
                  type="button"
                  className="btn-voltar-home"
                  onClick={() => {
                    if (imagemPreview) {
                      URL.revokeObjectURL(imagemPreview);
                    }
                    setErroEnvio(null);
                    setImagemPreview(null);
                    setImageBase64("");
                  }}
                >
                  Voltar
                </button>

                <label
                  htmlFor="gerenciadorArquivosErro"
                  className="btn-escolher-novamente"
                  style={{ cursor: "pointer" }}
                >
                  Escolher novamente
                </label>
                <input
                  type="file"
                  id="gerenciadorArquivosErro"
                  accept=".jpg, .jpeg, .png, .heic, .webp, .raw"
                  style={{ display: "none" }}
                  onChange={aoSelecionarFoto}
                />
              </div>
            </div>
          ) : !imagemPreview ? (
            <div id="container-selecao">
              <h2>
                Envie uma foto agora mesmo e analise a sua planta
              </h2>

              <div id="selecionar">
                <img
                  id="photo-selection"
                  src={iconSelecionar}
                  alt="Selecionar"
                />

                <input
                  type="file"
                  id="gerenciadorArquivos"
                  accept=".jpg, .jpeg, .png, .heic, .webp, .raw"
                  style={{ display: "none" }}
                  onChange={aoSelecionarFoto}
                />

                <label
                  htmlFor="gerenciadorArquivos"
                  id="arquivo"
                  style={{ cursor: "pointer" }}
                >
                  Selecionar arquivo
                </label>
              </div>

              <div id="recomendacao">
                <div className="bloco">
                  <li>Envie uma foto com iluminação clara</li>
                  <li>Evite fotos tremidas ou fora de foco</li>
                  <li>Garante que a foto não esteja borrada</li>
                </div>

                <div className="bloco">
                  <li>Aproxime a câmera da folha ou da área afetada</li>
                  <li>Mostre apenas uma planta por foto</li>
                  <li>Evite outras plantas ou objetos misturados no fundo</li>
                </div>
              </div>
            </div>
          ) : (
            <div id="container-confirmacao">
              <h2>Confirme o envio da foto</h2>

              <div className="preview-box">
                <img
                  id="preview-foto"
                  src={imagemPreview}
                  alt="Foto selecionada"
                />
              </div>

              <div className="botoes-confirmacao">
                <button
                  type="button"
                  id="btn-confirmar"
                  onClick={confirmarEnvio}
                  disabled={carregando}
                >
                  Enviar
                </button>

                <button
                  type="button"
                  id="btn-alterar"
                  onClick={escolherOutraFoto}
                  disabled={carregando}
                >
                  Escolher outra
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}