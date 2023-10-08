// Import necessary modules
import { Player } from "./player";
import { GUI } from "./gui";

// Initialize the player and GUI
const player = new Player();
const gui = new GUI(player);

// Initialize the drag and drop functionality
gui.initDragAndDrop();

export { player, gui };
