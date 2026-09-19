import { Link } from "react-router-dom";

export default function CardPlanta({
  imagem,
  nome,
  descricao,
  rotaLink,
}) {
  return (
    <Link
      to={rotaLink}
      className="historico-card-link"
    >
      <article className="historico-card">

        <div className="historico-card-imagem">
          <img
            src={imagem}
            alt={nome || "Planta analisada"}
          />
        </div>

        <div className="historico-card-info">

          <h3>
            {nome || "Planta analisada"}
          </h3>

          <p>
            {descricao || "Informações da análise realizada."}
          </p>

        </div>

        <div
          className="historico-card-seta"
          aria-hidden="true"
        >
          →
        </div>

      </article>
    </Link>
  );
}