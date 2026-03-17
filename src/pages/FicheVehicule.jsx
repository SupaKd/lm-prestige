import { useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Users, Fuel, Settings, Gauge, Thermometer,
  Navigation, Bluetooth, CheckCircle, XCircle, Calendar
} from 'lucide-react'
import { vehicules } from '../data/data'
import Galerie from '../components/ui/Galerie'

function FicheVehicule() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)

  const vehicule = vehicules.find((v) => v.id === parseInt(id))

  // Anime l'entrée de la page
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
    { icone: <Users size={15} />, label: `${places} places` },
    { icone: <Settings size={15} />, label: transmission },
    { icone: <Fuel size={15} />, label: carburant },
    { icone: <Gauge size={15} />, label: caracteristiques.puissance },
  ]

  const equipements = [
    { icone: <Thermometer size={14} />, label: 'Climatisation', ok: caracteristiques.climatisation },
    { icone: <Navigation size={14} />, label: 'GPS intégré', ok: caracteristiques.gps },
    { icone: <Bluetooth size={14} />, label: 'Bluetooth', ok: caracteristiques.bluetooth },
  ]

  return (
    <main className="page">
      <div className="conteneur">
        <section className="fiche-vehicule" ref={pageRef}>
          {/* Retour */}
          <div className="fiche-vehicule__retour">
            <button
              onClick={() => navigate(-1)}
              className="btn btn--secondaire"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={14} /> Retour
            </button>
          </div>

          <div className="fiche-vehicule__grille">
            {/* Galerie */}
            <div className="fiche-vehicule__galerie fiche-vehicule__bloc">
              <Galerie images={images} nom={nom} />
            </div>

            {/* Infos */}
            <div className="fiche-vehicule__infos fiche-vehicule__bloc" style={{ '--delay': '0.1s' }}>
              <div className="fiche-vehicule__categorie">{categorie}</div>
              <h1 className="fiche-vehicule__nom">{nom}</h1>

              <div className="fiche-vehicule__dispo">
                <span className={`badge badge--${disponible ? 'disponible' : 'indisponible'}`}>
                  {disponible ? 'Disponible à la location' : 'Actuellement indisponible'}
                </span>
              </div>

              <div className="fiche-vehicule__prix-bloc">
                <span className="fiche-vehicule__prix">{prix_jour}€</span>
                <span className="fiche-vehicule__prix-label">par jour · TTC</span>
              </div>

              <p className="fiche-vehicule__description">{description}</p>

              {/* Specs en cascade */}
              <h3 className="fiche-vehicule__section-titre">Caractéristiques</h3>
              <div className="fiche-vehicule__specs-grille">
                {specs.map((s, i) => (
                  <div
                    key={i}
                    className="fiche-vehicule__spec-item fiche-vehicule__spec-item--anime"
                    style={{ '--si': i }}
                  >
                    <span className="fiche-vehicule__spec-icone">{s.icone}</span>
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Équipements en cascade */}
              <h3 className="fiche-vehicule__section-titre">Équipements</h3>
              <div className="fiche-vehicule__options">
                {equipements.map((eq, i) => (
                  <div
                    key={i}
                    className={`fiche-vehicule__option fiche-vehicule__option--${eq.ok ? 'ok' : 'non'} fiche-vehicule__option--anime`}
                    style={{ '--oi': i }}
                  >
                    {eq.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
                    {eq.icone} {eq.label}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="fiche-vehicule__actions">
                {disponible ? (
                  <Link to={`/reservation/${vehicule.id}`} className="btn btn--primaire btn--grand">
                    <Calendar size={17} /> Réserver ce véhicule
                  </Link>
                ) : (
                  <button className="btn btn--primaire btn--grand" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                    Véhicule indisponible
                  </button>
                )}
                <Link to="/catalogue" className="btn btn--secondaire">
                  Voir d&apos;autres véhicules
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default FicheVehicule
