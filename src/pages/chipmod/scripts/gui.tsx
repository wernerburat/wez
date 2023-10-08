import type { Player } from "./player";

/**
 * GUI class to create the graphical user interface and handle drag and drop functionality.
 */
export class GUI {
  player: Player; // Define the type of player if it's not any.
  dropZone: HTMLElement | null;
  fileInput: HTMLInputElement | null;
  constructor(player: Player) {
    // Initialize GUI properties
    this.player = player;
    this.dropZone = document.getElementById("drop-zone");
    this.fileInput = document.getElementById("file-input") as HTMLInputElement;
  }
  /**
   * Initialize the drag and drop functionality.
   */
  initDragAndDrop(): void {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      this.dropZone?.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      this.dropZone?.addEventListener(eventName, () => {
        this.dropZone?.classList.add("highlight");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      this.dropZone?.addEventListener(eventName, () => {
        this.dropZone?.classList.remove("highlight");
      });
    });

    this.dropZone?.addEventListener("drop", (e) => {
      if (e.dataTransfer) {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          this.handleFile(files[0] as File);
        }
      }
    });

    this.fileInput?.addEventListener("change", () => {
      const files = this.fileInput?.files;
      if (files && files.length > 0) {
        this.handleFile(files[0] as File);
      }
    });
  }
  /**
   * Handle the dropped or selected file.
   * @param {File} file - The dropped or selected file.
   */
  handleFile(file: File): void {
    if (file.name.endsWith(".mod")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.player.play(reader.result as ArrayBuffer); // Type assertion here.
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.error("Invalid file format. Please select a .mod file.");
    }
  }
}
