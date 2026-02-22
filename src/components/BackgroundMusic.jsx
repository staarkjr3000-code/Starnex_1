import { useEffect, useRef } from "react";
import bgMusic from "../assets/bg.mp3";

export default function BackgroundMusic({ play }) {

  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  useEffect(() => {

    const audio = audioRef.current;
    if (!audio) return;

    /* Ensure audio context unlock on first user interaction */
    const unlockAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };

  }, []);

  useEffect(() => {

    const audio = audioRef.current;
    if (!audio) return;

    if (play) {

      /* Fade in effect */
      audio.volume = 0;
      audio.play().catch(() => {});

      clearInterval(fadeIntervalRef.current);

      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume < 0.4) {
          audio.volume = Math.min(audio.volume + 0.02, 0.4);
        } else {
          clearInterval(fadeIntervalRef.current);
        }
      }, 100);

    } else {

      /* Fade out */
      clearInterval(fadeIntervalRef.current);

      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume > 0.02) {
          audio.volume -= 0.02;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeIntervalRef.current);
        }
      }, 100);

    }

  }, [play]);

  return (
    <audio
      ref={audioRef}
      src={bgMusic}
      loop
      preload="auto"
      playsInline
    />
  );
}