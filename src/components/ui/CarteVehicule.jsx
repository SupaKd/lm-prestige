import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Fuel, Settings, ArrowRight } from 'lucide-react'

// Carte véhicule
// — hover : lift + overlay sombre sur l'image + bouton visible
// — shimmer si image non encore chargée
function CarteVehicule({ vehicule }) {
  const { id, nom, categorie, prix_jour, places, transmission, carburant, disponible, images } = vehicule
  const [imageChargee, setImageChargee] = useState(false)

  return (
    <article className={`carte-vehicule${!disponible ? ' carte-vehicule--indisponible' : ''}`}>
      {/* Image */}
      <div className="carte-vehicule__image">
        {/* Shimmer pendant le chargement */}
        {!imageChargee && <div className="carte-vehicule__shimmer" />}

        <img
          src={images[0]}
          alt={nom}
          loading="lazy"
          onLoad={() => setImageChargee(true)}
          style={{ opacity: imageChargee ? 1 : 0 }}
        />

        {/* Overlay au hover avec bouton rapide */}
        <div className="carte-vehicule__overlay">
          {disponible && (
            <Link to={`/vehicule/${id}`} className="carte-vehicule__overlay-btn">
              Voir le véhicule <ArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="carte-vehicule__badge-dispo">
          <span className={`badge badge--${disponible ? 'disponible' : 'indisponible'}`}>
            {disponible ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="carte-vehicule__contenu">
        <div className="carte-vehicule__categorie">{categorie}</div>
        <h3 className="carte-vehicule__nom">{nom}</h3>

        <div className="carte-vehicule__specs">
          <span className="carte-vehicule__spec">
            <Users size={13} /> {places} places
          </span>
          <span className="carte-vehicule__spec">
            <Settings size={13} /> {transmission}
          </span>
          <span className="carte-vehicule__spec">
            <Fuel size={13} /> {carburant}
          </span>
        </div>

        <div className="carte-vehicule__bas">
          <div className="carte-vehicule__prix">
            {prix_jour}€ <span>/ jour</span>
          </div>
          <Link
            to={`/vehicule/${id}`}
            className="btn btn--primaire carte-vehicule__btn"
          >
            Voir <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default CarteVehicule
