import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import "./Cadastrar.css";

export default function CadastroTecnico() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [registroProfissional, setRegistroProfissional] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const finalizar = async (e) => {
    e.preventDefault();

    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setErro("");

    try {
      await register({
        name: nome,
        phone: telefone,
        password: senha,
        confirm_password: confirmarSenha,
        professional_register: registroProfissional,
        specialty: especialidade,
        role: "tecnico"
      });
      alert("Cadastro feito com sucesso!");
      navigate("/");
    } catch (err) {
      alert("Erro no cadastro");
    }
  };

  return (
    <div className="cadastro-container">
      <h3>Cadastro de Técnico</h3>
      <button className="voltar" onClick={() => navigate("/OpcoesCadastro")}>
        Voltar
      </button>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <form onSubmit={finalizar}>
        <h4>Informações Pessoais</h4>

        <div className="campo">
          <label>Nome</label>
          <input
            type="text"
            placeholder="Digite o seu nome"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (erro) setErro("");
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
          <label>Registro Profissional (CREA / CRMV)</label>
          <input
            type="text"
            placeholder="Digite o número do seu registro"
            value={registroProfissional}
            onChange={(e) => setRegistroProfissional(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Especialidade</label>
          <input
            type="text"
            placeholder="Ex: Agronomia, Zootecnia, Veterinária"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
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
              if (erro) setErro("");
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
              if (erro) setErro("");
            }}
          />
        </div>

        <div className="campo-botao">
          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar-se"}
          </button>
        </div>
      </form>
    </div>
  );
}