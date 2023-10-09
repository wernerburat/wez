import React, { useEffect, useRef, useState } from "react";
import { Title } from "~/components/Title";

import { Engine, Scene, useScene } from "react-babylonjs";
import { Engine as EEngine } from "@babylonjs/core/Engines/engine";
import { Analyser as EAnalyser } from "@babylonjs/core/Audio/analyser";
import { Camera } from "~/components/babylon/Camera";
import { Vector3, Sound } from "@babylonjs/core";
import type { Scene as BabylonScene } from "@babylonjs/core/";
import TDC from "./TDC";

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
        "music/test2.mp3",
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
      soundRef.current = null; // Reset the ref
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

export const useAnalyser = (scene: BabylonScene | null) => {
  const analyserRef = useRef<EAnalyser | null>(null); // Initialize with null
  const byteTimeRef = useRef<Uint8Array | null>(null); // Initialize with null
  const byteFrequencyRef = useRef<Uint8Array | null>(null); // Initialize with null

  useEffect(() => {
    if (!analyserRef.current && scene) {
      analyserRef.current = new EAnalyser(scene);
      analyserRef.current.drawDebugCanvas();
      EEngine.audioEngine?.connectToAnalyser(analyserRef.current);
      byteTimeRef.current = analyserRef.current.getByteTimeDomainData();
      byteFrequencyRef.current = analyserRef.current.getByteFrequencyData();
    }
  }, [scene]);
  return { analyserRef, byteTimeRef, byteFrequencyRef };
};

const useAudioPlayback = () => {
  const [playing, setPlaying] = useState(false);

  const togglePlayback = () => {
    if (EEngine.audioEngine) {
      EEngine.audioEngine.useCustomUnlockedButton = true;
      EEngine.audioEngine.unlock();
    }
    setPlaying((prev) => !prev);
  };

  return { playing, togglePlayback };
};

const PlaybackButton = ({
  playing,
  onClick,
}: {
  playing: boolean;
  onClick: () => void;
}) => (
  <button
    className="z-10 m-auto rounded-full bg-gradient-to-br from-emerald-300 to-emerald-800 p-6"
    onClick={onClick}
  >
    <span className="font-mono font-semibold">
      {playing ? "Pause" : "Play"}
    </span>
  </button>
);

export default function ChipModMain() {
  const { playing, togglePlayback } = useAudioPlayback();

  return (
    <>
      <div className="engine-stuff z-1 opacity-80">
        <Engine canvasId="chipmod-canvas" className="absolute">
          <Scene>
            <Camera />
            <hemisphericLight
              name="light1"
              intensity={0}
              direction={new Vector3(-1, 0, 0)}
            />
            <DefaultSound playing={playing} />
            <TDC />
          </Scene>
        </Engine>
      </div>
      <div className="h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-green-200 to-emerald-200">
        <div className="html-stuff">
          <Title className="z-10 flex justify-center font-extralight text-emerald-600">
            Sound demo
          </Title>
          <div className="mt-4 flex h-full items-stretch justify-center">
            {/* <FileInput onChange={handleFileChange} /> */}
            <PlaybackButton playing={playing} onClick={togglePlayback} />
          </div>
        </div>
      </div>
    </>
  );
}
