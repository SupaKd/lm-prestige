import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, User, MapPin, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react'
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
  const [dates, setDates] = useState({ dateDebut: null, dateFin: null })
  const [form, setForm] = useState({ lieu: '', nom: '', prenom: '', telephone: '', email: '' })
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [bottomSheetOuverte, setBottomSheetOuverte] = useState(false)
  const toast = useToast()

  const vehicule = vehicules.find((v) => v.id === parseInt(id))

  // Pré-remplissage depuis le widget hero
  useEffect(() => {
    if (prefill.dateDebut || prefill.dateFin) {
      setDates({ dateDebut: prefill.dateDebut, dateFin: prefill.dateFin })
    }
    if (prefill.lieu) {
      setForm((prev) => ({ ...prev, lieu: prefill.lieu }))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    requestAnimationFrame(() => el.classList.add('reservation--visible'))
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
    <main className="page">
      <div className="conteneur">
        <section className="reservation" ref={pageRef}>

          {/* Header */}
          <div className="reservation__header">
            <button
              onClick={() => etape === 2 ? setEtape(1) : navigate(-1)}
              className="btn btn--secondaire"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={14} /> {etape === 2 ? 'Étape précédente' : 'Retour'}
            </button>
            <h1 className="titre-section" style={{ marginTop: '1rem' }}>
              Réserver — <span>{vehicule.nom}</span>
            </h1>

            {/* Stepper */}
            <div className="reservation__stepper">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className={`reservation__step${etape >= n ? ' reservation__step--actif' : ''}${etape > n ? ' reservation__step--fait' : ''}`}
                >
                  <div className="reservation__step-cercle">
                    {etape > n ? <CheckCircle size={14} /> : n}
                  </div>
                  <span>{n === 1 ? 'Dates & lieu' : 'Vos infos'}</span>
                </div>
              ))}
              <div className="reservation__step-ligne">
                <div className="reservation__step-ligne-inner" style={{ width: etape > 1 ? '100%' : '0%' }} />
              </div>
            </div>
          </div>

          <div className="reservation__grille">
            <form onSubmit={soumettre} noValidate>
              <div className="reservation__formulaire">

                {/* ── Étape 1 : Calendrier + lieu ── */}
                <div className={`reservation__etape-panel${etape === 1 ? ' reservation__etape-panel--actif' : ''}`}>
                  <h2 className="reservation__etape-titre" data-num="1">
                    Choisissez vos dates
                  </h2>

                  <Calendrier
                    dateDebut={dateDebut}
                    dateFin={dateFin}
                    onChange={(val) => {
                      setDates(val)
                      if (erreurs.dates) setErreurs((prev) => ({ ...prev, dates: '' }))
                    }}
                  />

                  {erreurs.dates && (
                    <div className="reservation__erreur" style={{ marginTop: '0.5rem' }}>
                      {erreurs.dates}
                    </div>
                  )}

                  {/* Lieu de prise en charge */}
                  <div className="reservation__groupe" style={{ marginTop: '2rem' }}>
                    <label htmlFor="lieu">
                      <MapPin size={12} style={{ verticalAlign: 'middle' }} /> Lieu de prise en charge *
                    </label>
                    <select
                      id="lieu" name="lieu" value={form.lieu} onChange={changerChamp}
                      className={erreurs.lieu ? 'input--erreur' : ''}
                    >
                      <option value="">Sélectionner un lieu</option>
                      {lieux.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {erreurs.lieu && <span className="reservation__erreur">{erreurs.lieu}</span>}
                  </div>

                  <button
                    type="button"
                    className="btn btn--primaire reservation__submit"
                    onClick={passerEtape2}
                    disabled={!dateDebut || !dateFin}
                  >
                    Continuer →
                  </button>
                </div>

                {/* ── Étape 2 : Infos client ── */}
                <div className={`reservation__etape-panel${etape === 2 ? ' reservation__etape-panel--actif' : ''}`}>
                  <h2 className="reservation__etape-titre" data-num="2">
                    <User size={15} /> Vos informations
                  </h2>

                  <div className="reservation__ligne">
                    <div className="reservation__groupe">
                      <label htmlFor="nom">Nom *</label>
                      <input type="text" id="nom" name="nom" value={form.nom}
                        onChange={changerChamp} placeholder="Dupont"
                        className={erreurs.nom ? 'input--erreur' : ''}
                      />
                      {erreurs.nom && <span className="reservation__erreur">{erreurs.nom}</span>}
                    </div>
                    <div className="reservation__groupe">
                      <label htmlFor="prenom">Prénom *</label>
                      <input type="text" id="prenom" name="prenom" value={form.prenom}
                        onChange={changerChamp} placeholder="Jean"
                        className={erreurs.prenom ? 'input--erreur' : ''}
                      />
                      {erreurs.prenom && <span className="reservation__erreur">{erreurs.prenom}</span>}
                    </div>
                  </div>

                  <div className="reservation__groupe">
                    <label htmlFor="telephone">Téléphone *</label>
                    <input type="tel" id="telephone" name="telephone" value={form.telephone}
                      onChange={changerChamp} placeholder="+33 6 XX XX XX XX"
                      className={erreurs.telephone ? 'input--erreur' : ''}
                    />
                    {erreurs.telephone && <span className="reservation__erreur">{erreurs.telephone}</span>}
                  </div>

                  <div className="reservation__groupe">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" value={form.email}
                      onChange={changerChamp} placeholder="jean.dupont@email.com"
                      className={erreurs.email ? 'input--erreur' : ''}
                    />
                    {erreurs.email && <span className="reservation__erreur">{erreurs.email}</span>}
                  </div>

                  <button
                    type="submit"
                    className={`btn btn--primaire reservation__submit${envoi ? ' reservation__submit--loading' : ''}`}
                    disabled={envoi}
                  >
                    {envoi ? <span className="reservation__spinner" /> : 'Confirmer la réservation →'}
                  </button>
                </div>

              </div>
            </form>

            {/* Résumé latéral — desktop uniquement */}
            <aside className="reservation__resume reservation__resume--desktop">
              <div className="reservation__resume-image">
                <img src={vehicule.images[0]} alt={vehicule.nom} />
              </div>
              <div className="reservation__resume-contenu">
                <div className="reservation__resume-vehicule">{vehicule.nom}</div>
                <div className="reservation__resume-ligne">
                  <span>Tarif</span>
                  <span>{vehicule.prix_jour}€ / jour</span>
                </div>
                <div className="reservation__resume-ligne">
                  <span>Départ</span>
                  <span className={dateDebut ? 'reservation__resume-valeur--actif' : ''}>
                    {dateDebut ? dateDebut.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
                <div className="reservation__resume-ligne">
                  <span>Retour</span>
                  <span className={dateFin ? 'reservation__resume-valeur--actif' : ''}>
                    {dateFin ? dateFin.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
                <div className="reservation__resume-ligne">
                  <span>Durée</span>
                  <span className={nbJours > 0 ? 'reservation__resume-valeur--actif' : ''}>
                    {nbJours > 0 ? `${nbJours} jour${nbJours > 1 ? 's' : ''}` : '—'}
                  </span>
                </div>
                <div className="reservation__resume-ligne">
                  <span>Lieu</span>
                  <span className={form.lieu ? 'reservation__resume-valeur--actif' : ''}>
                    {form.lieu || '—'}
                  </span>
                </div>
                <div className="reservation__resume-total">
                  <span className="label">Total estimé</span>
                  <span className={`montant${total > 0 ? ' montant--actif' : ''}`}>
                    {total > 0 ? `${total}€` : '—'}
                  </span>
                </div>
              </div>
            </aside>
          </div>

        </section>
      </div>

      {/* ── Bottom sheet résumé — mobile uniquement ── */}
      <div className={`reservation__bottom-sheet${bottomSheetOuverte ? ' reservation__bottom-sheet--ouverte' : ''}`}>
        {/* Handle + toggle */}
        <button
          type="button"
          className="reservation__bottom-sheet-handle"
          onClick={() => setBottomSheetOuverte((v) => !v)}
          aria-label={bottomSheetOuverte ? 'Réduire le résumé' : 'Voir le résumé'}
        >
          <div className="reservation__bottom-sheet-pill" />
          <div className="reservation__bottom-sheet-header">
            <span className="reservation__bottom-sheet-titre">{vehicule.nom}</span>
            <span className={`reservation__bottom-sheet-total${total > 0 ? ' reservation__bottom-sheet-total--actif' : ''}`}>
              {total > 0 ? `${total}€` : `${vehicule.prix_jour}€/j`}
            </span>
            {bottomSheetOuverte ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </button>

        {/* Contenu dépliable */}
        <div className="reservation__bottom-sheet-corps">
          <div className="reservation__bottom-sheet-lignes">
            {[
              { label: 'Tarif',  valeur: `${vehicule.prix_jour}€ / jour`, actif: true },
              { label: 'Départ', valeur: dateDebut ? dateDebut.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—', actif: !!dateDebut },
              { label: 'Retour', valeur: dateFin   ? dateFin.toLocaleDateString('fr-FR',   { day: 'numeric', month: 'short' }) : '—', actif: !!dateFin },
              { label: 'Durée',  valeur: nbJours > 0 ? `${nbJours} j` : '—', actif: nbJours > 0 },
              { label: 'Lieu',   valeur: form.lieu || '—', actif: !!form.lieu },
            ].map(({ label, valeur, actif }) => (
              <div key={label} className="reservation__bottom-sheet-ligne">
                <span>{label}</span>
                <span className={actif ? 'reservation__resume-valeur--actif' : ''}>{valeur}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Reservation
