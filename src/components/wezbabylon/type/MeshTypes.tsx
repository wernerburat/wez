import {
  type Mesh,
  type StandardMaterial,
  type DynamicTexture,
  type Vector3,
  type Color3,
} from "@babylonjs/core";

// BabylonBox is a type alias for the Mesh from BabylonJS. You can extend or restrict its definition as needed.
export type BabylonBox = Mesh;

// Describes a simple material configuration for a mesh.
export interface SimpleMaterialConfig {
  color?: Color3;
  alpha?: number;
  texture?: DynamicTexture;
}

// Describes the position configuration for a mesh.
export interface MeshPositionConfig {
  position?: Vector3;
  rotation?: Vector3;
  scaling?: Vector3;
}

// Defines a complete configuration for creating a new mesh.
export interface MeshCreationConfig {
  name: string;
  material?: StandardMaterial | SimpleMaterialConfig;
  position?: MeshPositionConfig;
}

// More mesh-related types can be added here as your project grows.
