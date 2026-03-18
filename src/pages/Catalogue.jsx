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
  const [grilleCle, setGrilleCle] = useState(0)
  const enteteRef = useRef(null)

  useEffect(() => {
    const cat = searchParams.get('categorie')
    if (cat) setCategorieActive(cat)
  }, [searchParams])

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
    setGrilleCle((k) => k + 1)
    if (id === 'tous') setSearchParams({})
    else setSearchParams({ categorie: id })
  }

  return (
    <main className="page" style={{ background: '#F8F6F2' }}>
      {/* Header */}
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
              <div className="catalogue__compteur">
                {String(vehiculesFiltres.length).padStart(2, '0')}
              </div>
              <div className="catalogue__compteur-label">
                véhicule{vehiculesFiltres.length > 1 ? 's' : ''} disponible{vehiculesFiltres.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="catalogue__filtres-wrap">
            <div className="catalogue__filtres">
              <SlidersHorizontal size={14} style={{ color: 'rgba(245,240,232,0.25)', flexShrink: 0 }} />
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
          </div>
        </div>
      </div>

      {/* Grille */}
      <div className="conteneur" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <section className="catalogue">
          <div className="catalogue__grille" key={grilleCle}>
            {vehiculesFiltres.length > 0 ? (
              vehiculesFiltres.map((v, i) => (
                <div
                  key={v.id}
                  className="catalogue__carte-wrapper"
                  style={{ '--i': i }}
                >
                  <CarteVehicule vehicule={v} index={i} />
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
