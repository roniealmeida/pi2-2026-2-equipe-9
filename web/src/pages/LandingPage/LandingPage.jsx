import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

import logoAnalisa from "../../assets/images/Logo-AnalisaAI.png";
import logoIfce from "../../assets/images/logo-ifce.png";
import logoUfc from "../../assets/images/logo-ufc.png";

import bgPlantaHero from "../../assets/images/plant-home.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  const irParaLogin = () => navigate("/login");
  const irParaCadastro = () => navigate("/opcoesCadastro");

  return (
    <div className="landing-page">
      {/* ==================== CABEÇALHO SUPERIOR ==================== */}
      <header className="landing-header">
        <div
          className="landing-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={logoAnalisa} alt="AnalisaAI" />
        </div>

        <nav className="landing-nav-acoes">
          <button
            type="button"
            className="btn-landing-login"
            onClick={irParaLogin}
          >
            Fazer login
          </button>

          <button
            type="button"
            className="btn-landing-cadastrar"
            onClick={irParaCadastro}
          >
            Cadastrar
          </button>
        </nav>
      </header>

      {/* ==================== CONTEÚDO PRINCIPAL ==================== */}
      <main className="landing-main">
        {/* ---------- SEÇÃO HERO COM IMAGEM DESFOCADA NO FUNDO ---------- */}
        <section className="landing-hero">
          {/* Camada da imagem de fundo desfocada cobrindo todos os lados */}
          <div
            className="landing-hero-bg"
            style={{ backgroundImage: `url(${bgPlantaHero})` }}
            aria-hidden="true"
          />

          {/* Camada de escurecimento para contraste do texto */}
          <div className="landing-hero-overlay" aria-hidden="true" />

          {/* Conteúdo textual */}
          <div className="landing-hero-texto">
            <span className="landing-badge">
              Inteligência Artificial aplicada ao campo
            </span>

            <h1>
              Identifique plantas tóxicas com rapidez e segurança no{" "}
              <span>AnalisaAI</span>
            </h1>

            <p>
              O <strong>AnalisaAI</strong> é uma plataforma inteligente criada
              para auxiliar produtores rurais na identificação de plantas com
              potencial tóxico para animais e seres humanos. Através de uma
              simples fotografia, o sistema analisa a espécie, informa riscos e
              sintomas e conta com validação de especialistas para garantir maior
              confiabilidade no diagnóstico.
            </p>

            <div className="landing-hero-botoes">
              <button
                type="button"
                className="btn-hero-destaque"
                onClick={irParaCadastro}
              >
                Começar agora
              </button>

              <button
                type="button"
                className="btn-hero-contorno"
                onClick={irParaLogin}
              >
                Já tenho conta
              </button>
            </div>
          </div>
        </section>

        {/* ---------- COMO FUNCIONA ---------- */}
        <section className="landing-como-funciona">
          <h2>Como o sistema funciona</h2>
          <p className="landing-secao-subtitulo">
            Tecnologia colaborativa unindo Inteligência Artificial e
            conhecimento técnico
          </p>

          <div className="landing-passos-grid">
            <div className="landing-passo-card">
              <span className="passo-numero">1</span>
              <h3>Envio da Fotografia</h3>
              <p>
                O produtor tira ou seleciona uma foto nítida da planta
                encontrada na propriedade rural diretamente pela plataforma.
              </p>
            </div>

            <div className="landing-passo-card">
              <span className="passo-numero">2</span>
              <h3>Análise por IA</h3>
              <p>
                Nosso modelo identifica a espécie e apresenta nome popular,
                nome científico, sintomas, espécies animais suscetíveis e
                ações recomendadas.
              </p>
            </div>

            <div className="landing-passo-card">
              <span className="passo-numero">3</span>
              <h3>Validação Especializada</h3>
              <p>
                Quando o índice de confiança da IA fica abaixo de 80%, o
                registro segue para parecer técnico de especialistas,
                aprimorando continuamente o sistema.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- PERFIS DO SISTEMA ---------- */}
        <section className="landing-perfis">
          <h2>Dois perfis integrados</h2>
          <p className="landing-secao-subtitulo">
            Escolha o perfil ideal para sua atuação na plataforma ao se
            cadastrar
          </p>

          <div className="landing-perfis-grid">
            <div className="landing-perfil-card">
              <div className="perfil-icone">🌱</div>
              <span className="perfil-tag">Uso no Campo</span>
              <h3>Produtor Rural</h3>
              <p>
                Voltado para produtores e trabalhadores rurais que precisam de
                apoio rápido para identificar plantas suspeitas em suas áreas de
                pastagem e cultivo.
              </p>
              <ul>
                <li>Envio rápido de fotos para diagnóstico imediato</li>
                <li>Alertas de toxicidade para animais e humanos</li>
                <li>Histórico completo das análises realizadas</li>
                <li>Orientações preventivas e ações recomendadas</li>
              </ul>
            </div>

            <div className="landing-perfil-card">
              <div className="perfil-icone">🔬</div>
              <span className="perfil-tag">Curadoria Científica</span>
              <h3>Técnico (Estudantes, Professores e Profissionais)</h3>
              <p>
                Destinado a estudantes, docentes e profissionais das ciências
                agrárias, biológicas e veterinárias que colaboram com a precisão
                científica da plataforma.
              </p>
              <ul>
                <li>Cadastro de novas espécies e sintomas no banco de dados</li>
                <li>
                  Revisão e emissão de pareceres em análises com baixa confiança
                </li>
                <li>
                  Alimentação da base de treinamento dos modelos de IA (LLM)
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== RODAPÉ INSTITUCIONAL ==================== */}
      <footer className="landing-footer">
        <p className="landing-footer-texto">
          Projeto realizado para a disciplina <strong>Projeto Integrado</strong>{" "}
          em parceria com o <strong>IFCE</strong>
        </p>

        <div className="landing-footer-logos">
          <div className="instituicao-logo-box">
            <img
              src={logoIfce}
              alt="Instituto Federal do Ceará - IFCE"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "inline-block";
              }}
            />
            <span className="instituicao-fallback" style={{ display: "none" }}>
              IFCE
            </span>
          </div>

          <span className="logos-separador">•</span>

          <div className="instituicao-logo-box">
            <img
              src={logoUfc}
              alt="Universidade Federal do Ceará - UFC"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "inline-block";
              }}
            />
            <span className="instituicao-fallback" style={{ display: "none" }}>
              UFC
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}