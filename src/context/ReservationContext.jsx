import { createContext, useContext, useState } from 'react'

// Contexte global — stocke les dates et lieu pré-sélectionnés depuis le hero
// → pré-remplit automatiquement le formulaire de réservation
const ReservationContext = createContext(null)

export function ReservationProvider({ children }) {
  const [prefill, setPrefill] = useState({
    dateDebut: null,
    dateFin:   null,
    lieu:      '',
  })

  return (
    <ReservationContext.Provider value={{ prefill, setPrefill }}>
      {children}
    </ReservationContext.Provider>
  )
}

export function usePrefill() {
  const ctx = useContext(ReservationContext)
  if (!ctx) throw new Error('usePrefill doit être dans ReservationProvider')
  return ctx
}
