import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'

// Pied de page du site
function Footer() {
  const annee = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="conteneur">
        <div className="footer__grille">
          {/* Colonne marque */}
          <div>
            <div className="footer__logo">
              LM <span>Prestige</span>
            </div>
            <p className="footer__description">
              Location de véhicules dans la zone Pays de Gex, Ain et Genève.
              Flotte récente, service personnalisé, disponible 7j/7.
            </p>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <Phone size={14} />
                <span>+33 4 50 XX XX XX</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={14} />
                <span>contact@lm-prestige.fr</span>
              </div>
              <div className="footer__contact-item">
                <MapPin size={14} />
                <span>Gex, Pays de Gex (01)</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="footer__titre-col">Navigation</div>
            <ul className="footer__liste">
              <li><Link to="/" className="footer__lien">Accueil</Link></li>
              <li><Link to="/catalogue" className="footer__lien">Catalogue</Link></li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <div className="footer__titre-col">Véhicules</div>
            <ul className="footer__liste">
              <li><span className="footer__lien">Citadines</span></li>
              <li><span className="footer__lien">Berlines</span></li>
              <li><span className="footer__lien">SUV</span></li>
              <li><span className="footer__lien">Utilitaires</span></li>
              <li><span className="footer__lien">Premium</span></li>
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="footer__bas">
          <span>&copy; {annee} LM Prestige. Tous droits réservés.</span>
          <div className="footer__mention-or">Location Premium</div>
          <span>Pays de Gex · Ain · Genève</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
