import { useEffect, useRef } from "react";
import { useCurrentTime, useDuration } from "~/pages/chipmod/chipmodmain";

export const useTrackProgress = () => {
  const curTimeRef = useCurrentTime();
  const durationRef = useDuration();
  const progressRef = useRef(0);

  useEffect(() => {
    // Function to update progress
    const updateProgress = () => {
      if (curTimeRef.current && durationRef.current) {
        const currentProgress =
          (curTimeRef.current / durationRef.current) * 100;
        progressRef.current = Math.min(currentProgress, 100);
      }
    };

    // Initial update
    updateProgress();

    const interval = setInterval(updateProgress, 500); // Update every 0.5 seconds for smoother visuals

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [curTimeRef, durationRef]);

  return progressRef;
};
