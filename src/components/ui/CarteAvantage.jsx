// Carte avantage — animations autonomes
// — sweep : reflet lumineux qui balaie la carte en boucle
// — float : icône qui monte/descend doucement, décalée par index

function CarteAvantage({ icone, titre, texte, style, index = 0 }) {
  // Décalage unique par carte pour désynchroniser les animations
  const floatDelay  = `${index * 0.6}s`
  const sweepDelay  = `${index * 1.1}s`

  return (
    <div
      className="carte-avantage reveal"
      style={style}
    >
      {/* Sweep — éclat lumineux qui traverse */}
      <div className="carte-avantage__sweep" style={{ animationDelay: sweepDelay }} />

      {/* Icône flottante */}
      <div
        className="carte-avantage__icone carte-avantage__icone--float"
        style={{ animationDelay: floatDelay }}
      >
        {icone}
      </div>

      <div className="carte-avantage__titre">{titre}</div>
      <p className="carte-avantage__texte">{texte}</p>
    </div>
  )
}

export default CarteAvantage
