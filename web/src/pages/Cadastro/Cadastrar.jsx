import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Cadastrar.css";

function BarraProgresso({ valor }) {
  return (
    <div style={{ width: "100%", backgroundColor: "#e0e0e0", borderRadius: "8px", height: "10px", marginBottom: "20px" }}>
      <div style={{ width: `${valor}%`, backgroundColor: "#4caf50", height: "100%", borderRadius: "8px", transition: "width 0.3s" }}></div>
    </div>
  );
}

export default function Cadastrar() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  function avancar() {
    // 2. Validação do tamanho da senha
    if (senha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    setErro("");

    navigate("/propriedade", {
      state: {
        nome,
        telefone,
        senha,
        confirmarSenha
      }
    });
  }

  return (
    <div className="cadastro-container">

      <BarraProgresso valor={50} />

      <h3>Faça o seu cadastro</h3>

      <button className="voltar" onClick={() => navigate("/")}>Voltar</button>

      {/* 3. Exibição da mensagem de erro na tela */}
      {erro && (
        <p style={{ color: "#d32f2f", backgroundColor: "#ffebee", padding: "10px", borderRadius: "4px", fontSize: "14px" }}>
          {erro}
        </p>
      )}

      <div className="campo">
        <label>Nome</label>
        <input
          type="text"
          placeholder="Digite o seu nome"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            if (erro) setErro(""); // Limpa o erro ao digitar
          }}
        />
      </div>

      <div className="campo">
        <label>Telefone</label>
        <input
          type="tel"
          placeholder="Digite o seu número"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </div>

      <div className="campo">
        <label>Senha</label>
        <input
          type="password"
          placeholder="Digite a sua senha"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            if (erro) setErro(""); // Limpa o erro ao digitar
          }}
        />
      </div>

      <div className="campo">
        <label>Confirmar Senha</label>
        <input
          type="password"
          placeholder="Repita a senha"
          value={confirmarSenha}
          onChange={(e) => {
            setConfirmarSenha(e.target.value);
            if (erro) setErro(""); // Limpa o erro ao digitar
          }}
        />
      </div>

      <div className="campo-botao">
        <button onClick={avancar}>
          Continuar
        </button>
      </div>

    </div>
  );
}