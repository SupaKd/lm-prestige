import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Shield, Clock, MapPin } from "lucide-react";
import { vehicules, categories } from "../data/data";
import CarteAvantage from "../components/ui/CarteAvantage";
import WidgetReservation from "../components/ui/WidgetReservation";

const avantages = [
  {
    icone: <Star size={20} />,
    titre: "Flotte récente",
    texte: "Véhicules renouvelés régulièrement, moins de 2 ans d'ancienneté.",
  },
  {
    icone: <Shield size={20} />,
    titre: "Assurance incluse",
    texte:
      "Tous nos véhicules sont couverts tous risques. Conduisez l'esprit tranquille.",
  },
  {
    icone: <Clock size={20} />,
    titre: "Disponible 7j/7",
    texte:
      "Service de location disponible tous les jours, week-ends et jours fériés.",
  },
  {
    icone: <MapPin size={20} />,
    titre: "Zone Gex & Genève",
    texte:
      "Livraison à Gex, Ferney-Voltaire, Divonne et à l'aéroport de Genève.",
  },
];

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
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}

function Accueil() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const photoRef = useRef(null);
  const ligne1Ref = useRef(null);
  const ligne2Ref = useRef(null);
  const rideauRef = useRef(null);
  const bodyRef = useRef(null);
  const rafRef = useRef(null);

  // Scroll driver
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const wh = window.innerHeight;
        const sy = window.scrollY;
        const p = Math.max(0, Math.min(1, sy / wh));

        const pSplit = Math.min(1, p / 0.5);
        if (ligne1Ref.current)
          ligne1Ref.current.style.transform = `translateX(${-pSplit * 140}px)`;
        if (ligne2Ref.current)
          ligne2Ref.current.style.transform = `translateX(${pSplit * 140}px)`;
        if (bodyRef.current) {
          bodyRef.current.style.opacity = `${1 - pSplit * 1.5}`;
          bodyRef.current.style.transform = `translateY(${pSplit * 40}px)`;
        }

        if (photoRef.current)
          photoRef.current.style.transform = `scale(1.06) translateY(${
            p * 90
          }px)`;

        const pRideau = Math.max(0, (p - 0.5) / 0.5);
        if (rideauRef.current)
          rideauRef.current.style.transform = `translateY(${
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

  useRevealOnScroll(".reveal");

  const categoriesAvecCompte = categories
    .filter((c) => c.id !== "tous")
    .map((c) => ({
      ...c,
      nb: vehicules.filter((v) => v.categorie === c.id).length,
    }));

  return (
    <main className="page">
      {/* ── Hero ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero__photo-wrap">
          <img
            ref={photoRef}
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1800&q=90"
            alt="LM Prestige"
            className="hero__photo"
          />
        </div>

        <div className="hero__overlay" />
        <div className="hero__grain" />
        <div className="hero__trait-or" />
        <div className="hero__rideau" ref={rideauRef} />

        <div className="hero__body" ref={bodyRef}>
          {/* Titre serif massif */}
          <h1 className="hero__titre">
            <span className="hero__titre-ligne" ref={ligne1Ref}>
              <span className="hero__mot" style={{ "--d": "0s" }}>
                Louez
              </span>
              <span
                className="hero__mot hero__mot--italic"
                style={{ "--d": "0.1s" }}
              >
                le
              </span>
              <span className="hero__mot" style={{ "--d": "0.2s" }}>
                véhicule
              </span>
            </span>
            <span className="hero__titre-ligne" ref={ligne2Ref}>
              <span
                className="hero__mot hero__mot--or"
                style={{ "--d": "0.32s" }}
              >
                idéal
              </span>
              <span className="hero__mot" style={{ "--d": "0.42s" }}>
                pour
              </span>
              <span className="hero__mot" style={{ "--d": "0.52s" }}>
                chaque
              </span>
              <span className="hero__mot" style={{ "--d": "0.62s" }}>
                trajet
              </span>
            </span>
          </h1>

          {/* Filet or */}
          <div className="hero__ligne" />

          {/* Widget */}
          <div className="hero__widget-inline">
            <WidgetReservation />
          </div>

          {/* CTA mobile uniquement */}
          <div className="hero__cta-mobile">
            <Link to="/catalogue" className="btn btn--primaire">
              Voir les véhicules
            </Link>
            <a href="tel:+33450000000" className="btn btn--contour">
              Appeler
            </a>
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
                Voir les véhicules
              </Link>
              <a
                href="tel:+33450000000"
                className="btn btn--contour btn--grand"
              >
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
                style={{ "--sd": `${0.75 + i * 0.12}s` }}
              >
                <span className="hero__stat-chiffre">{n}</span>
                <span className="hero__stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__scroll-hint">
          <div className="hero__scroll-hint-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* Bandeau marquee — logos marques */}
      <div className="bandeau-marquee">
        <div className="bandeau-marquee__track">
          {[
            'Peugeot', 'Volkswagen', 'Toyota', 'Renault', 'BMW', 'Dacia',
            'Mercedes', 'Audi', 'Citroën', 'Ford', 'Opel', 'Seat',
            'Peugeot', 'Volkswagen', 'Toyota', 'Renault', 'BMW', 'Dacia',
            'Mercedes', 'Audi', 'Citroën', 'Ford', 'Opel', 'Seat',
          ].map((marque, i) => (
            <span key={i} className="bandeau-marquee__item">
              {marque}
              <span className="bandeau-marquee__sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Catégories — strip horizontale */}
      <section className="categories-accueil">
        <div className="bento">
          {categoriesAvecCompte.map((cat, i) => (
            <button
              key={cat.id}
              className={`bento__carte bento__carte--${cat.id}`}
              onClick={() => navigate(`/catalogue?categorie=${cat.id}`)}
            >
              <img src={cat.photo} alt={cat.label} className="bento__photo" />
              <div className="bento__overlay-or" />
              <span className="bento__index">0{i + 1}</span>
              <div className="bento__contenu">
                <span className="bento__nom">{cat.label}</span>
                <span className="bento__nb">{cat.nb} véhicule{cat.nb > 1 ? 's' : ''}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA final — fond noir */}
      <section className="cta-final">
        <div className="conteneur">
          <h2
            className="titre-section reveal"
            style={{
              textAlign: "center",
              color: "var(--blanc-casse, #F5F0E8)",
            }}
          >
            Prêt à <span>réserver</span> ?
          </h2>
          <p
            className="sous-titre-section reveal"
            style={{ textAlign: "center", transitionDelay: "0.1s" }}
          >
            Consultez notre catalogue et choisissez votre véhicule en quelques
            clics.
          </p>
          <div
            className="reveal"
            style={{ textAlign: "center", transitionDelay: "0.2s" }}
          >
            <Link to="/catalogue" className="btn btn--primaire btn--grand">
              Voir tous les véhicules
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Accueil;
