import { useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Users, Fuel, Settings, Gauge, Thermometer,
  Navigation, Bluetooth, CheckCircle, XCircle, Calendar, ArrowRight
} from 'lucide-react'
import { vehicules } from '../data/data'
import Galerie from '../components/ui/Galerie'

function FicheVehicule() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)

  const vehicule = vehicules.find((v) => v.id === parseInt(id))
  const index = vehicules.findIndex((v) => v.id === parseInt(id))

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    requestAnimationFrame(() => el.classList.add('fiche-vehicule--visible'))
  }, [id])

  if (!vehicule) {
    return (
      <main className="page">
        <div className="conteneur" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <h2>Véhicule introuvable</h2>
          <p style={{ marginTop: '1rem', color: '#72777a' }}>
            Ce véhicule n&apos;existe pas ou a été retiré du catalogue.
          </p>
          <Link to="/catalogue" className="btn btn--primaire" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Retour au catalogue
          </Link>
        </div>
      </main>
    )
  }

  const { nom, categorie, prix_jour, places, transmission, carburant, disponible, images, description, caracteristiques } = vehicule

  const specs = [
    { icone: <Users size={14} />, label: 'Places', valeur: `${places}` },
    { icone: <Settings size={14} />, label: 'Transmission', valeur: transmission },
    { icone: <Fuel size={14} />, label: 'Carburant', valeur: carburant },
    { icone: <Gauge size={14} />, label: 'Puissance', valeur: caracteristiques.puissance },
  ]

  const equipements = [
    { icone: <Thermometer size={14} />, label: 'Climatisation', ok: caracteristiques.climatisation },
    { icone: <Navigation size={14} />, label: 'GPS intégré', ok: caracteristiques.gps },
    { icone: <Bluetooth size={14} />, label: 'Bluetooth', ok: caracteristiques.bluetooth },
  ]

  const numeroFiche = String(index + 1).padStart(2, '0')

  return (
    <main className="page fiche-page" style={{ background: '#F8F6F2' }}>
      <div className="fiche-vehicule" ref={pageRef}>

        {/* ── Header éditorial ── */}
        <div className="fiche-vehicule__entete">
          <div className="conteneur">
            <div className="fiche-vehicule__entete-inner">
              <button
                onClick={() => navigate(-1)}
                className="fiche-vehicule__retour-btn"
              >
                <ArrowLeft size={14} /> Catalogue
              </button>
              <span className="fiche-vehicule__breadcrumb">
                {categorie} · #{numeroFiche}
              </span>
            </div>
          </div>
        </div>

        {/* ── Split layout ── */}
        <div className="conteneur">
          <div className="fiche-vehicule__split">

            {/* ── Colonne gauche — galerie sticky ── */}
            <div className="fiche-vehicule__colonne-gauche">
              <div className="fiche-vehicule__galerie-wrap">
                {/* Filigrane numéro en arrière-plan */}
                <div className="fiche-vehicule__filigrane">{numeroFiche}</div>
                <Galerie images={images} nom={nom} />
              </div>
            </div>

            {/* ── Colonne droite — contenu scrollable ── */}
            <div className="fiche-vehicule__colonne-droite">

              {/* En-tête véhicule */}
              <div className="fiche-vehicule__header-contenu">
                <div className="fiche-vehicule__meta">
                  <span className="fiche-vehicule__categorie-tag">{categorie}</span>
                  <span className={`badge badge--${disponible ? 'disponible' : 'indisponible'}`}>
                    {disponible ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                <h1 className="fiche-vehicule__nom">{nom}</h1>
                <p className="fiche-vehicule__description">{description}</p>
              </div>

              {/* Prix */}
              <div className="fiche-vehicule__prix-bloc">
                <div className="fiche-vehicule__prix-inner">
                  <span className="fiche-vehicule__prix">{prix_jour}€</span>
                  <span className="fiche-vehicule__prix-label">/ jour · TTC</span>
                </div>
                <div className="fiche-vehicule__prix-note">
                  Sans franchise · Assurance incluse
                </div>
              </div>

              {/* Séparateur or */}
              <div className="fiche-vehicule__separateur" />

              {/* Tableau specs éditorial */}
              <div className="fiche-vehicule__specs-section">
                <h3 className="fiche-vehicule__section-titre">Caractéristiques</h3>
                <div className="fiche-vehicule__specs-tableau">
                  {specs.map((s, i) => (
                    <div key={i} className="fiche-vehicule__spec-ligne" style={{ '--si': i }}>
                      <span className="fiche-vehicule__spec-icone">{s.icone}</span>
                      <span className="fiche-vehicule__spec-label">{s.label}</span>
                      <span className="fiche-vehicule__spec-valeur">{s.valeur}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Séparateur or */}
              <div className="fiche-vehicule__separateur" />

              {/* Équipements */}
              <div className="fiche-vehicule__equip-section">
                <h3 className="fiche-vehicule__section-titre">Équipements</h3>
                <div className="fiche-vehicule__equip-liste">
                  {equipements.map((eq, i) => (
                    <div
                      key={i}
                      className={`fiche-vehicule__equip-item fiche-vehicule__equip-item--${eq.ok ? 'ok' : 'non'}`}
                      style={{ '--oi': i }}
                    >
                      <span className="fiche-vehicule__equip-check">
                        {eq.ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      </span>
                      <span className="fiche-vehicule__equip-icone">{eq.icone}</span>
                      {eq.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Séparateur or */}
              <div className="fiche-vehicule__separateur" />

              {/* CTA */}
              <div className="fiche-vehicule__actions">
                {disponible ? (
                  <Link
                    to={`/reservation/${vehicule.id}`}
                    className="btn btn--primaire btn--grand fiche-vehicule__cta"
                  >
                    <Calendar size={16} /> Réserver ce véhicule
                  </Link>
                ) : (
                  <button
                    className="btn btn--primaire btn--grand fiche-vehicule__cta"
                    disabled
                    style={{ opacity: 0.4, cursor: 'not-allowed' }}
                  >
                    Véhicule indisponible
                  </button>
                )}
                <Link to="/catalogue" className="fiche-vehicule__lien-retour">
                  Voir d&apos;autres véhicules <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default FicheVehicule
