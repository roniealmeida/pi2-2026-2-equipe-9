import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/images/Logo-AnalisaAI.png";
import useAuthStore from "../../stores/authStore";
import Loading from "../../components/Loading";

export default function Login() {
  const navigate = useNavigate();
  const [ver, setVer] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, loading } = useAuthStore();
  const [carregando, setCarregando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      await login(telefone, password);
      
      if (useAuthStore.getState().user) {
        if (useAuthStore.getState().user.is_admin) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        setCarregando(false);
      }
    } catch (err) {
      setCarregando(false);
      alert("Erro no login");
    }
  };

  function cadastrar() {
    navigate("/opcoesCadastro");
  }

  function esqSenha(){
    navigate("/esqSenha");
  }
  if (carregando) {
    return <Loading />;
  }

  return (
    <>
      <div id="login-container">
        <div id="logo">
          <img src={logo} alt="Logo AnalisaAI" />
        </div>

        <div className="textos">
          <h2>Realize seu acesso</h2>
        </div>

        <div id="inputs">
          <div id="telefone">
            <label>Telefone</label>
            <input
              id="inputTelefone"
              type="tel"
              placeholder="Digite seu telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div id="senha">
            <label>Senha</label>
            <div className="caixa-input">
              <input
                id="inputSenha"
                type={ver ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <button id="esqSenha" onClick={esqSenha}>
            Esqueci minha senha
          </button>
        </div>

        <div id="buttons">
          <button id="entrar" onClick={entrar}>
            Entrar
          </button>
          <button id="cadastrar" onClick={cadastrar}>
            Cadastrar-se
          </button>
        </div>
      </div>
    </>
  );
}