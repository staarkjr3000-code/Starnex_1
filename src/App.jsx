import { useState } from "react";
import logoDesktop from "./assets/logo-desktop.png";
import logoMobile from "./assets/logo-mobile.png";

import LoadingScene from "./components/LoadingScene";
import ResponsiveVideo from "./components/ResponsiveVideo";
import TargetCursor from "./components/TargetCursor";
import BackgroundMusic from "./components/BackgroundMusic";

import ExplorePage from "./components/ExplorePage";
import HeroPage from "./components/HeroPage";
import SocialMediaPage from "./components/SocialMediaPage";
import ContactPage from "./components/ContactPage";
import { playClick } from "./utils/sound";

export default function App() {

  /* ================= STATES ================= */

  const [started, setStarted] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);

  const [exploreOpen, setExploreOpen] = useState(false);
  const [heroOpen, setHeroOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  /* ================= LOADING SCREEN ================= */

  if (!started) {
    return (
      <LoadingScene
        onStart={() => {
          setStarted(true);
          setTimeout(() => {
            setMainVisible(true);
          }, 1000); // Delay to allow music to start
        }}
      />
    );
  }

  /* ================= MAIN APP ================= */

  return (

    <div className="app-root">

      {/* Responsive Video Background */}
      <ResponsiveVideo />

      <div className="ground-fog" />

      {/* MAIN SCREEN */}
      {!exploreOpen && !heroOpen && !socialOpen && !contactOpen && (

        <div className="main-screen">

          {/* Desktop Logo */}
          <img
            src={logoDesktop}
            className="logo-desktop"
            draggable="false"
            alt="Logo Desktop"
          />

          {/* Mobile Logo */}
          <img
            src={logoMobile}
            className="logo-mobile"
            draggable="false"
            alt="Logo Mobile"
          />

          <div className="made-by">
            MADE BY STAARK
          </div>

          <button
            className="explore-button"
            onClick={() => {
              playClick();
              setExploreOpen(true);
            }}
          >
            EXPLORE
          </button>

        </div>

      )}

      {/* EXPLORE PAGE */}
      {exploreOpen && !heroOpen && !socialOpen && !contactOpen && (
        <ExplorePage
          onBack={() => {
            playClick();
            setExploreOpen(false);
          }}
          onHero={() => {
            playClick();
            setExploreOpen(false);
            setHeroOpen(true);
          }}
          onSocial={() => {
            playClick();
            setExploreOpen(false);
            setSocialOpen(true);
          }}
          onContact={() => {
            playClick();
            setExploreOpen(false);
            setContactOpen(true);
          }}
        />
      )}

      {/* HERO PAGE */}
      {heroOpen && (
        <HeroPage
          onBack={() => {
            playClick();
            setHeroOpen(false);
            setExploreOpen(true);
          }}
        />
      )}

      {/* SOCIAL PAGE */}
      {socialOpen && (
        <SocialMediaPage
          onBack={() => {
            playClick();
            setSocialOpen(false);
            setExploreOpen(true);
          }}
        />
      )}

      {/* CONTACT PAGE */}
      {contactOpen && (
        <ContactPage
          onBack={() => {
            playClick();
            setContactOpen(false);
            setExploreOpen(true);
          }}
        />
      )}

      {/* CURSOR */}
      <TargetCursor />

      {/* MUSIC */}
      <BackgroundMusic play={started} />

    </div>

  );

}