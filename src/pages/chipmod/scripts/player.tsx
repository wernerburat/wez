/**
 * Player class to read and play chiptune music using .mod files.
 */
export class Player {
  audioContext: AudioContext;
  source: AudioBufferSourceNode | null;

  constructor() {
    // Initialize player properties
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.source = null;
  }
  /**
   * Load and play a .mod file.
   * @param {string} filePath - Path to the .mod file.
   */
  play(input: string | ArrayBuffer): void {
    if (typeof input === "string") {
      // Load the .mod file
      this.loadModFile(input)
        .then((modData) => {
          // Play the .mod file
          this.playModFile(modData);
        })
        .catch((error) => {
          console.error("Error loading .mod file:", error);
        });
    } else if (input instanceof ArrayBuffer) {
      this.playModFile(input);
    }
  }
  /**
   * Load a .mod file.
   * @param {string} filePath - Path to the .mod file.
   * @returns {Promise} - Promise that resolves with the .mod file data.
   */
  loadModFile(filePath: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", filePath, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Failed to load .mod file: ${xhr.status}`));
        }
      };
      xhr.onerror = () => {
        reject(new Error("Error loading .mod file"));
      };
      xhr.send();
    });
  }
  /**
   * Play a .mod file.
   * @param {ArrayBuffer} modData - .mod file data.
   */
  playModFile(modData: ArrayBuffer): void {
    this.audioContext.decodeAudioData(modData, (buffer) => {
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = buffer;
      this.source.connect(this.audioContext.destination);
      this.source.start();
    });
  }

  /**
   * Stop playing the current .mod file.
   */
  stop(): void {
    if (this.source) {
      this.source.stop();
    }
  }
}
