import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/images/Logo-AnalisaAI.png";
import useAuthStore from "../../stores/authStore";
import Loading from "../../components/Loading.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [ver, setVer] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  const { login, loading: storeLoading } = useAuthStore();
  const [carregandoLocal, setCarregandoLocal] = useState(false);

  // Validação do formato de telefone (DDD + 8 ou 9 dígitos)
  const validarTelefone = (tel) => {
    const apenasNumeros = tel.replace(/\D/g, "");
    return apenasNumeros.length >= 10 && apenasNumeros.length <= 11;
  };

  const entrar = async (e) => {
    e.preventDefault();
    setErroLogin("");

    // 1. Validação de preenchimento obrigatório
    if (!telefone.trim() || !password.trim()) {
      setErroLogin("Preencha os campos obrigatórios.");
      return;
    }

    // 2. Validação do formato do telefone
    if (!validarTelefone(telefone)) {
      setErroLogin("O formato do telefone é inválido. Tente novamente.");
      return;
    }

    // Ativa a tela de carregamento localmente
    setCarregandoLocal(true);

    try {
      await login(telefone, password);

      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        if (currentUser.is_admin) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        setCarregandoLocal(false);
        setErroLogin("Telefone ou senha incorretos. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      setCarregandoLocal(false);

      if (err?.response?.status === 400 || err?.response?.status === 401) {
        setErroLogin("Telefone ou senha incorretos. Tente novamente.");
      } else {
        const storeErrorMsg = useAuthStore.getState().error;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          storeErrorMsg ||
          "Erro ao realizar login. Tente novamente mais tarde.";
        setErroLogin(msg);
      }
    }
  };

  function cadastrar() {
    navigate("/opcoesCadastro");
  }

  function esqSenha() {
    navigate("/esqSenha");
  }

  // Se qualquer um dos estados de loading estiver ativo, exibe a tela cheia do Figma
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
        <h2>Boas-vindas ao AnalisaAI. Realize seu acesso.</h2>
      </div>

      {/* BANNER EM FORMATO PÍLULA FIGMA */}
      {erroLogin && (
        <div className="login-erro-banner">
          <span className="login-erro-icon">!</span>
          <p>{erroLogin}</p>
        </div>
      )}

      <form onSubmit={entrar}>
        <div id="inputs">
          <div id="telefone">
            <label htmlFor="inputTelefone">Telefone com DDD</label>
            <input
              id="inputTelefone"
              type="tel"
              placeholder="Ex.: (XX) XXXXX-XXXX"
              value={telefone}
              onChange={(e) => {
                setTelefone(e.target.value);
                if (erroLogin) setErroLogin("");
              }}
            />
          </div>

          <div id="senha">
            <label htmlFor="inputSenha">Senha</label>
            <div className="caixa-input">
              <input
                id="inputSenha"
                type={ver ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (erroLogin) setErroLogin("");
                }}
              />
              <button
                type="button"
                onClick={() => setVer(!ver)}
                className="botao-olho"
              >
                {ver ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="recall-forget">
          <label>
            <input type="checkbox" />
            Lembre de mim
          </label>
          <button type="button" id="esqSenha" onClick={esqSenha}>
            Esqueci minha senha
          </button>
        </div>

        <div id="buttons">
          <button type="submit" id="entrar">
            Entrar
          </button>

          <button type="button" id="cadastrar" onClick={cadastrar}>
            Cadastrar-se
          </button>
        </div>
      </form>
    </div>
  );
}