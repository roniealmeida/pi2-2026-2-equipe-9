import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/images/Logo-AnalisaAI.png";
import useAuthStore from "../../stores/authStore";

export default function EsqSenha() {
  const navigate = useNavigate();

  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregandoLocal, setCarregandoLocal] = useState(false);

  const { loading: storeLoading } = useAuthStore();

  const validarTelefone = (tel) => {
    const apenasNumeros = tel.replace(/\D/g, "");
    return apenasNumeros.length >= 10 && apenasNumeros.length <= 11;
  };

  const enviarRecuperacao = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!telefone.trim()) {
      setErro("Informe o telefone cadastrado.");
      return;
    }

    if (!validarTelefone(telefone)) {
      setErro("O formato do telefone é inválido. Tente novamente.");
      return;
    }

    setCarregandoLocal(true);

    try {
      // Substitua pela chamada real da sua API/store quando estiver pronta
      // await forgotPassword(telefone);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setCarregandoLocal(false);
      setSucesso("Instruções de recuperação enviadas para o seu telefone.");
    } catch (err) {
      console.error("Erro ao recuperar senha:", err);
      setCarregandoLocal(false);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Não foi possível solicitar a recuperação. Tente novamente.";
      setErro(msg);
    }
  };

  function voltarLogin() {
    navigate("/");
  }

  const isProcessing = carregandoLocal || storeLoading;

  if (isProcessing) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#032b1d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          zIndex: 99999,
        }}
      >
        <img
          src={logo}
          alt="Logo AnalisaAI"
          style={{ height: "48px", marginBottom: "16px" }}
        />
        <p style={{ fontSize: "18px", fontFamily: "Montserrat, sans-serif" }}>
          Aguarde. Carregando...
        </p>
      </div>
    );
  }

  return (
    <div id="login-container">
      <div id="logo">
        <img src={logo} alt="Logo AnalisaAI" />
      </div>

      <div className="textos">
        <h2>Recuperação de Senha</h2>
      </div>

      {erro && (
        <div className="login-erro-banner">
          <span className="login-erro-icon">!</span>
          <p>{erro}</p>
        </div>
      )}

      {sucesso && (
        <div
          className="login-erro-banner"
          style={{ backgroundColor: "#04724b", border: "1px solid #6ee7b7" }}
        >
          <span className="login-erro-icon" style={{ color: "#04724b" }}>
            ✓
          </span>
          <p>{sucesso}</p>
        </div>
      )}

      <form onSubmit={enviarRecuperacao}>
        <div id="inputs">
          <div id="telefone">
            <label htmlFor="inputTelefoneRecuperacao">Telefone com DDD</label>
            <input
              classname="campo"
              type="tel"
              placeholder="Ex.: (XX) XXXXX-XXXX"
              value={telefone}
              onChange={(e) => {
                setTelefone(e.target.value);
                if (erro) setErro("");
                if (sucesso) setSucesso("");
              }}
            />
          </div>
        </div>

        <div id="buttons">
          <button type="submit" id="entrar">
            Recuperar Senha
          </button>

          <button type="button" id="cadastrar" onClick={voltarLogin}>
            Voltar para o Login
          </button>
        </div>
      </form>
    </div>
  );
}