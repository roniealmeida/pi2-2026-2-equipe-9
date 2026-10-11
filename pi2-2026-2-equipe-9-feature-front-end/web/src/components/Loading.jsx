import React from "react";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="loading-container">
      {/* O símbolo rodando */}
      <div className="spinner"></div>
      {/* O texto animado */}
      <p>Carregando...</p>
    </div>
  );
}