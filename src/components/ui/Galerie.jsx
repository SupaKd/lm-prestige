import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

// Lightbox plein écran avec navigation
function Lightbox({ images, indexInitial, onFermer }) {
  const [index, setIndex] = useState(indexInitial)

  const precedent = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const suivant   = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onFermer()
      if (e.key === 'ArrowLeft')  precedent()
      if (e.key === 'ArrowRight') suivant()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onFermer, precedent, suivant])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div className="lightbox" onClick={onFermer} role="dialog" aria-modal="true">
      {/* Fermer */}
      <button className="lightbox__fermer" onClick={onFermer} aria-label="Fermer">
        <X size={20} />
      </button>

      {/* Compteur */}
      <div className="lightbox__compteur">{index + 1} / {images.length}</div>

      {/* Image principale */}
      <div className="lightbox__scene" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <button className="lightbox__nav lightbox__nav--prev" onClick={precedent} aria-label="Photo précédente">
            <ChevronLeft size={22} />
          </button>
        )}

        <img
          key={index}
          src={images[index]}
          alt={`Photo ${index + 1}`}
          className="lightbox__img"
        />

        {images.length > 1 && (
          <button className="lightbox__nav lightbox__nav--next" onClick={suivant} aria-label="Photo suivante">
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="lightbox__miniatures" onClick={(e) => e.stopPropagation()}>
          {images.map((src, i) => (
            <button
              key={i}
              className={`lightbox__miniature${i === index ? ' lightbox__miniature--actif' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
            >
              <img src={src} alt={`Miniature ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}

// Galerie principale sur la fiche véhicule
function Galerie({ images, nom }) {
  const [indexActif, setIndexActif] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const ouvrir = (i) => setLightboxIndex(i)
  const fermer = () => setLightboxIndex(null)

  return (
    <>
      <div className="galerie">
        {/* Image principale cliquable */}
        <div
          className="galerie__principale"
          onClick={() => ouvrir(indexActif)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && ouvrir(indexActif)}
          aria-label="Agrandir la photo"
        >
          <img
            key={indexActif}
            src={images[indexActif]}
            alt={`${nom} — photo ${indexActif + 1}`}
            className="galerie__img"
          />
          <div className="galerie__zoom-hint">
            <ZoomIn size={14} /> Agrandir
          </div>
          {images.length > 1 && (
            <div className="galerie__compteur-overlay">{indexActif + 1}/{images.length}</div>
          )}
        </div>

        {/* Miniatures */}
        {images.length > 1 && (
          <div className="galerie__miniatures">
            {images.map((src, i) => (
              <button
                key={i}
                className={`galerie__miniature${i === indexActif ? ' galerie__miniature--actif' : ''}`}
                onClick={() => setIndexActif(i)}
                aria-label={`Photo ${i + 1}`}
              >
                <img src={src} alt={`${nom} miniature ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox images={images} indexInitial={lightboxIndex} onFermer={fermer} />
      )}
    </>
  )
}

export default Galerie
