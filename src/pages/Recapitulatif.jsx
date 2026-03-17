import { useEffect, useRef, useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Car, CalendarDays, MapPin, User, Phone, Mail } from 'lucide-react'

const genererRef = () => {
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const N = '0123456789'
  const p1 = Array.from({ length: 3 }, () => L[Math.floor(Math.random() * L.length)]).join('')
  const p2 = Array.from({ length: 4 }, () => N[Math.floor(Math.random() * N.length)]).join('')
  return `${p1}-${p2}`
}

const formaterDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

// Confetti léger — petits cercles qui tombent
function Confetti() {
  const particules = useMemo(() => (
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      duree: 1.4 + Math.random() * 1,
      taille: 5 + Math.random() * 6,
      couleur: ['#0075EB', '#00b386', '#f5a623', '#191c1f', '#a855f7'][Math.floor(Math.random() * 5)],
    }))
  ), [])

  return (
    <div className="confetti" aria-hidden="true">
      {particules.map((p) => (
        <span
          key={p.id}
          className="confetti__particule"
          style={{
            left: `${p.x}%`,
            width: p.taille,
            height: p.taille,
            backgroundColor: p.couleur,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duree}s`,
          }}
        />
      ))}
    </div>
  )
}

function Recapitulatif() {
  const location = useLocation()
  const { vehicule, reservation } = location.state || {}
  const wrapperRef = useRef(null)
  // Référence stable (ne change pas entre les renders)
  const reference = useMemo(() => genererRef(), [])

  // Entrée en scène des blocs
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    requestAnimationFrame(() => el.classList.add('recapitulatif__wrapper--visible'))
  }, [])

  if (!vehicule || !reservation) {
    return (
      <main className="page">
        <div className="conteneur" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <h2>Aucune réservation en cours</h2>
          <p style={{ marginTop: '1rem', color: '#72777a' }}>
            Veuillez sélectionner un véhicule et remplir le formulaire.
          </p>
          <Link to="/catalogue" className="btn btn--primaire" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Voir les véhicules
          </Link>
        </div>
      </main>
    )
  }

  const lignes = [
    { icone: <Car size={13} />,         label: 'Véhicule',              valeur: vehicule.nom },
    { icone: <CalendarDays size={13} />, label: 'Départ',               valeur: formaterDate(reservation.dateDebut) },
    { icone: <CalendarDays size={13} />, label: 'Retour',               valeur: formaterDate(reservation.dateFin) },
    { icone: null,                        label: 'Durée',               valeur: `${reservation.nbJours} jour${reservation.nbJours > 1 ? 's' : ''}` },
    { icone: <MapPin size={13} />,        label: 'Lieu de prise',       valeur: reservation.lieu },
    { icone: <User size={13} />,          label: 'Client',              valeur: `${reservation.prenom} ${reservation.nom}` },
    { icone: <Phone size={13} />,         label: 'Téléphone',           valeur: reservation.telephone },
    { icone: <Mail size={13} />,          label: 'Email',               valeur: reservation.email },
  ]

  return (
    <main className="page">
      <div className="conteneur">
        <section className="recapitulatif">
          {/* Confetti */}
          <Confetti />

          <div className="recapitulatif__wrapper" ref={wrapperRef}>

            {/* Confirmation */}
            <div className="recapitulatif__confirmation recapitulatif__bloc">
              <div className="recapitulatif__icone">
                <CheckCircle size={38} strokeWidth={1.5} />
              </div>
              <h1 className="recapitulatif__titre">Réservation confirmée !</h1>
              <p className="recapitulatif__message">
                Merci <strong>{reservation.prenom}</strong> ! Votre demande a bien été enregistrée.
                <br />
                Notre équipe vous contactera dans les plus brefs délais.
              </p>
              <div className="recapitulatif__ref">
                Référence : <span>#{reference}</span>
              </div>
            </div>

            {/* Détails */}
            <div className="recapitulatif__details recapitulatif__bloc" style={{ '--bd': '0.15s' }}>
              <div className="recapitulatif__details-titre">Détails de la réservation</div>
              <div className="recapitulatif__details-corps">
                {lignes.map((l, i) => (
                  <div
                    key={i}
                    className="recapitulatif__detail-ligne recapitulatif__detail-ligne--anime"
                    style={{ '--li': i }}
                  >
                    <span className="detail-label">
                      {l.icone && <span style={{ marginRight: '0.3rem', verticalAlign: 'middle' }}>{l.icone}</span>}
                      {l.label}
                    </span>
                    <span className="detail-valeur">{l.valeur}</span>
                  </div>
                ))}
              </div>
              <div className="recapitulatif__total-ligne">
                <span className="total-label">Total estimé</span>
                <span className="total-montant">{reservation.total}€</span>
              </div>
            </div>

            {/* Note */}
            <div className="recapitulatif__note recapitulatif__bloc" style={{ '--bd': '0.28s' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>
                Cette confirmation est une simulation — aucun paiement n&apos;a été effectué.
                Vous serez recontacté par téléphone ou email pour valider la location.
              </span>
            </div>

            {/* Actions */}
            <div className="recapitulatif__actions recapitulatif__bloc" style={{ '--bd': '0.38s' }}>
              <Link to="/catalogue" className="btn btn--primaire">Voir d&apos;autres véhicules</Link>
              <Link to="/" className="btn btn--secondaire">Retour à l&apos;accueil</Link>
            </div>

          </div>
        </section>
      </div>
    </main>
  )
}

export default Recapitulatif
