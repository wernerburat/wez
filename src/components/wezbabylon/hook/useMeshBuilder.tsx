import { MeshBuilder } from "@babylonjs/core";
import { useBabylon } from "../context/BabylonContext";
import type * as MeshOptions from "../type/MeshOptionsTypes";

const useMeshBuilder = () => {
  const { scene } = useBabylon();

  const createBox = (name: string, options?: MeshOptions.CreateBoxOptions) =>
    MeshBuilder.CreateBox(name, options, scene);
  const createSphere = (
    name: string,
    options?: MeshOptions.CreateSphereOptions,
  ) => MeshBuilder.CreateSphere(name, options, scene);
  const createCylinder = (
    name: string,
    options?: MeshOptions.CreateCylinderOptions,
  ) => MeshBuilder.CreateCylinder(name, options, scene);
  const createPlane = (
    name: string,
    options?: MeshOptions.CreatePlaneOptions,
  ) => MeshBuilder.CreatePlane(name, options, scene);
  const createGround = (
    name: string,
    options?: MeshOptions.CreateGroundOptions,
  ) => MeshBuilder.CreateGround(name, options);
  const createTorus = (
    name: string,
    options?: MeshOptions.CreateTorusOptions,
  ) => MeshBuilder.CreateTorus(name, options);
  const createIcoSphere = (
    name: string,
    options?: MeshOptions.CreateIcoSphereOptions,
  ) => MeshBuilder.CreateIcoSphere(name, options, scene);
  const createTiledBox = (
    name: string,
    options: MeshOptions.CreateTiledBoxOptions,
  ) => MeshBuilder.CreateTiledBox(name, options, scene);
  const createTiledPlane = (
    name: string,
    options: MeshOptions.CreateTiledPlaneOptions,
  ) => MeshBuilder.CreateTiledPlane(name, options, scene);
  const createTiledGround = (
    name: string,
    options: MeshOptions.CreateTiledGroundOptions,
  ) => MeshBuilder.CreateTiledGround(name, options, scene);
  const createTube = (name: string, options: MeshOptions.CreateTubeOptions) =>
    MeshBuilder.CreateTube(name, options, scene);
  const createPolyhedron = (
    name: string,
    options: MeshOptions.CreatePolyhedronOptions,
  ) => MeshBuilder.CreatePolyhedron(name, options, scene);
  const createGeodesic = (
    name: string,
    options: MeshOptions.CreateGeodesicOptions,
  ) => MeshBuilder.CreateGeodesic(name, options, scene);
  const createGoldberg = (
    name: string,
    options: MeshOptions.CreateGoldbergOptions,
  ) => MeshBuilder.CreateGoldberg(name, options, scene);
  const createCapsule = (
    name: string,
    options: MeshOptions.CreateCapsuleOptions,
  ) => MeshBuilder.CreateCapsule(name, options, scene);
  const createDisc = (name: string, options: MeshOptions.CreateDiscOptions) =>
    MeshBuilder.CreateDisc(name, options, scene);
  const createRibbon = (
    name: string,
    options: MeshOptions.CreateRibbonOptions,
  ) => MeshBuilder.CreateRibbon(name, options, scene);

  // TODO: MeshOptions.CreateText in its own hook

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
