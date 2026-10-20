import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import "./Cadastrar.css";

export default function CadastroProdutor() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const [nomeFazenda, setNomeFazenda] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((dados) => {
        const ordenados = dados.sort((a, b) => a.nome.localeCompare(b.nome));
        setEstados(ordenados);
      });
  }, []);

  useEffect(() => {
    if (!estadoSelecionado) return;
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`
    )
      .then((res) => res.json())
      .then((dados) => setCidades(dados));
  }, [estadoSelecionado]);

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
        farm:
          nomeFazenda && estadoSelecionado && cidadeSelecionada && localidade
            ? {
                name: nomeFazenda,
                state: estadoSelecionado,
                municipality: cidadeSelecionada,
                location: localidade,
              }
            : null,
      });
      alert("Cadastro feito com sucesso!");
      navigate("/");
    } catch (err) {
      alert("Erro no cadastro");
    }
  };

  return (
    <div className="cadastro-container">
      <h3>Cadastro de Produtor</h3>
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

        <h4>Informações da Propriedade</h4>

        <div className="campo">
          <label>Nome da Fazenda</label>
          <input
            type="text"
            placeholder="Digite o nome da fazenda"
            value={nomeFazenda}
            onChange={(e) => setNomeFazenda(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Estado</label>
          <select
            value={estadoSelecionado}
            onChange={(e) => setEstadoSelecionado(e.target.value)}
          >
            <option value="">Selecione um estado</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.sigla}>
                {estado.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Município/Cidade</label>
          <select
            value={cidadeSelecionada}
            onChange={(e) => setCidadeSelecionada(e.target.value)}
          >
            <option value="">Selecione um município</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.nome}>
                {cidade.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Localidade</label>
          <input
            type="text"
            placeholder="Digite a localidade"
            value={localidade}
            onChange={(e) => setLocalidade(e.target.value)}
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