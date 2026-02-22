import { useEffect, useState } from "react";
import desktopVideo from "../assets/bg-desktop.mp4";
import mobileVideo from "../assets/bg-mobile.mp4";

export default function ResponsiveVideo() {

  const [videoSrc, setVideoSrc] = useState(desktopVideo);

  useEffect(() => {

    function updateVideo() {

      const width = window.innerWidth;

      if (width <= 1024) {
        setVideoSrc(mobileVideo);
      } else {
        setVideoSrc(desktopVideo);
      }

    }

    updateVideo();

    window.addEventListener("resize", updateVideo);

    return () =>
      window.removeEventListener("resize", updateVideo);

  }, []);

  return (
    <video
      className="bg-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      src={videoSrc}
      key={videoSrc}
    />
  );

}