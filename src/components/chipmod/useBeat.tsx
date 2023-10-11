import { useEffect, useRef } from "react";
import { useCurrentTime } from "~/pages/chipmod/chipmodmain";

/**
 * Hook that emits an event on every beat.
 *
 * @param bpm - Beats per minute.
 * @param offset - Delay before the first beat in milliseconds.
 * @param onBeat - Callback function to be called on every beat.
 */
const useBeat = (bpm: number, offset: number = 0, onBeat: () => void) => {
  const curTimeRef = useCurrentTime();
  const intervalRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);

  useEffect(() => {
    console.log(curTimeRef.current, offset);
    const intervalDuration = 60000 / bpm;

    let beatCount = 0;
    const handleBeat = () => {
      onBeat();
      beatCount++;
      beatCountRef.current = beatCount;
    };

    // Start the interval after the specified offset
    const startBeat = () => {
      handleBeat();
      intervalRef.current = setInterval(
        handleBeat,
        intervalDuration,
      ) as unknown as number;
    };

    const elapsedTime = curTimeRef.current * 1000 + offset; // Convert to ms and add offset
    const timeSinceLastBeat = elapsedTime % intervalDuration;
    const timeToNextBeat = intervalDuration - timeSinceLastBeat;

    if (offset > 0) {
      const timeoutId = setTimeout(startBeat, timeToNextBeat);
      return () => clearTimeout(timeoutId);
    } else {
      startBeat();
    }

    setTimeout(() => {
      handleBeat();
      setInterval(handleBeat, intervalDuration);
    }, timeToNextBeat);

    // Cleanup
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bpm, curTimeRef, offset, beatCountRef]);
};

export default useBeat;
