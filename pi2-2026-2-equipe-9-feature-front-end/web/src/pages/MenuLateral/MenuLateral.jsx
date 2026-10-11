import { Link } from "react-router-dom";
import "./MenuLateral.css";
import logo from "../../assets/images/Logo-AnalisaAI.png";
import iconMenu from "../../assets/images/icon-menu.png";
import iconHome from "../../assets/images/icon-home.png";
import iconEdit from "../../assets/images/icon-edit-person.png";
import iconHistorico from "../../assets/images/icon-historico.png";
import iconLogout from "../../assets/images/icon-logout.png";

export default function MenuLateral({ menuAberto, setMenuAberto }) {
  const fechar = () => setMenuAberto(false);

  return (
    <>
      {menuAberto && (
        <div className="menu-overlay" onClick={fechar} />
      )}

      <nav
        id="menu-lateral"
        className={menuAberto ? "menu-aberto" : "menu-fechado"}
      >
        <div className="menu-header">
          <img className="menu-logo" src={logo} alt="Logo" />
          <img
            className="menu-fechar"
            src={iconMenu}
            alt="Fechar"
            onClick={fechar}
          />
        </div>

        <p className="menu-titulo">Menu</p>

        <ul className="menu-opcoes">
          <li className="opcao-item">
            <Link to="/home" className="link-wrapper" onClick={fechar}>
              <img className="menu-icon" src={iconHome} alt="" />
              <span>Início</span>
            </Link>
          </li>

          <li className="opcao-item">
            <Link to="/editar-perfil" className="link-wrapper" onClick={fechar}>
              <img className="menu-icon" src={iconEdit} alt="" />
              <span>Editar Perfil</span>
            </Link>
          </li>

          <li className="opcao-item">
            <Link to="/historico" className="link-wrapper" onClick={fechar}>
              <img className="menu-icon" src={iconHistorico} alt="" />
              <span>Histórico</span>
            </Link>
          </li>
        </ul>

        <div className="menu-rodape">
          <hr className="menu-divisor" />
          <ul className="menu-opcoes">
            <li className="opcao-item sair">
              <Link to="/" className="link-wrapper link-sair" onClick={fechar}>
                <img className="menu-icon" src={iconLogout} alt="" />
                <span>Sair</span>
              </Link>
            </li>
          </ul>
        </div>

      </nav>
    </>
  );
} 