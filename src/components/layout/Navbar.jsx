import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Car, Menu, X } from 'lucide-react'

// Barre de navigation principale
// — se réduit légèrement au scroll
// — underline animé sur le lien actif
// — menu mobile avec slide-down
function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOuvert, setMenuOuvert] = useState(false)

  // Détecte le scroll pour réduire la navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ferme le menu mobile lors d'un changement de page
  useEffect(() => {
    setMenuOuvert(false)
  }, [location.pathname])

  const estActif = (chemin) =>
    location.pathname === chemin ? 'navbar__lien actif' : 'navbar__lien'

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="conteneur">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            LM <span>Prestige</span>
          </Link>

          {/* Navigation principale */}
          <nav className="navbar__nav">
            <Link to="/" className={estActif('/')}>
              <span>Accueil</span>
            </Link>
            <Link to="/catalogue" className={estActif('/catalogue')}>
              <span>Véhicules</span>
            </Link>
          </nav>

          {/* CTA */}
          <div className="navbar__cta">
            <Link to="/catalogue" className="btn btn--primaire">
              <Car size={15} />
              Réserver
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="navbar__menu-mobile"
            aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMenuOuvert((v) => !v)}
          >
            {menuOuvert ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      <div className={`navbar__mobile-drawer${menuOuvert ? ' navbar__mobile-drawer--ouvert' : ''}`}>
        <div className="conteneur">
          <nav className="navbar__mobile-nav">
            <Link to="/" className={estActif('/')}>Accueil</Link>
            <Link to="/catalogue" className={estActif('/catalogue')}>Véhicules</Link>
            <Link to="/catalogue" className="btn btn--primaire" style={{ width: '100%', justifyContent: 'center' }}>
              <Car size={15} /> Réserver
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
