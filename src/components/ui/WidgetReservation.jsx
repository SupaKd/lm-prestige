import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, MapPin, ArrowRight, X } from 'lucide-react'
import { lieux } from '../../data/data'
import { usePrefill } from '../../context/ReservationContext'

const fmt = (d) => d
  ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  : null

const MOIS_NOM = ['Janvier','Février','Mars','Avril','Mai','Juin',
                  'Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const JOURS    = ['L','M','M','J','V','S','D']

function ModalCalendrier({ etape, onFermer, onJour, dateDebut, dateFin }) {
  const [moisIdx, setMoisIdx] = useState(0)

  const aujourd_hui = new Date()
  aujourd_hui.setHours(0, 0, 0, 0)

  const moisAffiche = new Date(
    aujourd_hui.getFullYear(),
    aujourd_hui.getMonth() + moisIdx,
    1
  )
  const annee = moisAffiche.getFullYear()
  const mois  = moisAffiche.getMonth()

  const joursAffichés = () => {
    const premier  = new Date(annee, mois, 1)
    const dernier  = new Date(annee, mois + 1, 0)
    const debutPad = (premier.getDay() + 6) % 7
    const jours    = []
    for (let i = 0; i < debutPad; i++) jours.push(null)
    for (let j = 1; j <= dernier.getDate(); j++) jours.push(new Date(annee, mois, j))
    return jours
  }

  const memeJour = (a, b) => a && b && a.toDateString() === b.toDateString()
  const dansPl   = (j) => j && dateDebut && dateFin && j > dateDebut && j < dateFin

  return createPortal(
    <div className="wcal-overlay" onClick={onFermer}>
      <div className="wcal-modal" onClick={(e) => e.stopPropagation()}>

        <div className="wcal-modal__header">
          <span className="wcal-modal__titre">
            {etape === 'debut' ? 'Date de départ' : 'Date de retour'}
          </span>
          <button type="button" className="wcal-modal__close" onClick={onFermer}>
            <X size={16} />
          </button>
        </div>

        <div className="wcal-modal__nav">
          <button
            type="button"
            className="wcal-modal__nav-btn"
            onClick={() => setMoisIdx((m) => m - 1)}
            disabled={moisIdx === 0}
          >‹</button>
          <span className="wcal-modal__mois">{MOIS_NOM[mois]} {annee}</span>
          <button
            type="button"
            className="wcal-modal__nav-btn"
            onClick={() => setMoisIdx((m) => m + 1)}
          >›</button>
        </div>

        <div className="wcal-modal__grille">
          {JOURS.map((j, i) => (
            <div key={i} className="wcal-modal__entete">{j}</div>
          ))}
          {joursAffichés().map((jour, i) => {
            if (!jour) return <div key={`p${i}`} />
            const passe = jour < aujourd_hui
            const debut = memeJour(jour, dateDebut)
            const fin   = memeJour(jour, dateFin)
            const dans  = dansPl(jour)
            let cls = 'wcal-modal__jour'
            if (passe) cls += ' wcal-modal__jour--passe'
            if (debut) cls += ' wcal-modal__jour--debut'
            if (fin)   cls += ' wcal-modal__jour--fin'
            if (dans)  cls += ' wcal-modal__jour--dans'
            return (
              <button
                key={jour.toISOString()}
                type="button"
                className={cls}
                onClick={() => onJour(jour)}
                disabled={passe}
              >
                {jour.getDate()}
              </button>
            )
          })}
        </div>

      </div>
    </div>,
    document.body
  )
}

function WidgetReservation() {
  const navigate = useNavigate()
  const { setPrefill } = usePrefill()

  const [dateDebut, setDateDebut] = useState(null)
  const [dateFin,   setDateFin]   = useState(null)
  const [lieu,      setLieu]      = useState('')
  const [etapeCal,  setEtapeCal]  = useState(null)

  const ouvrirCal = (etape) => setEtapeCal(etape === etapeCal ? null : etape)

  const clicJour = (jour) => {
    const aujourd_hui = new Date()
    aujourd_hui.setHours(0, 0, 0, 0)
    if (!jour || jour < aujourd_hui) return
    if (etapeCal === 'debut') {
      setDateDebut(jour)
      setDateFin(null)
      setEtapeCal('fin')
    } else if (etapeCal === 'fin') {
      if (jour <= dateDebut) { setDateDebut(jour); setDateFin(null) }
      else { setDateFin(jour); setEtapeCal(null) }
    }
  }

  const lancerRecherche = () => {
    if (!dateDebut || !dateFin) { ouvrirCal('debut'); return }
    setPrefill({ dateDebut, dateFin, lieu })
    navigate('/catalogue')
  }

  const nbJours = dateDebut && dateFin
    ? Math.ceil((dateFin - dateDebut) / 86400000)
    : 0

  return (
    <>
      <div className="widget">
        <div className="widget__champs">

          <button
            type="button"
            className={`widget__champ${etapeCal === 'debut' ? ' widget__champ--actif' : ''}`}
            onClick={() => ouvrirCal('debut')}
          >
            <CalendarDays size={15} className="widget__champ-icone" />
            <div className="widget__champ-corps">
              <span className="widget__champ-label">Départ</span>
              <span className={`widget__champ-valeur${dateDebut ? ' widget__champ-valeur--rempli' : ''}`}>
                {fmt(dateDebut) || 'Choisir'}
              </span>
            </div>
          </button>

          <div className="widget__sep" />

          <button
            type="button"
            className={`widget__champ${etapeCal === 'fin' ? ' widget__champ--actif' : ''}`}
            onClick={() => ouvrirCal('fin')}
          >
            <CalendarDays size={15} className="widget__champ-icone" />
            <div className="widget__champ-corps">
              <span className="widget__champ-label">Retour</span>
              <span className={`widget__champ-valeur${dateFin ? ' widget__champ-valeur--rempli' : ''}`}>
                {fmt(dateFin) || 'Choisir'}
              </span>
            </div>
          </button>

          <div className="widget__sep" />

          <div className="widget__champ widget__champ--lieu">
            <MapPin size={15} className="widget__champ-icone" />
            <div className="widget__champ-corps">
              <span className="widget__champ-label">Lieu</span>
              <select
                className="widget__select"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
              >
                <option value="">Tous les lieux</option>
                {lieux.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <button type="button" className="widget__btn" onClick={lancerRecherche}>
            <ArrowRight size={17} />
            {nbJours > 0 ? 'Voir les véhicules' : 'Rechercher'}
          </button>
        </div>

        {nbJours > 0 && (
          <div className="widget__duree">
            {nbJours} jour{nbJours > 1 ? 's' : ''} sélectionné{nbJours > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {etapeCal && (
        <ModalCalendrier
          etape={etapeCal}
          onFermer={() => setEtapeCal(null)}
          onJour={clicJour}
          dateDebut={dateDebut}
          dateFin={dateFin}
        />
      )}
    </>
  )
}

export default WidgetReservation
