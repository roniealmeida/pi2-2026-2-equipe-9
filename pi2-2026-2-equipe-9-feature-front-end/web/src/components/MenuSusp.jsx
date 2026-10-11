import { useState } from "react";
import "./MenuSusp.css";

export default function BotaoMenu({ currentStatus, onToggleStatus, label = "Editar" }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [working, setWorking] = useState(false);

  const alternarMenu = () => {
    setMenuAberto(!menuAberto);
  };

  async function handleToggle(action) {
    if (typeof onToggleStatus !== "function") {
      alert(`${action} (ação não conectada)`);
      setMenuAberto(false);
      return;
    }

    try {
      setWorking(true);
      await onToggleStatus();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status");
    } finally {
      setWorking(false);
      setMenuAberto(false);
    }
  }

  const isActive = currentStatus === 1;

  return (
    <div className="dropdown-container" style={{ position: "relative", display: "inline-block" }}>
      <button className="button-edit" onClick={alternarMenu} disabled={working}>
        {label} {menuAberto ? "▴" : "▾"}
      </button>

      {menuAberto && (
        <div className="menu-suspenso">
          {typeof onToggleStatus === "function" ? (
            <button onClick={() => handleToggle(isActive ? "bloquear" : "desbloquear") }>
              {isActive ? "Bloquear" : "Desbloquear"}
            </button>
          ) : (
            <>
              <button onClick={() => { alert("Bloqueado!"); setMenuAberto(false); }}>
                Bloquear
              </button>
              <button onClick={() => { alert("Desbloqueado!"); setMenuAberto(false); }}>
                Desbloquear
              </button>
            </>
          )}

          <button className="btn-fechar-interno" onClick={() => setMenuAberto(false)}>
            Fechar ✕
          </button>
        </div>
      )}
    </div>
  );
}