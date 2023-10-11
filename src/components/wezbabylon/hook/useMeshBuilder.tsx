import { MeshBuilder } from "@babylonjs/core";
import { useBabylon } from "../context/BabylonContext";

type CreateBoxOptions = Parameters<typeof MeshBuilder.CreateBox>[1];
type CreateSphereOptions = Parameters<typeof MeshBuilder.CreateSphere>[1];
type CreateCylinderOptions = Parameters<typeof MeshBuilder.CreateCylinder>[1];
type CreatePlaneOptions = Parameters<typeof MeshBuilder.CreatePlane>[1];
type CreateGroundOptions = Parameters<typeof MeshBuilder.CreateGround>[1];
type CreateTorusOptions = Parameters<typeof MeshBuilder.CreateTorus>[1];
type CreateIcoSphereOptions = Parameters<typeof MeshBuilder.CreateIcoSphere>[1];
type CreateTiledBoxOptions = Parameters<typeof MeshBuilder.CreateTiledBox>[1];
type CreateTiledPlaneOptions = Parameters<
  typeof MeshBuilder.CreateTiledPlane
>[1];
type CreateTiledGroundOptions = Parameters<
  typeof MeshBuilder.CreateTiledGround
>[1];
type CreateTubeOptions = Parameters<typeof MeshBuilder.CreateTube>[1];
type CreatePolyhedronOptions = Parameters<
  typeof MeshBuilder.CreatePolyhedron
>[1];
type CreateGeodesicOptions = Parameters<typeof MeshBuilder.CreateGeodesic>[1];
type CreateGoldbergOptions = Parameters<typeof MeshBuilder.CreateGoldberg>[1];
type CreateCapsuleOptions = Parameters<typeof MeshBuilder.CreateCapsule>[1];
type CreateDiscOptions = Parameters<typeof MeshBuilder.CreateDisc>[1];
type CreateRibbonOptions = Parameters<typeof MeshBuilder.CreateRibbon>[1];

const useMeshBuilder = () => {
  const { scene } = useBabylon();

  //if (!scene) throw new Error("No scene found in context");

  const createBox = (name: string, options?: CreateBoxOptions) =>
    MeshBuilder.CreateBox(name, options, scene);
  const createSphere = (name: string, options?: CreateSphereOptions) =>
    MeshBuilder.CreateSphere(name, options, scene);
  const createCylinder = (name: string, options?: CreateCylinderOptions) =>
    MeshBuilder.CreateCylinder(name, options, scene);
  const createPlane = (name: string, options?: CreatePlaneOptions) =>
    MeshBuilder.CreatePlane(name, options, scene);
  const createGround = (name: string, options?: CreateGroundOptions) =>
    MeshBuilder.CreateGround(name, options);
  const createTorus = (name: string, options?: CreateTorusOptions) =>
    MeshBuilder.CreateTorus(name, options);
  const createIcoSphere = (name: string, options?: CreateIcoSphereOptions) =>
    MeshBuilder.CreateIcoSphere(name, options, scene);
  const createTiledBox = (name: string, options: CreateTiledBoxOptions) =>
    MeshBuilder.CreateTiledBox(name, options, scene);
  const createTiledPlane = (name: string, options: CreateTiledPlaneOptions) =>
    MeshBuilder.CreateTiledPlane(name, options, scene);
  const createTiledGround = (name: string, options: CreateTiledGroundOptions) =>
    MeshBuilder.CreateTiledGround(name, options, scene);
  const createTube = (name: string, options: CreateTubeOptions) =>
    MeshBuilder.CreateTube(name, options, scene);
  const createPolyhedron = (name: string, options: CreatePolyhedronOptions) =>
    MeshBuilder.CreatePolyhedron(name, options, scene);
  const createGeodesic = (name: string, options: CreateGeodesicOptions) =>
    MeshBuilder.CreateGeodesic(name, options, scene);
  const createGoldberg = (name: string, options: CreateGoldbergOptions) =>
    MeshBuilder.CreateGoldberg(name, options, scene);
  const createCapsule = (name: string, options: CreateCapsuleOptions) =>
    MeshBuilder.CreateCapsule(name, options, scene);
  const createDisc = (name: string, options: CreateDiscOptions) =>
    MeshBuilder.CreateDisc(name, options, scene);
  const createRibbon = (name: string, options: CreateRibbonOptions) =>
    MeshBuilder.CreateRibbon(name, options, scene);

  // TODO: CreateText in its own hook

  return {
    createBox,
    createSphere,
    createCylinder,
    createPlane,
    createGround,
    createTorus,
    createIcoSphere,
    createTiledBox,
    createTiledPlane,
    createTiledGround,
    createTube,
    createPolyhedron,
    createGeodesic,
    createGoldberg,
    createCapsule,
    createDisc,
    createRibbon,
  };
};

export default useMeshBuilder;
