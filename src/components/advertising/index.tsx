import React from 'react';
import { useTranslation } from 'react-i18next';
import './ads.css';
import heroImage from '@/assets/images/asrapa-ads-hero.png';

const WHATSAPP_URL =
  "https://wa.me/23587509191?text=Bonjour%20ASRAPA%20ADS%2C%20je%20souhaite%20discuter%20d%27une%20campagne%20publicitaire.";

const soundBarHeights = [18, 34, 50, 28, 58, 40, 22, 46, 32, 52, 26];

const AdvertisingPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="ads-page">
      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span></span> {t('advertisingPage.eyebrow')}
          </p>
          <h1>
            {t('advertisingPage.titleBefore')} <em>{t('advertisingPage.titleAccent')}</em>
          </h1>
          <p className="hero-lead">
            <strong>{t('advertisingPage.leadStrong')}</strong> {t('advertisingPage.leadRest')}
          </p>
          <p className="hero-note">
            {t('advertisingPage.note')}
          </p>
          <div className="hero-actions">
            <a className="button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              {t('advertisingPage.talkAboutCampaign')}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </a>
            <span className="phone-label">WhatsApp&nbsp; +235 87 50 91 91</span>
          </div>
          <div className="channel-row" aria-label={t('advertisingPage.channelsAria')}>
            <span>{t('advertisingPage.channels.app')}</span>
            <span>{t('advertisingPage.channels.miniApp')}</span>
            <span>{t('advertisingPage.channels.kaiOS')}</span>
            <span>{t('advertisingPage.channels.ussd')}</span>
            <span>{t('advertisingPage.channels.bunda')}</span>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src={heroImage}
            alt={t('advertisingPage.heroImageAlt')}
          />
          <div className="image-scrim" />
          <div className="visual-badge">
            <span className="live-dot" />
            <div>
              <small>{t('advertisingPage.mediaGround')}</small>
              <strong>{t('advertisingPage.mediaGroundValue')}</strong>
            </div>
          </div>
          <div className="sound-card">
            <div className="sound-bars" aria-hidden="true">
              {soundBarHeights.map((height, i) => (
                <i key={i} style={{ height: `${height}px` }} />
              ))}
            </div>
            <p>{t('advertisingPage.soundCardText')}</p>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label={t('advertisingPage.keyFigureAria')}>
        <div className="section-shell signal-inner">
          <span>{t('advertisingPage.signal.label')}</span>
          <strong>{t('advertisingPage.signal.value')}</strong>
          <p>
            {t('advertisingPage.signal.description')}
          </p>
        </div>
      </section>

      <section className="section-shell content-section" id="pourquoi">
        <div className="section-heading">
          <p className="eyebrow">
            <span></span> {t('advertisingPage.why.eyebrow')}
          </p>
          <h2>{t('advertisingPage.why.title')}</h2>
        </div>
        <div className="advantage-grid">
          <article className="advantage-card">
            <span className="card-marker">A</span>
            <h3>{t('advertisingPage.why.cardA.title')}</h3>
            <p>
              {t('advertisingPage.why.cardA.body')}
            </p>
          </article>
          <article className="advantage-card">
            <span className="card-marker">B</span>
            <h3>{t('advertisingPage.why.cardB.title')}</h3>
            <p>
              {t('advertisingPage.why.cardB.body')}
            </p>
          </article>
          <article className="advantage-card">
            <span className="card-marker">C</span>
            <h3>{t('advertisingPage.why.cardC.title')}</h3>
            <p>
              {t('advertisingPage.why.cardC.body')}
            </p>
          </article>
        </div>
      </section>

      <section className="formats-section" id="formats">
        <div className="section-shell">
          <div className="section-heading heading-row">
            <div>
              <p className="eyebrow">
                <span></span> {t('advertisingPage.formats.eyebrow')}
              </p>
              <h2>{t('advertisingPage.formats.title')}</h2>
            </div>
            <p className="heading-copy">
              {t('advertisingPage.formats.subtitle')}
            </p>
          </div>
          <div className="format-grid">
            <article className="format-card">
              <div className="format-topline">
                <span>01</span>
                <small>{t('advertisingPage.formats.audio.tag')}</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>{t('advertisingPage.formats.audio.title')}</h3>
              <p>
                {t('advertisingPage.formats.audio.body')}
              </p>
            </article>
            <article className="format-card">
              <div className="format-topline">
                <span>02</span>
                <small>{t('advertisingPage.formats.visual.tag')}</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>{t('advertisingPage.formats.visual.title')}</h3>
              <p>
                {t('advertisingPage.formats.visual.body')}
              </p>
            </article>
            <article className="format-card">
              <div className="format-topline">
                <span>03</span>
                <small>{t('advertisingPage.formats.canvas.tag')}</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>{t('advertisingPage.formats.canvas.title')}</h3>
              <p>
                {t('advertisingPage.formats.canvas.body')}
              </p>
            </article>
            <article className="format-card">
              <div className="format-topline">
                <span>04</span>
                <small>{t('advertisingPage.formats.voice.tag')}</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>{t('advertisingPage.formats.voice.title')}</h3>
              <p>
                {t('advertisingPage.formats.voice.body')}
              </p>
            </article>
            <article className="format-card">
              <div className="format-topline">
                <span>05</span>
                <small>{t('advertisingPage.formats.playlist.tag')}</small>
              </div>
              <div className="format-icon" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>{t('advertisingPage.formats.playlist.title')}</h3>
              <p>
                {t('advertisingPage.formats.playlist.body')}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell content-section" id="solutions">
        <div className="section-heading heading-row">
          <div>
            <p className="eyebrow">
              <span></span> {t('advertisingPage.solutions.eyebrow')}
            </p>
            <h2>{t('advertisingPage.solutions.title')}</h2>
          </div>
          <p className="heading-copy">
            {t('advertisingPage.solutions.subtitle')}
          </p>
        </div>
        <div className="solution-grid">
          <article className="solution-card solution-red">
            <p className="solution-kicker">{t('advertisingPage.solutions.sponsoring.kicker')}</p>
            <h3>{t('advertisingPage.solutions.sponsoring.title')}</h3>
            <ul>
              <li>
                <strong>{t('advertisingPage.solutions.sponsoring.item1Strong')}</strong> {t('advertisingPage.solutions.sponsoring.item1Rest')}
              </li>
              <li>
                <strong>{t('advertisingPage.solutions.sponsoring.item2Strong')}</strong> {t('advertisingPage.solutions.sponsoring.item2Rest')}
              </li>
              <li>
                <strong>{t('advertisingPage.solutions.sponsoring.item3Strong')}</strong> {t('advertisingPage.solutions.sponsoring.item3Rest')}
              </li>
            </ul>
          </article>
          <article className="solution-card solution-photo">
            <div className="solution-photo-bg" />
            <div className="solution-photo-content">
              <p className="solution-kicker">{t('advertisingPage.solutions.endorsement.kicker')}</p>
              <h3>{t('advertisingPage.solutions.endorsement.title')}</h3>
              <ul>
                <li>
                  <strong>{t('advertisingPage.solutions.endorsement.item1Strong')}</strong> {t('advertisingPage.solutions.endorsement.item1Rest')}
                </li>
                <li>
                  <strong>{t('advertisingPage.solutions.endorsement.item2Strong')}</strong> {t('advertisingPage.solutions.endorsement.item2Rest')}
                </li>
                <li>
                  <strong>{t('advertisingPage.solutions.endorsement.item3Strong')}</strong> {t('advertisingPage.solutions.endorsement.item3Rest')}
                </li>
              </ul>
            </div>
          </article>
        </div>

        <article className="crossmedia-card">
          <div className="crossmedia-copy">
            <p className="eyebrow">
              <span></span> {t('advertisingPage.crossmedia.eyebrow')}
            </p>
            <h3>{t('advertisingPage.crossmedia.title')}</h3>
            <p>
              {t('advertisingPage.crossmedia.body')}
            </p>
          </div>
          <div className="channel-map" aria-label={t('advertisingPage.crossmedia.mapAria')}>
            <div className="map-item">
              <span>01</span>
              <strong>{t('advertisingPage.crossmedia.step1Title')}</strong>
              <small>{t('advertisingPage.crossmedia.step1Label')}</small>
            </div>
            <div className="map-item">
              <span>02</span>
              <strong>{t('advertisingPage.crossmedia.step2Title')}</strong>
              <small>{t('advertisingPage.crossmedia.step2Label')}</small>
            </div>
            <div className="map-item">
              <span>03</span>
              <strong>{t('advertisingPage.crossmedia.step3Title')}</strong>
              <small>{t('advertisingPage.crossmedia.step3Label')}</small>
            </div>
            <div className="map-item">
              <span>04</span>
              <strong>{t('advertisingPage.crossmedia.step4Title')}</strong>
              <small>{t('advertisingPage.crossmedia.step4Label')}</small>
            </div>
          </div>
        </article>
      </section>

      <section className="start-section">
        <div className="section-shell start-inner">
          <div className="start-heading">
            <p className="eyebrow eyebrow-light">
              <span></span> {t('advertisingPage.start.eyebrow')}
            </p>
            <h2>{t('advertisingPage.start.title')}</h2>
          </div>
          <ol className="steps">
            <li>
              <span>1</span>
              <p>
                <strong>{t('advertisingPage.start.step1Strong')}</strong> {t('advertisingPage.start.step1Rest')}
              </p>
            </li>
            <li>
              <span>2</span>
              <p>
                <strong>{t('advertisingPage.start.step2Strong')}</strong> {t('advertisingPage.start.step2Rest')}
              </p>
            </li>
            <li>
              <span>3</span>
              <p>
                <strong>{t('advertisingPage.start.step3Strong')}</strong> {t('advertisingPage.start.step3Rest')}
              </p>
            </li>
          </ol>
          <a className="button button-light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            {t('advertisingPage.start.cta')}
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
