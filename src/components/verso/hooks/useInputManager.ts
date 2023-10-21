import { useState, useEffect, useRef } from "react";
import KeyboardToVehicleAdapter, {
  type VehicleAction,
} from "./adapters/KeyboardToVehicleAdapter";
import TouchToVehicleAdapter from "./adapters/TouchToVehicleAdapter";

export interface InputAdapter<E extends Event> {
  translateInput: (event: E) => void;
}

const useInputManager = () => {
  const [actions, setActions] = useState<VehicleAction[]>([]); // Array of actions
  const adapterRef = useRef<
    InputAdapter<KeyboardEvent> | InputAdapter<TouchEvent> | null
  >(null);

  useEffect(() => {
    const isKeyboard =
      window.navigator.platform.includes("Win") ||
      window.navigator.platform.includes("Mac");
    const isTouch = "ontouchstart" in window;

    if (isKeyboard) {
      adapterRef.current = new KeyboardToVehicleAdapter(setActions); // Passing setActions
      window.addEventListener(
        "keydown",
        adapterRef.current.translateInput as (event: KeyboardEvent) => void,
      );
      window.addEventListener(
        "keyup",
        adapterRef.current.translateInput as (event: KeyboardEvent) => void,
      );
    } else if (isTouch) {
      adapterRef.current = new TouchToVehicleAdapter(setActions); // Passing setActions
      window.addEventListener(
        "touchstart",
        adapterRef.current.translateInput as (event: TouchEvent) => void,
      );
      window.addEventListener(
        "touchmove",
        adapterRef.current.translateInput as (event: TouchEvent) => void,
      ); // Added touchmove event
      window.addEventListener(
        "touchend",
        adapterRef.current.translateInput as (event: TouchEvent) => void,
      );
    }

    return () => {
      if (adapterRef.current) {
        if (adapterRef.current instanceof KeyboardToVehicleAdapter) {
          window.removeEventListener(
            "keydown",
            adapterRef.current.translateInput as (event: KeyboardEvent) => void,
          );
          window.removeEventListener(
            "keyup",
            adapterRef.current.translateInput as (event: KeyboardEvent) => void,
          );
        } else if (adapterRef.current instanceof TouchToVehicleAdapter) {
          window.removeEventListener(
            "touchstart",
            adapterRef.current.translateInput as (event: TouchEvent) => void,
          );
          window.removeEventListener(
            "touchmove",
            adapterRef.current.translateInput as (event: TouchEvent) => void,
          ); // Remove touchmove event
          window.removeEventListener(
            "touchend",
            adapterRef.current.translateInput as (event: TouchEvent) => void,
          );
        }
      }
    };
  }, []);

  const inputType = (): string => {
    if (adapterRef.current instanceof KeyboardToVehicleAdapter)
      return "keyboard";
    if (adapterRef.current instanceof TouchToVehicleAdapter) return "touch";
    return "unknown";
  };

  return {
    getActions: () => actions, // Return an array of actions
    inputType: inputType(),
  };
};

export default useInputManager;
