import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import useAuthStore from "../../stores/authStore";
import MenuLateral from "../MenuLateral/MenuLateral";

import logoEscura from "../../assets/images/Logo-AnalisaAI-Escura.png";
import logoSimbolo from "../../assets/images/Logo-AnalisaAI-Simbolo.png";
import { BsPencil, BsCheck } from "react-icons/bs";

import "./EditarPerfil.css";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [dados, setDados] = useState({
    nome: "",
    telefone: "",
    localidade: "",
    fazenda: "",
  });

  const [editando, setEditando] = useState({
    nome: false,
    telefone: false,
    localidade: false,
    fazenda: false,
  });

  // 1. Busca dados atualizados do perfil no Django
  useEffect(() => {
    async function carregarDadosPerfil() {
      try {
        const response = await api.get("users/profile/");
        const userData = response.data.user || response.data;
        setUser(userData);
      } catch (err) {
        console.error("Erro ao carregar dados do perfil:", err);
      }
    }

    carregarDadosPerfil();
  }, []);

  // 2. Busca Estados do IBGE
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((dados) => {
        const ordenados = dados.sort((a, b) => a.nome.localeCompare(b.nome));
        setEstados(ordenados);
      });
  }, []);

  // 3. Busca Municípios conforme Estado
  useEffect(() => {
    if (!estadoSelecionado) return;
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
      .then((res) => res.json())
      .then((dados) => {
        setCidades(dados);
      });
  }, [estadoSelecionado]);

  // 4. Sincroniza formulário com estado do usuário
  useEffect(() => {
    if (!user) return;

    setDados({
      nome: user.name || "",
      telefone: user.phone || "",
      localidade: user.farm?.location || "",
      fazenda: user.farm?.name || "",
    });

    setEstadoSelecionado(user.farm?.state || "");
    setCidadeSelecionada(user.farm?.municipality || "");
  }, [user]);

  const toggleEditar = (campo) => {
    setEditando((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  const handleChange = (campo, valor) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleCancelar = () => {
    if (!user) return;

    setDados({
      nome: user.name || "",
      telefone: user.phone || "",
      localidade: user.farm?.location || "",
      fazenda: user.farm?.name || "",
    });

    setEstadoSelecionado(user.farm?.state || "");
    setCidadeSelecionada(user.farm?.municipality || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Usuário não autenticado.");
      return;
    }

    const farm = user.farm || {};
    const payload = { user_id: user.id };

    if (dados.nome !== user.name) payload.name = dados.nome;
    if (dados.telefone !== user.phone) payload.phone = dados.telefone;
    if (dados.fazenda !== farm.name) payload.farm_name = dados.fazenda;
    if (estadoSelecionado !== farm.state) payload.state = estadoSelecionado;
    if (cidadeSelecionada !== farm.municipality) payload.municipality = cidadeSelecionada;
    if (dados.localidade !== farm.location) payload.location = dados.localidade;

    if (Object.keys(payload).length === 1) {
      alert("Nenhuma alteração detectada.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.patch("users/profile/", payload);
      const updatedUser = response?.data?.user;

      if (updatedUser) {
        setUser(updatedUser);
        alert("Dados cadastrais atualizados com sucesso.");
        setDados({
          nome: updatedUser.name || "",
          telefone: updatedUser.phone || "",
          localidade: updatedUser.farm?.location || "",
          fazenda: updatedUser.farm?.name || "",
        });
        setEstadoSelecionado(updatedUser.farm?.state || "");
        setCidadeSelecionada(updatedUser.farm?.municipality || "");
      } else {
        alert("Não foi possível atualizar os dados do perfil.");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Erro ao atualizar o perfil.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-page modo-confirmacao">
      {/* CABEÇALHO IDÊNTICO À F04 */}
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
              className="logo-simbolo"
              src={logoSimbolo}
              alt=""
            />
            <img
              className="logo-texto"
              src={logoEscura}
              alt="AnalisaAI"
            />
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL DO PERFIL */}
      <main className="editar-perfil-container">
        <h2>Meu Perfil - Dados Cadastrais</h2>

        <section className="secao-dados">
          <h3>Meus Dados</h3>

          <form className="formulario-perfil" onSubmit={handleSubmit}>
            <div className="colunas-2">

              {/* NOME */}
              <div className="campo-com-botao">
                <label htmlFor="nome">Nome</label>
                <div className="input-botao-wrapper">
                  <input
                    type="text"
                    id="nome"
                    placeholder="Digite seu nome"
                    value={dados.nome}
                    disabled={!editando.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={() => toggleEditar("nome")}
                  >
                    {editando.nome ? <><BsCheck /> Salvar</> : <><BsPencil /> Editar</>}
                  </button>
                </div>
              </div>

              {/* ESTADO */}
              <div className="campo-sem-botao">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
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

              {/* TELEFONE */}
              <div className="campo-com-botao">
                <label htmlFor="telefone">Telefone</label>
                <div className="input-botao-wrapper">
                  <input
                    type="text"
                    id="telefone"
                    placeholder="(xx) xxxxx-xxxx"
                    value={dados.telefone}
                    disabled={!editando.telefone}
                    onChange={(e) => handleChange("telefone", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={() => toggleEditar("telefone")}
                  >
                    {editando.telefone ? <><BsCheck /> Salvar</> : <><BsPencil /> Editar</>}
                  </button>
                </div>
              </div>

              {/* LOCALIDADE */}
              <div className="campo-com-botao">
                <label htmlFor="localidade">Localidade</label>
                <div className="input-botao-wrapper">
                  <input
                    type="text"
                    id="localidade"
                    placeholder="Nome da Localidade"
                    value={dados.localidade}
                    disabled={!editando.localidade}
                    onChange={(e) => handleChange("localidade", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={() => toggleEditar("localidade")}
                  >
                    {editando.localidade ? <><BsCheck /> Salvar</> : <><BsPencil /> Editar</>}
                  </button>
                </div>
              </div>

              {/* MUNICÍPIO */}
              <div className="campo-sem-botao">
                <label htmlFor="cidade">Município/Cidade</label>
                <select
                  id="cidade"
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

              {/* FAZENDA */}
              <div className="campo-com-botao">
                <label htmlFor="fazenda">Nome da Fazenda</label>
                <div className="input-botao-wrapper">
                  <input
                    type="text"
                    id="fazenda"
                    placeholder="Nome da Fazenda"
                    value={dados.fazenda}
                    disabled={!editando.fazenda}
                    onChange={(e) => handleChange("fazenda", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={() => toggleEditar("fazenda")}
                  >
                    {editando.fazenda ? <><BsCheck /> Salvar</> : <><BsPencil /> Editar</>}
                  </button>
                </div>
              </div>

            </div>

            <div className="botoes-finais">
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancelar}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-salvar"
                disabled={submitting}
              >
                {submitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <MenuLateral menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
    </div>
  );
}