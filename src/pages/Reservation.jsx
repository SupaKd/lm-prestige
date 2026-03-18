import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, User, MapPin, CheckCircle, ChevronUp, ChevronDown, Calendar } from 'lucide-react'
import { vehicules, lieux } from '../data/data'
import Calendrier from '../components/ui/Calendrier'
import { useToast } from '../components/ui/Toast'
import { usePrefill } from '../context/ReservationContext'

function Reservation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const { prefill } = usePrefill()

  const [etape, setEtape] = useState(1)
  const [dates, setDates] = useState({
    dateDebut: prefill.dateDebut ?? null,
    dateFin:   prefill.dateFin   ?? null,
  })
  const [form, setForm] = useState({ lieu: prefill.lieu ?? '', nom: '', prenom: '', telephone: '', email: '' })
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [bottomSheetOuverte, setBottomSheetOuverte] = useState(false)
  const toast = useToast()

  const vehicule = vehicules.find((v) => v.id === parseInt(id))

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    requestAnimationFrame(() => el.classList.add('resa-page--visible'))
  }, [])

  if (!vehicule) {
    return (
      <main className="page">
        <div className="conteneur" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <h2>Véhicule introuvable</h2>
          <Link to="/catalogue" className="btn btn--primaire" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Retour au catalogue
          </Link>
        </div>
      </main>
    )
  }

  const { dateDebut, dateFin } = dates
  const nbJours = dateDebut && dateFin
    ? Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24))
    : 0
  const total = nbJours * vehicule.prix_jour

  const changerChamp = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (erreurs[name]) setErreurs((prev) => ({ ...prev, [name]: '' }))
  }

  const validerEtape1 = () => {
    const e = {}
    if (!dateDebut) e.dates = 'Sélectionnez une date de départ'
    if (!dateFin)   e.dates = 'Sélectionnez aussi une date de retour'
    if (!form.lieu) e.lieu  = 'Choisissez un lieu de prise en charge'
    return e
  }

  const validerEtape2 = () => {
    const e = {}
    if (!form.nom)       e.nom       = 'Nom requis'
    if (!form.prenom)    e.prenom    = 'Prénom requis'
    if (!form.telephone) e.telephone = 'Téléphone requis'
    if (!form.email)     e.email     = 'Email requis'
    return e
  }

  const passerEtape2 = () => {
    const e = validerEtape1()
    if (Object.keys(e).length > 0) { setErreurs(e); toast('Veuillez remplir tous les champs requis.', 'erreur'); return }
    setErreurs({})
    toast('Dates et lieu confirmés !', 'succes')
    setEtape(2)
  }

  const soumettre = (ev) => {
    ev.preventDefault()
    const e = validerEtape2()
    if (Object.keys(e).length > 0) { setErreurs(e); toast('Veuillez remplir tous les champs requis.', 'erreur'); return }
    setEnvoi(true)
    toast('Réservation en cours…', 'info')
    setTimeout(() => {
      navigate('/recapitulatif', {
        state: {
          vehicule,
          reservation: {
            ...form,
            dateDebut: dateDebut.toISOString().split('T')[0],
            dateFin:   dateFin.toISOString().split('T')[0],
            nbJours,
            total,
          },
        },
      })
    }, 900)
  }

  return (
    <main className="page resa-page" ref={pageRef} style={{ background: '#F8F6F2' }}>

      {/* ── Split layout ── */}
      <div className="resa-split">

        {/* ── Colonne gauche — photo sticky ── */}
        <div className="resa-gauche">
          <div className="resa-gauche__photo-wrap">
            <img src={vehicule.images[0]} alt={vehicule.nom} className="resa-gauche__photo" />
            <div className="resa-gauche__overlay" />
          </div>

          {/* Retour en haut */}
          <button
            onClick={() => etape === 2 ? setEtape(1) : navigate(-1)}
            className="resa-gauche__retour"
          >
            <ArrowLeft size={14} /> {etape === 2 ? 'Étape précédente' : 'Retour'}
          </button>

          {/* Infos véhicule en bas */}
          <div className="resa-gauche__infos">
            <div className="resa-gauche__categorie">{vehicule.categorie}</div>
            <h2 className="resa-gauche__nom">{vehicule.nom}</h2>
            <div className="resa-gauche__separateur" />
            <div className="resa-gauche__prix-wrap">
              <span className="resa-gauche__prix">{vehicule.prix_jour}€</span>
              <span className="resa-gauche__prix-label">/ jour · TTC</span>
            </div>
            {total > 0 && (
              <div className="resa-gauche__total">
                <span>{nbJours} jour{nbJours > 1 ? 's' : ''}</span>
                <span className="resa-gauche__total-montant">{total}€ total</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Colonne droite — formulaire ── */}
        <div className="resa-droite">
          {/* En-tête mobile — nom + prix */}
          <div className="resa-mobile-header">
            <span className="resa-mobile-header__nom">{vehicule.nom}</span>
            <span className="resa-mobile-header__prix">
              {vehicule.prix_jour}€ <span>/ jour</span>
            </span>
          </div>
          <div className="resa-droite__inner">

            {/* Stepper */}
            <div className="resa-stepper">
              <div className={`resa-stepper__etape${etape >= 1 ? ' resa-stepper__etape--actif' : ''}${etape > 1 ? ' resa-stepper__etape--fait' : ''}`}>
                <div className="resa-stepper__cercle">
                  {etape > 1 ? <CheckCircle size={13} /> : 1}
                </div>
                <span className="resa-stepper__label">Dates & lieu</span>
              </div>

              <div className="resa-stepper__ligne">
                <div className="resa-stepper__ligne-inner" style={{ width: etape > 1 ? '100%' : '0%' }} />
              </div>

              <div className={`resa-stepper__etape${etape >= 2 ? ' resa-stepper__etape--actif' : ''}`}>
                <div className="resa-stepper__cercle">
                  {etape > 2 ? <CheckCircle size={13} /> : 2}
                </div>
                <span className="resa-stepper__label">Vos informations</span>
              </div>
            </div>

            {/* ── Étape 1 ── */}
            <form onSubmit={soumettre} noValidate>
              <div className={`resa-panel${etape === 1 ? ' resa-panel--actif' : ''}`}>
                <h1 className="resa-droite__titre">
                  <span className="resa-droite__titre-num">01</span>
                  Choisissez vos dates
                </h1>

                <Calendrier
                  dateDebut={dateDebut}
                  dateFin={dateFin}
                  onChange={(val) => {
                    setDates(val)
                    if (erreurs.dates) setErreurs((prev) => ({ ...prev, dates: '' }))
                  }}
                />
                {erreurs.dates && <p className="resa-erreur">{erreurs.dates}</p>}

                <div className="resa-groupe" style={{ marginTop: '2rem' }}>
                  <label className="resa-label" htmlFor="lieu">
                    <MapPin size={12} /> Lieu de prise en charge
                  </label>
                  <select
                    id="lieu" name="lieu" value={form.lieu} onChange={changerChamp}
                    className={`resa-select${erreurs.lieu ? ' resa-input--erreur' : ''}`}
                  >
                    <option value="">Sélectionner un lieu</option>
                    {lieux.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {erreurs.lieu && <p className="resa-erreur">{erreurs.lieu}</p>}
                </div>

                <button
                  type="button"
                  className="btn btn--primaire resa-submit"
                  onClick={passerEtape2}
                  disabled={!dateDebut || !dateFin}
                >
                  <Calendar size={15} /> Continuer
                </button>
              </div>

              {/* ── Étape 2 ── */}
              <div className={`resa-panel${etape === 2 ? ' resa-panel--actif' : ''}`}>
                <h1 className="resa-droite__titre">
                  <span className="resa-droite__titre-num">02</span>
                  Vos informations
                </h1>

                <div className="resa-ligne">
                  <div className="resa-groupe">
                    <label className="resa-label" htmlFor="nom">Nom</label>
                    <input
                      type="text" id="nom" name="nom" value={form.nom}
                      onChange={changerChamp} placeholder="Dupont"
                      className={`resa-input${erreurs.nom ? ' resa-input--erreur' : ''}`}
                    />
                    {erreurs.nom && <p className="resa-erreur">{erreurs.nom}</p>}
                  </div>
                  <div className="resa-groupe">
                    <label className="resa-label" htmlFor="prenom">Prénom</label>
                    <input
                      type="text" id="prenom" name="prenom" value={form.prenom}
                      onChange={changerChamp} placeholder="Jean"
                      className={`resa-input${erreurs.prenom ? ' resa-input--erreur' : ''}`}
                    />
                    {erreurs.prenom && <p className="resa-erreur">{erreurs.prenom}</p>}
                  </div>
                </div>

                <div className="resa-groupe">
                  <label className="resa-label" htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel" id="telephone" name="telephone" value={form.telephone}
                    onChange={changerChamp} placeholder="+33 6 XX XX XX XX"
                    className={`resa-input${erreurs.telephone ? ' resa-input--erreur' : ''}`}
                  />
                  {erreurs.telephone && <p className="resa-erreur">{erreurs.telephone}</p>}
                </div>

                <div className="resa-groupe">
                  <label className="resa-label" htmlFor="email">Email</label>
                  <input
                    type="email" id="email" name="email" value={form.email}
                    onChange={changerChamp} placeholder="jean.dupont@email.com"
                    className={`resa-input${erreurs.email ? ' resa-input--erreur' : ''}`}
                  />
                  {erreurs.email && <p className="resa-erreur">{erreurs.email}</p>}
                </div>

                {/* Récap compact avant confirmation */}
                <div className="resa-recap">
                  <div className="resa-recap__ligne">
                    <span>Départ</span>
                    <span>{dateDebut?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="resa-recap__ligne">
                    <span>Retour</span>
                    <span>{dateFin?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="resa-recap__ligne">
                    <span>Lieu</span>
                    <span>{form.lieu}</span>
                  </div>
                  <div className="resa-recap__ligne resa-recap__ligne--total">
                    <span>Total estimé</span>
                    <span>{total}€</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn btn--primaire resa-submit${envoi ? ' resa-submit--loading' : ''}`}
                  disabled={envoi}
                >
                  {envoi ? <span className="resa-spinner" /> : <><CheckCircle size={15} /> Confirmer la réservation</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom sheet mobile ── */}
      <div className={`resa-bottom-sheet${bottomSheetOuverte ? ' resa-bottom-sheet--ouverte' : ''}`}>
        <button
          type="button"
          className="resa-bottom-sheet__handle"
          onClick={() => setBottomSheetOuverte((v) => !v)}
          aria-label={bottomSheetOuverte ? 'Réduire' : 'Voir le résumé'}
        >
          <div className="resa-bottom-sheet__pill" />
          <div className="resa-bottom-sheet__header">
            <span className="resa-bottom-sheet__nom">{vehicule.nom}</span>
            <span className={`resa-bottom-sheet__total${total > 0 ? ' resa-bottom-sheet__total--actif' : ''}`}>
              {total > 0 ? `${total}€` : `${vehicule.prix_jour}€/j`}
            </span>
            {bottomSheetOuverte ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </div>
        </button>
        <div className="resa-bottom-sheet__corps">
          {[
            { label: 'Tarif',  val: `${vehicule.prix_jour}€ / jour` },
            { label: 'Départ', val: dateDebut ? dateDebut.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—' },
            { label: 'Retour', val: dateFin   ? dateFin.toLocaleDateString('fr-FR',   { day: 'numeric', month: 'short' }) : '—' },
            { label: 'Durée',  val: nbJours > 0 ? `${nbJours} jour${nbJours > 1 ? 's' : ''}` : '—' },
            { label: 'Lieu',   val: form.lieu || '—' },
          ].map(({ label, val }) => (
            <div key={label} className="resa-bottom-sheet__ligne">
              <span>{label}</span><span>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Reservation
