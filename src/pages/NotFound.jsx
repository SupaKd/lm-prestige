import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Car, ArrowLeft } from 'lucide-react'

function NotFound() {
  const wrapperRef = useRef(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    requestAnimationFrame(() => el.classList.add('not-found--visible'))
  }, [])

  return (
    <main className="page not-found" ref={wrapperRef}>
      <div className="conteneur">
        <div className="not-found__inner">

          {/* Chiffre animé */}
          <div className="not-found__chiffre" aria-hidden="true">
            <span>4</span>
            <div className="not-found__roue">
              <Car size={52} strokeWidth={1.2} />
            </div>
            <span>4</span>
          </div>

          <h1 className="not-found__titre">Page introuvable</h1>
          <p className="not-found__texte">
            Cette page a peut-être été déplacée ou n&apos;existe pas.
            <br />
            Revenez au catalogue pour trouver votre véhicule.
          </p>

          <div className="not-found__actions">
            <Link to="/catalogue" className="btn btn--primaire btn--grand">
              <Car size={17} /> Voir les véhicules
            </Link>
            <Link to="/" className="btn btn--secondaire">
              <ArrowLeft size={15} /> Accueil
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}

export default NotFound
