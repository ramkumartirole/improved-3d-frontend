import * as THREE from 'three';

// Detect which side of the van the object is on
export const detectObjectSide = (object3D) => {
  if (!object3D) return 'front';

  const position = object3D.getWorldPosition(new THREE.Vector3());
  const absX = Math.abs(position.x);
  const absZ = Math.abs(position.z);

  if (absX > absZ) {
    return position.x > 0 ? 'right' : 'left';
  } else {
    return position.z > 0 ? 'back' : 'front';
  }
};

// Rotate van to show specific side (matches your ViewButtons positions)
export const rotateVanToSide = (side, orbitControls) => {
  if (!orbitControls) return;

  const views = {
    front: { position: [0, 0, 6], target: [0, 0, 0] },
    back: { position: [0, 0, -6], target: [0, 0, 0] },
    left: { position: [5, 0, 0], target: [0, 0, 0] },
    right: { position: [-5, 0, 0], target: [0, 0, 0] },
    top: { position: [0, 8, 0], target: [0, 0, 0] }
  };

  const view = views[side] || views.front;
  orbitControls.object.position.set(...view.position);
  orbitControls.target.set(...view.target);
  orbitControls.update();
};