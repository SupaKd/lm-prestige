import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

// Contexte global pour déclencher des toasts depuis n'importe où
const ToastContext = createContext(null)

const ICONES = {
  succes:  <CheckCircle size={16} />,
  erreur:  <AlertCircle size={16} />,
  info:    <Info size={16} />,
}

function ToastItem({ toast, onRetirer }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Entrée
    requestAnimationFrame(() => setVisible(true))
    // Auto-dismiss
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRetirer(toast.id), 320)
    }, toast.duree || 3500)
    return () => clearTimeout(t)
  }, [toast.id, toast.duree, onRetirer])

  const fermer = () => {
    setVisible(false)
    setTimeout(() => onRetirer(toast.id), 320)
  }

  return (
    <div className={`toast toast--${toast.type || 'info'}${visible ? ' toast--visible' : ''}`}>
      <span className="toast__icone">{ICONES[toast.type] || ICONES.info}</span>
      <span className="toast__message">{toast.message}</span>
      <button className="toast__fermer" onClick={fermer} aria-label="Fermer">
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const ajouter = useCallback((message, type = 'info', duree = 3500) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duree }])
  }, [])

  const retirer = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={ajouter}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRetirer={retirer} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Hook d'utilisation : const toast = useToast()  →  toast('Message !', 'succes')
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast doit être utilisé dans un ToastProvider')
  return ctx
}
