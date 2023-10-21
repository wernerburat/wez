enum VehicleAction {
  ACCELERATE = "ACCELERATE",
  TURN_LEFT = "TURN_LEFT",
  TURN_RIGHT = "TURN_RIGHT",
  BRAKE = "BRAKE",
  // ... other actions.
}

class KeyboardToVehicleAdapter {
  private callback: (actions: VehicleAction[]) => void;
  private activeKeys = new Set<string>();

  constructor(callback: (actions: VehicleAction[]) => void) {
    this.callback = callback;
    this.translateInput = this.translateInput.bind(this);
    this.processActions = this.processActions.bind(this);
  }

  translateInput = (inputEvent: KeyboardEvent): void => {
    if (inputEvent.type === "keydown") {
      this.activeKeys.add(inputEvent.key);
    } else if (inputEvent.type === "keyup") {
      this.activeKeys.delete(inputEvent.key);
    }

    this.processActions();
  };

  processActions(): void {
    const actions: VehicleAction[] = [];

    if (this.activeKeys.has("w")) {
      actions.push(VehicleAction.ACCELERATE);
    }
    if (this.activeKeys.has("a")) {
      actions.push(VehicleAction.TURN_LEFT);
    }
    if (this.activeKeys.has("d")) {
      actions.push(VehicleAction.TURN_RIGHT);
    }
    if (this.activeKeys.has("s")) {
      actions.push(VehicleAction.BRAKE);
    }

    this.callback(actions);
  }
}

export default KeyboardToVehicleAdapter;
export { VehicleAction };
