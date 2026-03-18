import { useEffect, useRef, useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Car, CalendarDays, MapPin, User, Phone, Mail, ArrowRight } from 'lucide-react'

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

// Confetti or & noir — généré une seule fois hors du composant
const COULEURS_CONFETTI = ['#C9A84C', '#0a0a0a', '#F5F0E8', '#a8873c', '#e8e0d0']
const PARTICULES_CONFETTI = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 1.4,
  duree: 1.6 + Math.random() * 1.2,
  taille: 4 + Math.random() * 6,
  couleur: COULEURS_CONFETTI[Math.floor(Math.random() * COULEURS_CONFETTI.length)],
}))

function Confetti() {
  const particules = PARTICULES_CONFETTI

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
  const reference = useMemo(() => genererRef(), [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    requestAnimationFrame(() => el.classList.add('recap-ticket--visible'))
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

  const lignesReservation = [
    { icone: <Car size={13} />,         label: 'Véhicule',        valeur: vehicule.nom },
    { icone: <CalendarDays size={13} />, label: 'Départ',          valeur: formaterDate(reservation.dateDebut) },
    { icone: <CalendarDays size={13} />, label: 'Retour',          valeur: formaterDate(reservation.dateFin) },
    { icone: null,                        label: 'Durée',           valeur: `${reservation.nbJours} jour${reservation.nbJours > 1 ? 's' : ''}` },
    { icone: <MapPin size={13} />,        label: 'Lieu de prise',  valeur: reservation.lieu },
  ]

  const lignesClient = [
    { icone: <User size={13} />,  label: 'Client',     valeur: `${reservation.prenom} ${reservation.nom}` },
    { icone: <Phone size={13} />, label: 'Téléphone',  valeur: reservation.telephone },
    { icone: <Mail size={13} />,  label: 'Email',      valeur: reservation.email },
  ]

  return (
    <main className="page recap-page" style={{ background: '#F8F6F2' }}>
      <Confetti />

      <div className="conteneur">
        <div className="recap-ticket" ref={wrapperRef}>

          {/* ── Souche haute — confirmation ── */}
          <div className="recap-ticket__haut">
            <div className="recap-ticket__check">
              <CheckCircle size={32} strokeWidth={1.5} />
            </div>
            <p className="recap-ticket__surtitle">Demande enregistrée</p>
            <h1 className="recap-ticket__titre">
              Réservation <span>confirmée</span>
            </h1>
            <p className="recap-ticket__message">
              Merci <strong>{reservation.prenom}</strong> ! Notre équipe vous contactera dans les plus brefs délais pour valider votre location.
            </p>
            <div className="recap-ticket__ref">
              <span className="recap-ticket__ref-label">Référence</span>
              <span className="recap-ticket__ref-num">#{reference}</span>
            </div>
          </div>

          {/* ── Découpe ── */}
          <div className="recap-ticket__decoupe">
            <div className="recap-ticket__decoupe-cercle recap-ticket__decoupe-cercle--gauche" />
            <div className="recap-ticket__decoupe-ligne" />
            <div className="recap-ticket__decoupe-cercle recap-ticket__decoupe-cercle--droite" />
          </div>

          {/* ── Souche basse — détails ── */}
          <div className="recap-ticket__bas">

            <div className="recap-ticket__cols">
              {/* Colonne réservation */}
              <div className="recap-ticket__col">
                <div className="recap-ticket__col-titre">Réservation</div>
                {lignesReservation.map((l, i) => (
                  <div key={i} className="recap-ticket__ligne" style={{ '--li': i }}>
                    <span className="recap-ticket__ligne-label">
                      {l.icone && <span className="recap-ticket__ligne-icone">{l.icone}</span>}
                      {l.label}
                    </span>
                    <span className="recap-ticket__ligne-valeur">{l.valeur}</span>
                  </div>
                ))}
              </div>

              {/* Séparateur vertical */}
              <div className="recap-ticket__col-sep" />

              {/* Colonne client */}
              <div className="recap-ticket__col">
                <div className="recap-ticket__col-titre">Client</div>
                {lignesClient.map((l, i) => (
                  <div key={i} className="recap-ticket__ligne" style={{ '--li': i + 5 }}>
                    <span className="recap-ticket__ligne-label">
                      {l.icone && <span className="recap-ticket__ligne-icone">{l.icone}</span>}
                      {l.label}
                    </span>
                    <span className="recap-ticket__ligne-valeur">{l.valeur}</span>
                  </div>
                ))}

                {/* Total */}
                <div className="recap-ticket__total">
                  <span className="recap-ticket__total-label">Total estimé</span>
                  <span className="recap-ticket__total-montant">{reservation.total}€</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="recap-ticket__note">
              <AlertCircle size={13} />
              <span>Simulation — aucun paiement effectué. Vous serez recontacté pour valider la location.</span>
            </div>

            {/* Actions */}
            <div className="recap-ticket__actions">
              <Link to="/catalogue" className="btn btn--primaire">
                Voir d&apos;autres véhicules <ArrowRight size={14} />
              </Link>
              <Link to="/" className="btn btn--secondaire">
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

export default Recapitulatif
