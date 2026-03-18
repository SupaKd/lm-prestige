import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOuvert, setMenuOuvert] = useState(false)

  // Pages à fond clair — la navbar adapte sa couleur
  const estPageClaire = location.pathname === '/catalogue' ||
    location.pathname.startsWith('/vehicule') ||
    location.pathname.startsWith('/reservation') ||
    location.pathname.startsWith('/recapitulatif')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOuvert(false) }, [location.pathname])

  const estActif = (chemin) =>
    location.pathname === chemin ? 'navbar__lien actif' : 'navbar__lien'

  const classeNavbar = [
    'navbar',
    scrolled ? 'navbar--scrolled' : '',
    estPageClaire && !scrolled ? 'navbar--clair' : '',
  ].filter(Boolean).join(' ')

  return (
    <header className={classeNavbar}>
      <div className="navbar__bulle">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          LM <span>Prestige</span>
        </Link>

        {/* Navigation centrale */}
        <nav className="navbar__nav">
          <Link to="/" className={estActif('/')}>Accueil</Link>
          <Link to="/catalogue" className={estActif('/catalogue')}>Véhicules</Link>
        </nav>

        {/* CTA */}
        <div className="navbar__cta">
          <Link to="/catalogue" className="btn btn--primaire">
            Réserver
          </Link>
        </div>

        {/* CTA + burger mobile */}
        <div className="navbar__mobile-droite">
          <Link to="/catalogue" className="btn btn--primaire navbar__cta-mobile">
            Réserver
          </Link>
          <button
            className="navbar__menu-mobile"
            aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMenuOuvert((v) => !v)}
          >
            {menuOuvert ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`navbar__mobile-drawer${menuOuvert ? ' navbar__mobile-drawer--ouvert' : ''}`}>
        <nav className="navbar__mobile-nav">
          <Link to="/" className={estActif('/')}>Accueil</Link>
          <Link to="/catalogue" className={estActif('/catalogue')}>Véhicules</Link>
          <Link to="/catalogue" className="btn btn--primaire" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}>
            Réserver
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
