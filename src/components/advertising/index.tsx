import React from 'react';
import './ads.css';
import heroImage from '@/assets/images/asrapa-ads-hero.png';

const WHATSAPP_URL =
  "https://wa.me/23587509191?text=Bonjour%20ASRAPA%20ADS%2C%20je%20souhaite%20discuter%20d%27une%20campagne%20publicitaire.";

const soundBarHeights = [18, 34, 50, 28, 58, 40, 22, 46, 32, 52, 26];

const AdvertisingPage: React.FC = () => {
  return (
    <div className="ads-page">
      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span></span> Première régie spécialisée
          </p>
          <h1>
            Votre marque au rythme du <em>Tchad.</em>
          </h1>
          <p className="hero-lead">
            <strong>ASRAPA ADS</strong> connecte les marques à une audience passionnée de
            musique, sur smartphone comme sur téléphone basique.
          </p>
          <p className="hero-note">
            Dans un marché saturé de messages publicitaires, nous transformons l'écoute
            musicale en un point de contact ciblé, culturel et mémorable.
          </p>
          <div className="hero-actions">
            <a className="button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Parler de ma campagne
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </a>
            <span className="phone-label">WhatsApp&nbsp; +235 87 50 91 91</span>
          </div>
          <div className="channel-row" aria-label="Canaux de diffusion">
            <span>App</span>
            <span>Mini-app</span>
            <span>KaiOS</span>
            <span>USSD</span>
            <span>Forfait Bunda</span>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src={heroImage}
            alt="Artiste sur scène devant un public dans une ambiance musicale contemporaine"
          />
          <div className="image-scrim" />
          <div className="visual-badge">
            <span className="live-dot" />
            <div>
              <small>Terrain média</small>
              <strong>100 % tchadien</strong>
            </div>
          </div>
          <div className="sound-card">
            <div className="sound-bars" aria-hidden="true">
              {soundBarHeights.map((height, i) => (
                <i key={i} style={{ height: `${height}px` }} />
              ))}
            </div>
            <p>Un message qui s'écoute.</p>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Chiffre clé">
        <div className="section-shell signal-inner">
          <span>Musique</span>
          <strong>Top 3</strong>
          <p>
            des principaux centres d'intérêt des utilisateurs au Tchad, après le football et
            les paris sportifs.
          </p>
        </div>
      </section>

      <section className="section-shell content-section" id="pourquoi">
        <div className="section-heading">
          <p className="eyebrow">
            <span></span> Pourquoi AsraPa
          </p>
          <h2>Une audience que les autres plateformes ne voient pas.</h2>
        </div>
        <div className="advantage-grid">
          <article className="advantage-card">
            <span className="card-marker">A</span>
            <h3>Une audience introuvable ailleurs.</h3>
            <p>
              App, mini-app, KaiOS, USSD et réseau Forfait Bunda : AsraPa touche des publics
              que les majors mondiales du streaming ne couvrent pas au Tchad.
            </p>
          </article>
          <article className="advantage-card">
            <span className="card-marker">B</span>
            <h3>Une identité forte.</h3>
            <p>
              Chaque campagne s'inscrit dans un univers 100 % tchadien, au cœur des usages et
              de la culture locale, pas dans un flux générique.
            </p>
          </article>
          <article className="advantage-card">
            <span className="card-marker">C</span>
            <h3>Une data qui vous appartient.</h3>
            <p>
              Les premières données structurées sur l'écoute musicale au Tchad vous aident à
              mieux comprendre vos audiences et à affiner vos prochaines campagnes.
            </p>
          </article>
        </div>
      </section>

      <section className="formats-section" id="formats">
        <div className="section-shell">
          <div className="section-heading heading-row">
            <div>
              <p className="eyebrow">
                <span></span> Nos formats
              </p>
              <h2>De l'audio à l'écran. Du smartphone au téléphone basique.</h2>
            </div>
            <p className="heading-copy">
              Une campagne cohérente, adaptée à chaque usage et pensée pour garder l'attention.
            </p>
          </div>
          <div className="format-grid">
            <article className="format-card">
              <div className="format-topline">
                <span>01</span>
                <small>15–30 sec</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>Spot audio</h3>
              <p>
                Diffusé entre les titres. Un message entendu sans distraction et sans dépendre
                de l'écran.
              </p>
            </article>
            <article className="format-card">
              <div className="format-topline">
                <span>02</span>
                <small>App + KaiOS</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>Visuel compagnon</h3>
              <p>
                Une bannière affichée pendant le spot pour renforcer la mémorisation de votre
                campagne.
              </p>
            </article>
            <article className="format-card">
              <div className="format-topline">
                <span>03</span>
                <small>Inclus</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>Habillage Canvas</h3>
              <p>
                Une image ou une courte boucle qui personnalise l'écran d'écoute pendant votre
                campagne, sans surcoût.
              </p>
            </article>
            <article className="format-card">
              <div className="format-topline">
                <span>04</span>
                <small>Exclusif</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>Message vocal USSD/SMS</h3>
              <p>
                Un format propre à AsraPa pour toucher les téléphones basiques, là où l'audio
                classique n'existe pas.
              </p>
            </article>
            <article className="format-card">
              <div className="format-topline">
                <span>05</span>
                <small>Accueil</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>Playlist sponsorisée</h3>
              <p>
                Une sélection musicale associée à votre marque et mise en avant sur la page
                d'accueil.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell content-section" id="solutions">
        <div className="section-heading heading-row">
          <div>
            <p className="eyebrow">
              <span></span> Au-delà du spot
            </p>
            <h2>Votre marque devient un moment culturel.</h2>
          </div>
          <p className="heading-copy">
            Des dispositifs pensés pour associer votre identité aux artistes, aux temps forts
            et aux communautés.
          </p>
        </div>
        <div className="solution-grid">
          <article className="solution-card solution-red">
            <p className="solution-kicker">Sponsoring &amp; Naming</p>
            <h3>Ne coupez pas l'écoute. Entrez dans le moment.</h3>
            <ul>
              <li>
                <strong>Rubriques nommées</strong> : « La Playlist de Noël, présentée par
                votre marque ».
              </li>
              <li>
                <strong>Sponsoring d'événements</strong> : concerts, sorties d'albums et
                exclusivités AsraPa.
              </li>
              <li>
                <strong>Habillage saisonnier</strong> : votre identité sur l'app pendant une
                période clé.
              </li>
            </ul>
          </article>
          <article className="solution-card solution-photo">
            <div className="solution-photo-bg" />
            <div className="solution-photo-content">
              <p className="solution-kicker">Endorsement artiste</p>
              <h3>La crédibilité culturelle, en accès direct.</h3>
              <ul>
                <li>
                  <strong>Association marque × artiste</strong> dans les contenus éditoriaux
                  et les réseaux.
                </li>
                <li>
                  <strong>Contenu co-créé</strong> : freestyle, clip ou session live pour
                  votre marque.
                </li>
                <li>
                  <strong>Prise de parole artiste</strong> : témoignage ou apparition dans
                  votre campagne.
                </li>
              </ul>
            </div>
          </article>
        </div>

        <article className="crossmedia-card">
          <div className="crossmedia-copy">
            <p className="eyebrow">
              <span></span> Crossmedia / Transmedia
            </p>
            <h3>Une idée. Plusieurs points de contact.</h3>
            <p>
              Teasing sur les réseaux, écoute sur l'app, jeu-concours par USSD et activation
              terrain via le réseau Forfait Bunda : chaque canal joue un rôle différent pour
              maximiser la portée.
            </p>
          </div>
          <div className="channel-map" aria-label="Parcours crossmedia">
            <div className="map-item">
              <span>01</span>
              <strong>Réseaux</strong>
              <small>Attirer</small>
            </div>
            <div className="map-item">
              <span>02</span>
              <strong>App AsraPa</strong>
              <small>Faire écouter</small>
            </div>
            <div className="map-item">
              <span>03</span>
              <strong>USSD</strong>
              <small>Faire participer</small>
            </div>
            <div className="map-item">
              <span>04</span>
              <strong>Bunda</strong>
              <small>Activer le terrain</small>
            </div>
          </div>
        </article>
      </section>

      <section className="start-section">
        <div className="section-shell start-inner">
          <div className="start-heading">
            <p className="eyebrow eyebrow-light">
              <span></span> Comment démarrer
            </p>
            <h2>Votre campagne peut commencer ici.</h2>
          </div>
          <ol className="steps">
            <li>
              <span>1</span>
              <p>
                <strong>Contactez-nous</strong> via WhatsApp au +235 87 50 91 91.
              </p>
            </li>
            <li>
              <span>2</span>
              <p>
                <strong>Construisons l'offre</strong> selon votre format, votre budget et
                votre durée.
              </p>
            </li>
            <li>
              <span>3</span>
              <p>
                <strong>Diffusez et suivez</strong> votre campagne auprès des bonnes
                audiences.
              </p>
            </li>
          </ol>
          <a className="button button-light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            Discuter de mon projet
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"></path>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
};

export default AdvertisingPage;
