import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import MenuLateral from "../../MenuLateral/MenuLateral";
import Loading from "../../../components/Loading";

import logoClara from "../../../assets/images/Logo-AnalisaAI.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import "./AlterarSenha.css";

export default function AlterarSenha() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mensagemFeedback, setMensagemFeedback] = useState({ tipo: "", texto: "" });

  // Estados dos campos de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  // Estados para mostrar/ocultar senha (ícone de olho)
  const [mostrarAtual, setMostrarAtual] = useState(false);
  const [mostrarNova, setMostrarNova] = useState(false);
  const [mostrarConfirma, setMostrarConfirma] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemFeedback({ tipo: "", texto: "" });

    // Validação de campos vazios (conforme protótipo do Figma)
    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      setMensagemFeedback({
        tipo: "erro",
        texto: "Preencha os campos obrigatórios.",
      });
      return;
    }

    // Validação se a nova senha confere
    if (novaSenha !== confirmaSenha) {
      setMensagemFeedback({
        tipo: "erro",
        texto: "Repita a senha corretamente.",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Ajuste para a rota real de alteração de senha do seu backend Django
      await api.post("users/change-password/", {
        old_password: senhaAtual,
        new_password: novaSenha,
      });

      setMensagemFeedback({
        tipo: "sucesso",
        texto: "Senha alterada com sucesso!",
      });

      setTimeout(() => {
        navigate("/editar-perfil");
      }, 1500);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.response?.data?.old_password?.[0] || "Erro ao alterar a senha. Verifique os dados.";
      setMensagemFeedback({ tipo: "erro", texto: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-page modo-confirmacao">
      {/* CABEÇALHO */}
      <header id="cabecalho" className="cabecalho-confirmacao">
        <div className="cabecalho-esquerda">
          <button
            type="button"
            className="botao-menu-confirmacao"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className="logo-confirmacao"
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer" }}
          >
            <img
              className="logo-texto"
              src={logoClara}
              alt="AnalisaAI"
              style={{ height: "30px", width: "auto" }}
            />
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="alterar-senha-container">
        <h2>ALTERAÇÃO DE SENHA</h2>

        {/* BANNER DE FEEDBACK DE ERRO / SUCESSO */}
        {mensagemFeedback.texto && (
          <div className={`banner-feedback-senha feedback-${mensagemFeedback.tipo}`}>
            <span className="feedback-icon">!</span>
            <p>{mensagemFeedback.texto}</p>
          </div>
        )}

        <form className="formulario-senha" onSubmit={handleSubmit}>
          
          {/* SUA SENHA ATUAL */}
          <div className="campo-senha">
            <label htmlFor="senhaAtual">Sua senha atual</label>
            <div className="input-senha-wrapper">
              <input
                type={mostrarAtual ? "text" : "password"}
                id="senhaAtual"
                placeholder="Digite sua senha atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
              <button
                type="button"
                className="btn-olho"
                onClick={() => setMostrarAtual(!mostrarAtual)}
                aria-label="Mostrar senha"
              >
                {mostrarAtual ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {/* SUA NOVA SENHA */}
          <div className="campo-senha">
            <label htmlFor="novaSenha">Sua nova senha</label>
            <div className="input-senha-wrapper">
              <input
                type={mostrarNova ? "text" : "password"}
                id="novaSenha"
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <button
                type="button"
                className="btn-olho"
                onClick={() => setMostrarNova(!mostrarNova)}
                aria-label="Mostrar nova senha"
              >
                {mostrarNova ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {/* REPITA A NOVA SENHA */}
          <div className="campo-senha">
            <label htmlFor="confirmaSenha">Repita a nova senha</label>
            <div className="input-senha-wrapper">
              <input
                type={mostrarConfirma ? "text" : "password"}
                id="confirmaSenha"
                placeholder="Digite a nova senha novamente"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
              />
              <button
                type="button"
                className="btn-olho"
                onClick={() => setMostrarConfirma(!mostrarConfirma)}
                aria-label="Mostrar confirmação de senha"
              >
                {mostrarConfirma ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {/* BOTÕES FINAIS */}
          <div className="botoes-finais-senha">
            <button
              type="button"
              className="btn-cancelar-senha"
              onClick={() => navigate("/editar-perfil")}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-confirmar-senha"
              disabled={submitting}
            >
              {submitting ? "Salvando..." : "Confirmar"}
            </button>
          </div>

        </form>
      </main>

      <MenuLateral menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
    </div>
  );
}