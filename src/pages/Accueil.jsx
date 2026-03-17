import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Star, Shield, Clock, MapPin, ChevronRight } from "lucide-react";
import { vehicules, categories } from "../data/data";
import CarteAvantage from "../components/ui/CarteAvantage";
import WidgetReservation from "../components/ui/WidgetReservation";

const avantages = [
  {
    icone: <Star size={22} />,
    titre: "Flotte récente",
    texte: "Véhicules renouvelés régulièrement, moins de 2 ans d'ancienneté.",
  },
  {
    icone: <Shield size={22} />,
    titre: "Assurance incluse",
    texte:
      "Tous nos véhicules sont couverts tous risques. Vous conduisez l'esprit tranquille.",
  },
  {
    icone: <Clock size={22} />,
    titre: "Disponible 7j/7",
    texte:
      "Service de location disponible tous les jours, y compris week-end et jours fériés.",
  },
  {
    icone: <MapPin size={22} />,
    titre: "Zone Gex & Genève",
    texte:
      "Livraison possible à Gex, Ferney-Voltaire, Divonne et à l'aéroport de Genève.",
  },
];

// Hook : déclenche une classe d'entrée sur les éléments qui entrent dans le viewport
function useRevealOnScroll(selector) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}

function Accueil() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const photoRef = useRef(null);
  const ligne1Ref = useRef(null); // "Louez le véhicule"
  const ligne2Ref = useRef(null); // "idéal pour chaque trajet"
  const ridеauRef = useRef(null);
  const bodyRef = useRef(null);
  const rafRef = useRef(null);

  // Scroll driver — split titre + rideau
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const wh = window.innerHeight;
        const sy = window.scrollY;
        // progress 0→1 sur 1 viewport de scroll
        const p = Math.max(0, Math.min(1, sy / wh));

        // Phase 1 (0→0.5) : titre split gauche/droite + corps s'efface
        const pSplit = Math.min(1, p / 0.5);
        if (ligne1Ref.current)
          ligne1Ref.current.style.transform = `translateX(${-pSplit * 120}px)`;
        if (ligne2Ref.current)
          ligne2Ref.current.style.transform = `translateX(${pSplit * 120}px)`;
        if (bodyRef.current) {
          bodyRef.current.style.opacity = `${1 - pSplit * 1.4}`;
          bodyRef.current.style.transform = `translateY(${pSplit * 30}px)`;
        }

        // Parallax photo — monte doucement
        if (photoRef.current)
          photoRef.current.style.transform = `scale(1.08) translateY(${
            p * 80
          }px)`;

        // Phase 2 (0.5→1) : rideau noir descend
        const pRideau = Math.max(0, (p - 0.5) / 0.5);
        if (ridеauRef.current)
          ridеauRef.current.style.transform = `translateY(${
            (1 - pRideau) * -100
          }%)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Entrée hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("hero--visible"));
  }, []);

  // Reveal au scroll pour les sections suivantes
  useRevealOnScroll(".reveal");

  const categoriesAvecCompte = categories
    .filter((c) => c.id !== "tous")
    .map((c) => ({
      ...c,
      nb: vehicules.filter((v) => v.categorie === c.id).length,
    }));

  return (
    <main className="page">
      {/* ── Hero full viewport ── */}
      <section className="hero" ref={heroRef}>
        {/* Photo full — parallax au scroll */}
        <div className="hero__photo-wrap">
          <img
            ref={photoRef}
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=85"
            alt="LM Prestige"
            className="hero__photo"
          />
        </div>

        {/* Overlay dégradé */}
        <div className="hero__overlay" />

        {/* Rideau noir — descend en phase 2 du scroll */}
        <div className="hero__rideau" ref={ridеauRef} />

        {/* Contenu — flux vertical centré */}
        <div className="hero__body" ref={bodyRef}>
          {/* Titre massif — 2 lignes qui s'écartent au scroll */}
          <h1 className="hero__titre">
            <span className="hero__titre-ligne" ref={ligne1Ref}>
              <span className="hero__mot" style={{ "--d": "0s" }}>
                Louez
              </span>
              <span className="hero__mot" style={{ "--d": "0.08s" }}>
                le
              </span>
              <span className="hero__mot" style={{ "--d": "0.16s" }}>
                véhicule
              </span>
            </span>
            <span className="hero__titre-ligne" ref={ligne2Ref}>
              <span
                className="hero__mot hero__mot--accent"
                style={{ "--d": "0.26s" }}
              >
                idéal
              </span>
              <span className="hero__mot" style={{ "--d": "0.34s" }}>
                pour
              </span>
              <span className="hero__mot" style={{ "--d": "0.42s" }}>
                chaque
              </span>
              <span className="hero__mot" style={{ "--d": "0.5s" }}>
                trajet
              </span>
            </span>
          </h1>

          {/* Widget réservation — directement sous le titre */}
          <div className="hero__widget-inline">
            <WidgetReservation />
          </div>

          {/* Sous-titre + actions */}
          <div className="hero__bas">
            <p className="hero__sous-titre">
              Flotte variée · Tarifs clairs · 7j/7
              <br />
              Au départ de Gex
            </p>
            <div className="hero__actions">
              <Link to="/catalogue" className="btn btn--primaire btn--grand">
                <Car size={17} /> Voir les véhicules
              </Link>
              <a href="tel:+33450000000" className="btn btn--blanc btn--grand">
                Nous appeler
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="hero__stats">
            {[
              { n: "6+", l: "Véhicules" },
              { n: "7j/7", l: "Disponible" },
              { n: "45€", l: "Dès / jour" },
            ].map(({ n, l }, i) => (
              <div
                key={i}
                className="hero__stat"
                style={{ "--sd": `${0.6 + i * 0.1}s` }}
              >
                <span className="hero__stat-chiffre">{n}</span>
                <span className="hero__stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Indicateur scroll */}
        <div className="hero__scroll-hint">
          <div className="hero__scroll-hint-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* Bandeau stats */}
      <div className="bandeau-stats">
        {[
          { n: "6+", l: "Véhicules disponibles" },
          { n: "7j/7", l: "Service disponible" },
          { n: "45€", l: "Dès / jour" },
        ].map(({ n, l }, i) => (
          <div key={i} className="bandeau-stats__item">
            <span className="bandeau-stats__chiffre">{n}</span>
            <span className="bandeau-stats__label">{l}</span>
          </div>
        ))}
      </div>

      {/* Avantages */}
      <section className="avantages">
        <div className="conteneur">
          <h2 className="titre-section reveal">
            Pourquoi choisir <span>LM Prestige</span> ?
          </h2>
          <p
            className="sous-titre-section reveal"
            style={{ transitionDelay: "0.08s" }}
          >
            Un service local, humain et fiable depuis le Pays de Gex.
          </p>
          <div className="avantages__grille">
            {avantages.map((a, i) => (
              <CarteAvantage
                key={i}
                index={i}
                icone={a.icone}
                titre={a.titre}
                texte={a.texte}
                style={{ transitionDelay: `${i * 0.09}s` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Catégories — Bento grid full section */}
      <section className="categories-accueil">
        <div className="bento">
          {categoriesAvecCompte.map((cat, i) => (
            <button
              key={cat.id}
              className={`bento__carte bento__carte--${cat.id} reveal`}
              style={{ transitionDelay: `${i * 0.07}s` }}
              onClick={() => navigate(`/catalogue?categorie=${cat.id}`)}
            >
              <img src={cat.photo} alt={cat.label} className="bento__photo" />
              <div className="bento__overlay" />
              <div className="bento__contenu">
                <span className="bento__nom">{cat.label}</span>
                <span className="bento__nb">
                  {cat.nb} véhicule{cat.nb > 1 ? "s" : ""}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="cta-final">
        <div className="conteneur">
          <h2 className="titre-section reveal" style={{ textAlign: "center" }}>
            Prêt à <span>réserver</span> ?
          </h2>
          <p
            className="sous-titre-section reveal"
            style={{ textAlign: "center", transitionDelay: "0.08s" }}
          >
            Consultez notre catalogue et choisissez votre véhicule en quelques
            clics.
          </p>
          <div
            className="reveal"
            style={{ textAlign: "center", transitionDelay: "0.16s" }}
          >
            <Link to="/catalogue" className="btn btn--primaire btn--grand">
              Voir tous les véhicules <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Accueil;
