import { type InputAdapter } from "../useInputManager";
import { VehicleAction } from "./KeyboardToVehicleAdapter";

class TouchToVehicleAdapter implements InputAdapter<TouchEvent> {
  private callback: (actions: VehicleAction[]) => void;
  private initialX: number | null = null;
  private activeTouches = new Set<number>(); // Track active touches by their identifier

  constructor(callback: (actions: VehicleAction[]) => void) {
    this.callback = callback;
    this.translateInput = this.translateInput.bind(this);
  }

  translateInput = (touchEvent: TouchEvent): void => {
    switch (touchEvent.type) {
      case "touchstart":
        for (let i = 0; i < touchEvent.touches.length; i++) {
          const touch = touchEvent.touches[i];
          this.activeTouches.add(touch.identifier);

          if (this.activeTouches.size === 1) {
            this.initialX = touch.clientX;
          }
        }
        break;

      case "touchmove":
        for (let i = 0; i < touchEvent.touches.length; i++) {
          const touch = touchEvent.touches[i];
          if (
            this.activeTouches.has(touch.identifier) &&
            this.initialX !== null
          ) {
            const actions: VehicleAction[] = [];
            actions.push(VehicleAction.ACCELERATE); // Assume acceleration for the demonstration

            if (touch.clientX < this.initialX) {
              actions.push(VehicleAction.TURN_LEFT);
            } else if (touch.clientX > this.initialX) {
              actions.push(VehicleAction.TURN_RIGHT);
            }

            this.callback(actions);
          }
        }
        break;

      case "touchend":
      case "touchcancel":
        for (let i = 0; i < touchEvent.changedTouches.length; i++) {
          const touch = touchEvent.changedTouches[i];
          this.activeTouches.delete(touch.identifier);
        }

        if (this.activeTouches.size === 0) {
          this.initialX = null;
        }
        break;

      default:
        break;
    }
  };
}

export default TouchToVehicleAdapter;
