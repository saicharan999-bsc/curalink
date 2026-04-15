export default function Card({ title, subtitle, description, link }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
      {description ? <p>{description}</p> : null}
      {link ? (
        <a href={link} target="_blank" rel="noreferrer">
          Open source
        </a>
      ) : null}
    </article>
  );
}
