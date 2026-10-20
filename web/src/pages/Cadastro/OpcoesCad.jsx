import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/Logo-AnalisaAI.png";
import "../Login/Login.css";
import "./OpcoesCad.css";
import useAuthStore from "../../stores/authStore";
export default function OpcoesCad() {
  const navigate = useNavigate();
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
        <div>
          <button type="button" onClick={() => navigate("/cadastroProdutor")}>
            Sou proprietário(a), agricultor(a) ou pecuarista
          </button>
        </div>
        <div>
          <button type="button" onClick={() => navigate("/cadastroTecnico")}>
            Sou técnico(a) agrícola, agrônomo(a) ou afins
          </button>
        </div>
        <div id="opcao-voltar">
          <button type="button" onClick={() => navigate("/")}>
            Voltar
          </button>
        </div>
      </div>

    </>
  );
}