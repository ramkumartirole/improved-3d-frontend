// utils/centerModel.js
import * as THREE from "three";

export function centerModelByBoundingBox(objectRef) {
  if (!objectRef || !objectRef.current) return;

  const box = new THREE.Box3().setFromObject(objectRef.current);
  const center = new THREE.Vector3();
  box.getCenter(center);

  objectRef.current.position.sub(center);
}
