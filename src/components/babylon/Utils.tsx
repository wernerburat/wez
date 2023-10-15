import {
  Animation,
  CubicEase,
  EasingFunction,
  type AbstractMesh,
  type ArcRotateCamera,
  type Vector3,
} from "@babylonjs/core";

function createAnimation({
  property,
  from,
  to,
}: {
  property: string;
  from: number;
  to: number;
}): Animation {
  const ease = new CubicEase();
  ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

  const animation = new Animation(
    property,
    property,
    60,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  animation.setKeys([
    { frame: 0, value: from },
    { frame: 100, value: to },
  ]);
  animation.setEasingFunction(ease);

  return animation;
}

export const moveMesh = (mesh: AbstractMesh, target: Vector3) => {
  const animations = [
    createAnimation({
      property: "position.x",
      from: mesh.position.x,
      to: target.x,
    }),
    createAnimation({
      property: "position.y",
      from: mesh.position.y,
      to: target.y,
    }),
    createAnimation({
      property: "position.z",
      from: mesh.position.z,
      to: target.z,
    }),
  ];

  mesh.animations = animations;
  mesh.getScene().beginAnimation(mesh, 0, 100, false);
};

export const moveActiveCamera = (
  camera: ArcRotateCamera,
  target: Vector3,
  resetAlpha: boolean,
) => {
  const animations = [
    createAnimation({ property: "beta", from: camera.beta, to: Math.PI / 3 }),
    createAnimation({ property: "radius", from: camera.radius, to: 7 }),
    createAnimation({
      property: "target.x",
      from: camera.target.x,
      to: target.x,
    }),
    createAnimation({
      property: "target.y",
      from: camera.target.y,
      to: target.y,
    }),
    createAnimation({
      property: "target.z",
      from: camera.target.z,
      to: target.z,
    }),
  ];
  if (resetAlpha) {
    animations.push(
      createAnimation({
        property: "alpha",
        from: camera.alpha,
        to: -Math.PI / 2,
      }),
    );
  }

  camera.animations = animations;
  camera.getScene().beginAnimation(camera, 0, 100, false);
};
