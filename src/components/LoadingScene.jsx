import { useEffect, useState } from "react";
import loadervideo from "../assets/loader.mp4";

export default function LoadingScene({ onStart }) {

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [dots, setDots] = useState("");

  /* ================= CALM 12-SECOND LOADING ================= */

  useEffect(() => {
    const totalDuration = 12000; // 12 seconds
    const intervalTime = totalDuration / 100;
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setReady(true), 800);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);


  /* ================= SLOW DOT ANIMATION ================= */

  useEffect(() => {

    if (ready) return;

    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500); // slower + calmer

    return () => clearInterval(dotInterval);

  }, [ready]);


  return (

    <div className="loading-screen">

      {/* Background Video */}
      <video
        className="loading-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={loadervideo} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="loading-overlay-layer" />

      <div className="loading-container">

        {!ready && (
          <>
            <div className="mc-progress-container">
              <div
                className="mc-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="loading-text">
              Loading resources{dots}
            </div>
          </>
        )}

        {ready && (
          <button
            className="start-button calm-start"
            onClick={onStart}
          >
            START
          </button>
        )}

        <div className="hero-credit">
          MADE BY STAARK
        </div>

      </div>

    </div>

  );
}