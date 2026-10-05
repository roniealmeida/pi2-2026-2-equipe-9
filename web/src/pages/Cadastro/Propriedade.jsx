import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Propriedade.css";
import useAuthStore  from "../../stores/authStore";

// Componente simples criado internamente para a tela não quebrar
function BarraProgresso({ valor }) {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#e0e0e0",
        borderRadius: "8px",
        height: "10px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          width: `${valor}%`,
          backgroundColor: "#4caf50",
          height: "100%",
          borderRadius: "8px",
          transition: "width 0.3s",
        }}
      ></div>
    </div>
  );
}

export default function Propriedade() {
  const navigate = useNavigate();
  const [nomeFazenda, setNomeFazenda] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const location = useLocation();
  const { user, register, loading } = useAuthStore();

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
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`,
    )
      .then((res) => res.json())
      .then((dados) => setCidades(dados));
  }, [estadoSelecionado]);

  const finalizar = async (e) => {
    e.preventDefault();

    try {
      await register({
        name: location.state.nome,
        phone: location.state.telefone,
        password: location.state.senha,
        confirm_password: location.state.confirmarSenha,
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
      alert("Erro no cadastro" , err);
    }
  };

  return (
    <div className="cadastro-container">
      <BarraProgresso valor={100} />

      <h3>Informações sobre sua fazenda</h3>
      <button className="voltar" onClick={() => navigate("/")}>Voltar</button>

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
        <button onClick={finalizar}>Cadastrar-se</button>
      </div>
    </div>
  );
}
