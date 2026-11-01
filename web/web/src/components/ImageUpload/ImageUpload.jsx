import React, { useState, useRef } from "react";
import { toBase64 } from "../../utils/converter";
import iconSelecionar from "../../assets/images/icon-selecionar.png";

export default function ImageUpload({ onImageProcessed, onCancel }) {
  const [imagemPreview, setImagemPreview] = useState(null);
  const [rotacao, setRotacao] = useState(0);
  const [erroEnvio, setErroEnvio] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const extensoesPermitidas = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/webp",
    "image/raw",
  ];

  const processarArquivo = async (arquivo) => {
    if (!arquivo) return;

    const tipoValido =
      extensoesPermitidas.includes(arquivo.type) ||
      /\.(jpg|jpeg|png|heic|webp|raw)$/i.test(arquivo.name);

    if (!tipoValido) {
      setErroEnvio("O arquivo escolhido não é compatível.");
      setImagemPreview(null);
      return;
    }

    if (imagemPreview) {
      URL.revokeObjectURL(imagemPreview);
    }
    
    setErroEnvio(null);
    setRotacao(0);
    const urlTemporaria = URL.createObjectURL(arquivo);
    setImagemPreview(urlTemporaria);

    try {
      const base64 = await toBase64(arquivo);
      if (onImageProcessed) {
        onImageProcessed({ file: arquivo, previewUrl: urlTemporaria, base64, rotacao: 0 });
      }
    } catch (err) {
      setErroEnvio("Erro ao processar o arquivo de imagem.");
    }
  };

  const aoSelecionarFoto = (event) => {
    const arquivo = event.target.files[0];
    processarArquivo(arquivo);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const arquivo = e.dataTransfer.files[0];
    processarArquivo(arquivo);
  };

  const rotacionarImagem = () => {
    const novaRotacao = (rotacao + 90) % 360;
    setRotacao(novaRotacao);
  };

  const escolherOutraFoto = () => {
    if (imagemPreview) {
      URL.revokeObjectURL(imagemPreview);
    }
    setImagemPreview(null);
    setErroEnvio(null);
    setRotacao(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload-component">
      {erroEnvio ? (
        <div className="container-erro-incompativel">
          <div className="home-erro-banner-pilula">
            <span className="home-erro-icon">!</span>
            <p>{erroEnvio}</p>
          </div>
          <p className="subtexto-erro-incompativel">
            Seu arquivo não possui um formato compatível ou pode estar corrompido.<br />
            Tente novamente.
          </p>
          <p className="formatos-aceitos-texto">
            Formatos aceitos: .jpg, .png, .heic, .webp e .raw
          </p>
          <div className="botoes-erro-incompativel">
            <button
              type="button"
              className="btn-voltar-home"
              onClick={() => setErroEnvio(null)}
            >
              Voltar
            </button>
            <button
              type="button"
              className="btn-escolher-novamente"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              Escolher novamente
            </button>
          </div>
        </div>
      ) : !imagemPreview ? (
        <div 
          id="container-selecao"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? "2px dashed #4CAF50" : "2px dashed transparent",
            borderRadius: "12px",
            transition: "all 0.2s ease"
          }}
        >
          <h2>Envie ou tire uma foto para a análise da Inteligência Artificial</h2>

          <div id="selecionar">
            <img
              id="photo-selection"
              src={iconSelecionar}
              alt="Selecionar"
            />
            <input
              type="file"
              ref={fileInputRef}
              id="gerenciadorArquivos"
              accept=".jpg, .jpeg, .png, .heic, .webp, .raw"
              capture="environment"
              style={{ display: "none" }}
              onChange={aoSelecionarFoto}
            />
            <label
              htmlFor="gerenciadorArquivos"
              id="arquivo"
              style={{ cursor: "pointer" }}
            >
              Selecionar arquivo / Câmera
            </label>
          </div>

          <div id="recomendacao">
            <div className="bloco">
              <li>Envie uma foto com iluminação clara</li>
              <li>Evite fotos tremidas ou fora de foco</li>
              <li>Garanta que a foto não esteja borrada</li>
            </div>
            <div className="bloco">
              <li>Aproxime a câmera da folha ou área afetada</li>
              <li>Mostre apenas uma planta por foto</li>
              <li>Evite outras plantas no fundo</li>
            </div>
          </div>
        </div>
      ) : (
        <div id="container-confirmacao">
          <h2>Pré-visualização e Ajuste da Foto</h2>

          <div className="preview-box" style={{ overflow: "hidden", textAlign: "center" }}>
            <img
              id="preview-foto"
              src={imagemPreview}
              alt="Foto selecionada"
              style={{
                transform: `rotate(${rotacao}deg)`,
                transition: "transform 0.3s ease",
                maxWidth: "100%",
                maxHeight: "350px",
                objectFit: "contain"
              }}
            />
          </div>

          {/* Botões de controle de ajuste */}
          <div style={{ margin: "15px 0", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              type="button"
              className="btn-alterar"
              onClick={rotacionarImagem}
              style={{ cursor: "pointer" }}
            >
              🔄 Rotacionar ({rotacao}°)
            </button>
          </div>

          <div className="botoes-confirmacao">
            <button
              type="button"
              id="btn-alterar"
              onClick={escolherOutraFoto}
            >
              Trocar foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}