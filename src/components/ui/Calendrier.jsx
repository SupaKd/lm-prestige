import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

// Retourne les jours à afficher dans un mois (avec padding lundi-based)
function joursduMois(annee, mois) {
  const premier = new Date(annee, mois, 1)
  const dernier = new Date(annee, mois + 1, 0)
  // Décalage lundi = 0
  const debutPad = (premier.getDay() + 6) % 7
  const jours = []
  for (let i = 0; i < debutPad; i++) jours.push(null)
  for (let j = 1; j <= dernier.getDate(); j++) jours.push(new Date(annee, mois, j))
  return jours
}

function memeJour(a, b) {
  if (!a || !b) return false
  return a.toDateString() === b.toDateString()
}

function entreLesDates(jour, debut, fin) {
  if (!debut || !fin || !jour) return false
  return jour > debut && jour < fin
}

// Un mois du calendrier
function MoisCalendrier({ annee, mois, dateDebut, dateFin, survol, onJourClick, onJourSurvol }) {
  const jours = useMemo(() => joursduMois(annee, mois), [annee, mois])
  const aujourd_hui = new Date()
  aujourd_hui.setHours(0, 0, 0, 0)

  // Fin "virtuelle" pour le hover avant sélection du retour
  const finAffichee = dateFin || survol

  return (
    <div className="calendrier__mois">
      <div className="calendrier__mois-titre">
        {MOIS[mois]} {annee}
      </div>
      <div className="calendrier__grille-jours">
        {JOURS.map((j) => (
          <div key={j} className="calendrier__entete-jour">{j}</div>
        ))}
        {jours.map((jour, i) => {
          if (!jour) return <div key={`pad-${i}`} />

          const estPasse = jour < aujourd_hui
          const estDebut = memeJour(jour, dateDebut)
          const estFin   = memeJour(jour, dateFin)
          const estDans  = entreLesDates(jour, dateDebut, finAffichee)
          const estSurvol = memeJour(jour, survol) && !dateFin && dateDebut

          let classes = 'calendrier__jour'
          if (estPasse)  classes += ' calendrier__jour--passe'
          if (estDebut)  classes += ' calendrier__jour--debut'
          if (estFin)    classes += ' calendrier__jour--fin'
          if (estDans)   classes += ' calendrier__jour--dans-plage'
          if (estSurvol) classes += ' calendrier__jour--survol'

          return (
            <button
              key={jour.toISOString()}
              className={classes}
              onClick={() => !estPasse && onJourClick(jour)}
              onMouseEnter={() => onJourSurvol(jour)}
              disabled={estPasse}
              type="button"
            >
              {jour.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Détecte si on est sur mobile (< 580px)
function useEstMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 580)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 579px)')
    const onChange = (e) => setMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return mobile
}

// Composant principal
function Calendrier({ dateDebut, dateFin, onChange }) {
  const aujourd_hui = new Date()
  const [moisActuel, setMoisActuel] = useState({
    annee: aujourd_hui.getFullYear(),
    mois: aujourd_hui.getMonth(),
  })
  const [survol, setSurvol] = useState(null)
  const estMobile = useEstMobile()

  // Mois suivant
  const moisSuivant = useMemo(() => {
    if (moisActuel.mois === 11)
      return { annee: moisActuel.annee + 1, mois: 0 }
    return { annee: moisActuel.annee, mois: moisActuel.mois + 1 }
  }, [moisActuel])

  const moisPrecedent = () => {
    setMoisActuel((m) => {
      if (m.mois === 0) return { annee: m.annee - 1, mois: 11 }
      return { annee: m.annee, mois: m.mois - 1 }
    })
  }

  const moisSuivantNav = () => {
    setMoisActuel((m) => {
      if (m.mois === 11) return { annee: m.annee + 1, mois: 0 }
      return { annee: m.annee, mois: m.mois + 1 }
    })
  }

  // On ne peut pas aller avant le mois actuel
  const peutReculer = moisActuel.annee > aujourd_hui.getFullYear() ||
    (moisActuel.annee === aujourd_hui.getFullYear() && moisActuel.mois > aujourd_hui.getMonth())

  // Swipe tactile sur mobile
  const touchStartX = useRef(null)
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -50) moisSuivantNav()
    else if (delta > 50 && peutReculer) moisPrecedent()
  }

  const onJourClick = (jour) => {
    if (!dateDebut || (dateDebut && dateFin)) {
      // Premier clic : sélectionne le départ, réinitialise le retour
      onChange({ dateDebut: jour, dateFin: null })
      setSurvol(null)
    } else {
      // Deuxième clic
      if (jour < dateDebut) {
        // Clic avant le départ → nouveau départ
        onChange({ dateDebut: jour, dateFin: null })
      } else if (memeJour(jour, dateDebut)) {
        // Clic sur le même jour → reset
        onChange({ dateDebut: null, dateFin: null })
      } else {
        onChange({ dateDebut, dateFin: jour })
        setSurvol(null)
      }
    }
  }

  const onJourSurvol = (jour) => {
    if (dateDebut && !dateFin) setSurvol(jour)
  }

  // Label d'instruction
  const instruction = !dateDebut
    ? 'Sélectionnez votre date de départ'
    : !dateFin
    ? 'Sélectionnez votre date de retour'
    : null

  return (
    <div
      className="calendrier"
      onMouseLeave={() => setSurvol(null)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Instruction */}
      {instruction && (
        <div className="calendrier__instruction">{instruction}</div>
      )}

      {/* Navigation mois — sur mobile : titre centré avec flèches de chaque côté */}
      <div className="calendrier__nav">
        <button
          type="button"
          className="calendrier__nav-btn"
          onClick={moisPrecedent}
          disabled={!peutReculer}
          aria-label="Mois précédent"
        >
          <ChevronLeft size={16} />
        </button>
        {estMobile && (
          <div className="calendrier__nav-titre">
            {`${['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'][moisActuel.mois]} ${moisActuel.annee}`}
          </div>
        )}
        <div className="calendrier__nav-spacer" />
        <button
          type="button"
          className="calendrier__nav-btn"
          onClick={moisSuivantNav}
          aria-label="Mois suivant"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Mobile : un seul mois — Desktop : deux mois côte à côte */}
      {estMobile ? (
        <div className="calendrier__simple">
          <MoisCalendrier
            annee={moisActuel.annee}
            mois={moisActuel.mois}
            dateDebut={dateDebut}
            dateFin={dateFin}
            survol={survol}
            onJourClick={onJourClick}
            onJourSurvol={onJourSurvol}
          />
        </div>
      ) : (
        <div className="calendrier__double">
          <MoisCalendrier
            annee={moisActuel.annee}
            mois={moisActuel.mois}
            dateDebut={dateDebut}
            dateFin={dateFin}
            survol={survol}
            onJourClick={onJourClick}
            onJourSurvol={onJourSurvol}
          />
          <MoisCalendrier
            annee={moisSuivant.annee}
            mois={moisSuivant.mois}
            dateDebut={dateDebut}
            dateFin={dateFin}
            survol={survol}
            onJourClick={onJourClick}
            onJourSurvol={onJourSurvol}
          />
        </div>
      )}

      {/* Hint swipe sur mobile */}
      {estMobile && (
        <div className="calendrier__hint-swipe">← Glissez pour changer de mois →</div>
      )}

      {/* Résumé dates sélectionnées */}
      {(dateDebut || dateFin) && (
        <div className="calendrier__resume-dates">
          <div className={`calendrier__date-pill${dateDebut ? ' calendrier__date-pill--actif' : ''}`}>
            <span className="calendrier__date-pill-label">Départ</span>
            <span className="calendrier__date-pill-valeur">
              {dateDebut
                ? dateDebut.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                : '—'}
            </span>
          </div>
          <div className="calendrier__date-separateur">→</div>
          <div className={`calendrier__date-pill${dateFin ? ' calendrier__date-pill--actif' : ''}`}>
            <span className="calendrier__date-pill-label">Retour</span>
            <span className="calendrier__date-pill-valeur">
              {dateFin
                ? dateFin.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                : '—'}
            </span>
          </div>
          {dateDebut && dateFin && (
            <div className="calendrier__nb-jours">
              {Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24))} jour{Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Reset */}
      {(dateDebut || dateFin) && (
        <button
          type="button"
          className="calendrier__reset"
          onClick={() => { onChange({ dateDebut: null, dateFin: null }); setSurvol(null) }}
        >
          Réinitialiser les dates
        </button>
      )}
    </div>
  )
}

export default Calendrier
