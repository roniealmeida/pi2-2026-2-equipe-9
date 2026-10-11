import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/Logo-AnalisaAI.png";
import "../Login/Login.css";
import "./OpcoesCad.css";
import useAuthStore from "../../stores/authStore";

function FormTecnico() {
  return (
    <form className="form-cadastro">
      <h3>Cadastro de Técnico</h3>
      <input type="text" placeholder="Nome completo" />
      <input type="tel" placeholder="Celular" />
      <button type="submit">Cadastrar Técnico</button>
    </form>
  );
}


function FormProdutor({
  estados,
  cidades,
  estadoSelecionado,
  setEstadoSelecionado,
  cidadeSelecionada,
  setCidadeSelecionada,
  nomeFazenda,
  setNomeFazenda,
  localidade,
  setLocalidade,
  finalizar,
}) {
  return (
    <form className="form-cadastro" onSubmit={finalizar}>
      <div className="campo">
        <label>Nome</label>
      <input type="text" placeholder="Digite o seu nome" />
      </div>
      <div className="campo">
        <label>Telefone</label>
        <input type="tel" placeholder="Digite o seu telefone" />
      </div>
      <div className="campo">
        <label>Email</label>
        <input type="email" placeholder="Digite o seu email" />
      </div>
      <div className="campo">
        <label>Senha</label>
        <input type="password" placeholder="Digite sua senha" />
      </div>
      <div className="campo">
        <label>Confirmar Senha</label>
        <input type="password" placeholder="Digite sua senha novamente" />
      </div>

      <h4>Informações da Propriedade</h4>

      <div className="campo">
        <label>Nome da Fazenda</label>
        <input
          type="text"
          placeholder="Nome da fazenda"
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
          placeholder="Localidade"
          value={localidade}
          onChange={(e) => setLocalidade(e.target.value)}
        />
      </div>

      <button type="submit">Cadastrar Produtor</button>
    </form>
  );
}

export default function OpcoesCad() {
  const [tipoCadastro, setTipoCadastro] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuthStore();

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

    try {
      await register({
        name: location.state?.nome,
        phone: location.state?.telefone,
        password: location.state?.senha,
        confirm_password: location.state?.confirmarSenha,
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
    <>
      <div id="topo">
        <div id="logo">
          <img src={logo} alt="Logo AnalisaAI" />
        </div>
        <div className="textos">
          <h2>Escolha o tipo de cadastro</h2>
        </div>
      </div>

      <div id="opcoes-container">
        <div
          className={`opcao ${tipoCadastro === "tecnico" ? "ativo" : ""}`}
          onClick={() => setTipoCadastro("tecnico")}
        >
          <button type="button">Sou Técnico</button>
        </div>
        <div
          className={`opcao ${tipoCadastro === "produtor" ? "ativo" : ""}`}
          onClick={() => setTipoCadastro("produtor")}
        >
          <button type="button">Sou Produtor</button>
        </div>
      </div>

      <div id="formulario-container">
        {tipoCadastro === "tecnico" && <FormTecnico />}
        {tipoCadastro === "produtor" && (
          <FormProdutor
            estados={estados}
            cidades={cidades}
            estadoSelecionado={estadoSelecionado}
            setEstadoSelecionado={setEstadoSelecionado}
            cidadeSelecionada={cidadeSelecionada}
            setCidadeSelecionada={setCidadeSelecionada}
            nomeFazenda={nomeFazenda}
            setNomeFazenda={setNomeFazenda}
            localidade={localidade}
            setLocalidade={setLocalidade}
            finalizar={finalizar}
          />
        )}
      </div>
    </>
  );
}