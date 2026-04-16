export default function Card({
  title,
  subtitle,
  description,
  link,
  badge,
  meta = [],
  relevanceNote,
  reason,
  score,
}) {
  return (
    <article className="card">
      <div className="card-topline">
        {badge ? <span className="card-badge">{badge}</span> : null}
        {score ? <span className="card-score">{score}</span> : null}
      </div>
      <h3>{title}</h3>
      {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
      {description ? <p className="card-description">{description}</p> : null}
      {relevanceNote || reason ? (
        <p className="card-note">{relevanceNote || reason}</p>
      ) : null}
      {meta.length ? (
        <div className="tag-row">
          {meta.map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : score ? (
        <div className="tag-row">
          <span className="tag">{`Score: ${score}`}</span>
        </div>
      ) : null}
      {link ? (
        <a href={link} target="_blank" rel="noreferrer">
          Open source
        </a>
      ) : null}
    </article>
  );
}
