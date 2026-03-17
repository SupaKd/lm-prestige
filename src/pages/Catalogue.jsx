import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { vehicules, categories } from '../data/data'
import CarteVehicule from '../components/ui/CarteVehicule'

function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categorieActive, setCategorieActive] = useState(
    searchParams.get('categorie') || 'tous'
  )
  // Clé qui change à chaque filtre pour forcer le re-mount des cartes et relancer l'animation
  const [grilleCle, setGrilleCle] = useState(0)
  const enteteRef = useRef(null)

  useEffect(() => {
    const cat = searchParams.get('categorie')
    if (cat) setCategorieActive(cat)
  }, [searchParams])

  // Anime l'entête au montage
  useEffect(() => {
    const el = enteteRef.current
    if (!el) return
    requestAnimationFrame(() => el.classList.add('catalogue__header--visible'))
  }, [])

  const vehiculesFiltres = categorieActive === 'tous'
    ? vehicules
    : vehicules.filter((v) => v.categorie === categorieActive)

  const changerCategorie = (id) => {
    setCategorieActive(id)
    setGrilleCle((k) => k + 1) // relance le stagger
    if (id === 'tous') setSearchParams({})
    else setSearchParams({ categorie: id })
  }

  return (
    <main className="page">
      {/* Header catalogue — full width */}
      <div className="catalogue__header" ref={enteteRef}>
        <div className="conteneur">
          <div className="catalogue__header-inner">
            <div className="catalogue__header-texte">
              <h1 className="catalogue__header-titre">
                Notre <span>catalogue</span>
              </h1>
              <p className="catalogue__header-sous-titre">
                Sélectionnez votre véhicule et réservez en quelques minutes.
              </p>
            </div>
            <div className="catalogue__header-droite">
              <div className="catalogue__filtres">
                <SlidersHorizontal size={15} style={{ color: '#a8adb0', flexShrink: 0 }} />
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`catalogue__filtre-btn${categorieActive === cat.id ? ' catalogue__filtre-btn--actif' : ''}`}
                    onClick={() => changerCategorie(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <p className="catalogue__resultat">
                {vehiculesFiltres.length} véhicule{vehiculesFiltres.length > 1 ? 's' : ''} trouvé{vehiculesFiltres.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="conteneur">
        <section className="catalogue">

          {/* Grille — key force le re-render pour le stagger */}
          <div className="catalogue__grille" key={grilleCle}>
            {vehiculesFiltres.length > 0 ? (
              vehiculesFiltres.map((v, i) => (
                <div
                  key={v.id}
                  className="catalogue__carte-wrapper"
                  style={{ '--i': i }}
                >
                  <CarteVehicule vehicule={v} />
                </div>
              ))
            ) : (
              <div className="catalogue__vide">
                <p>Aucun véhicule dans cette catégorie pour le moment.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Catalogue
