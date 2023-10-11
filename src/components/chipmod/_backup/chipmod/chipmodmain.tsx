import React, { useEffect, useRef, useState } from "react";
import { Title } from "~/components/Title";

import { Engine as EEngine } from "@babylonjs/core/Engines/engine";
import type { Scene as BabylonScene } from "@babylonjs/core/";
import { Engine, Scene, useScene, useBeforeRender } from "react-babylonjs";
import { Camera } from "~/components/babylon/Camera";
import { Sound } from "@babylonjs/core";
import TDC from "./TDC";
import { useShowDebug } from "~/components/chipmod/providers/ShowDebugContext";
import useEnhancedPostProcess from "./visualizers/useEnhancedPostProcess";

const useSceneReference = () => {
  return useRef<BabylonScene | null>(useScene());
};

const useSound = (scene: BabylonScene | null) => {
  const soundRef = useRef<Sound | null>(null);
  const [isSoundReady, setSoundReady] = useState(false);

  useEffect(() => {
    if (!soundRef.current && scene) {
      console.log("Creating sound");
      soundRef.current = new Sound(
        "sound-1",
        "music/trance-lq.mp3",
        scene,
        () => {
          setSoundReady(true);
        },
        {
          loop: true,
          autoplay: false,
          volume: 0.5,
        },
      );
    }
    // Cleanup function
    return () => {
      soundRef.current?.dispose();
    };
  }, [scene]);

  return { soundRef, isSoundReady };
};

const DefaultSound = (props: { playing: boolean }) => {
  const sceneRef = useSceneReference();
  const { soundRef, isSoundReady } = useSound(sceneRef.current);

  useEffect(() => {
    if (isSoundReady) {
      if (props.playing) {
        soundRef.current?.play();
      } else {
        soundRef.current?.pause();
      }
    }
  }, [props.playing, isSoundReady, soundRef]);

  return null; // Return null for components that don't render anything
};
export const useMainSound = (scene: BabylonScene | null) => {
  const soundRef = useRef<Sound | null>(null);
  useEffect(() => {
    if (!soundRef.current && scene) {
      soundRef.current = scene.mainSoundTrack.soundCollection[0]!;
    }
  }, [scene]);
  return soundRef;
};

export const useCurrentTime = () => {
  const soundRef = useMainSound(useScene());
  const timeRef = useRef<number>(0);
  useBeforeRender(() => {
    timeRef.current = soundRef.current!.currentTime;
  });
  return timeRef;
};

export const useDuration = () => {
  const soundRef = useMainSound(useScene());
  const durationRef = useRef<number>(0);
  useBeforeRender(() => {
    durationRef.current = soundRef.current!.getAudioBuffer()?.duration ?? 1;
    // Return 1 to avoid division by 0.
  });
  return durationRef;
};

const useAudioPlayback = () => {
  const [playing, setPlaying] = useState(false);

  const togglePlayback = () => {
    if (EEngine.audioEngine && !EEngine.audioEngine.unlocked) {
      EEngine.audioEngine.useCustomUnlockedButton = true;
      EEngine.audioEngine.unlock();
    }
    setPlaying((prev) => !prev);
  };

  return { playing, togglePlayback };
};

const BaseButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    className="z-10 mx-2 min-w-[180px] overflow-hidden whitespace-nowrap rounded-full bg-gradient-to-br from-emerald-300 to-emerald-800 p-5 text-center"
    onClick={onClick}
  >
    <span className="font-mono font-semibold">{children}</span>
  </button>
);

type BaseButtonProps = {
  curState: boolean;
  fnCallback: () => void;
};

const PlaybackButton = ({ curState, fnCallback }: BaseButtonProps) => {
  return (
    <BaseButton onClick={fnCallback}>{curState ? "Pause" : "Play"}</BaseButton>
  );
};

const DebugButton = ({ curState, fnCallback }: BaseButtonProps) => {
  return (
    <BaseButton onClick={fnCallback}>
      {curState ? "Hide debug" : "Show debug"}
    </BaseButton>
  );
};

export default function ChipModMain() {
  const { playing, togglePlayback } = useAudioPlayback();
  const { debugging, toggleDebugging } = useShowDebug();
  return <></>;
}
