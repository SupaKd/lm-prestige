import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Fuel, Settings, ArrowRight } from 'lucide-react'

function CarteVehicule({ vehicule, index = 0 }) {
  const { id, nom, categorie, prix_jour, places, transmission, carburant, disponible, populaire, images } = vehicule
  const [imageChargee, setImageChargee] = useState(false)

  return (
    <article className={`carte-vehicule${!disponible ? ' carte-vehicule--indisponible' : ''}`}>
      <span className="carte-vehicule__index">{String(index + 1).padStart(2, '0')}</span>
      {/* Image */}
      <div className="carte-vehicule__image">
        {!imageChargee && <div className="carte-vehicule__shimmer" />}

        <img
          src={images[0]}
          alt={nom}
          loading="lazy"
          onLoad={() => setImageChargee(true)}
          style={{ opacity: imageChargee ? 1 : 0 }}
        />

        {/* Overlay hover */}
        <div className="carte-vehicule__overlay">
          {disponible && (
            <Link to={`/vehicule/${id}`} className="carte-vehicule__overlay-btn">
              Réserver <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {/* Badge populaire */}
        {populaire && (
          <div className="carte-vehicule__badge-populaire">
            <span className="badge badge--populaire">⚡ Populaire</span>
          </div>
        )}

        {/* Badge dispo */}
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
            <Users size={12} /> {places} places
          </span>
          <span className="carte-vehicule__spec">
            <Settings size={12} /> {transmission}
          </span>
          <span className="carte-vehicule__spec">
            <Fuel size={12} /> {carburant}
          </span>
        </div>

        <div className="carte-vehicule__bas">
          <div className="carte-vehicule__prix">
            {prix_jour}€ <span>/ jour</span>
          </div>
          <Link
            to={`/vehicule/${id}`}
            className="btn btn--secondaire carte-vehicule__btn"
          >
            Voir <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default CarteVehicule
