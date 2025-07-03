import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useVanContext } from "../../context/VanContext";

export default function Van_White({ showExterior }) {
  const { vanName } = useVanContext();
  const formattedVanName = vanName?.replace(/\s+/g, "_"); // "blue sky" → "blue_sky"
  const models = {
    White: "/models/AllColorGLB144/Van_White.glb",
    Black: "/models/AllColorGLB144/Van_Black.glb",
    Silver_Grey: "/models/AllColorGLB144/Van_SilverGrey.glb",
    Blue_Grey: "/models/AllColorGLB144/Van_BlueGrey.glb",
    Pebble: "/models/AllColorGLB144/Van_Pebble.glb",
    Stone_Grey: "/models/AllColorGLB144/Van_StoneGrey.glb",
    Graphite_Grey: "/models/AllColorGLB144/Van_GraphiteGrey.glb",
  };
  const selectedModelPath = models[formattedVanName] || models["White"];
  const { nodes, materials } = useGLTF(selectedModelPath);
  const { camera } = useThree();
  const groupRef = useRef();
  const driverSideRef = useRef();
  const passengerSideRef = useRef();
  const roofRef = useRef();
  const rearDoorRef = useRef();

  const meshWorldPosition = new THREE.Vector3();
  const vectorToCamera = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();
  const meshNormal = new THREE.Vector3();

  const isFacingCamera = (mesh, normalDirection) => {
    if (!mesh) return false;
    mesh.getWorldPosition(meshWorldPosition);
    vectorToCamera.subVectors(camera.position, meshWorldPosition).normalize();
    normalMatrix.getNormalMatrix(mesh.matrixWorld);
    meshNormal.copy(normalDirection).applyMatrix3(normalMatrix).normalize();
    return meshNormal.dot(vectorToCamera) > 0.3;
  };

  const parts = [
    { ref: driverSideRef, normal: new THREE.Vector3(1, 0, 0) },
    { ref: passengerSideRef, normal: new THREE.Vector3(-1, 0, 0) },
    { ref: roofRef, normal: new THREE.Vector3(0, 1, 0) },
    { ref: rearDoorRef, normal: new THREE.Vector3(0, 0, -1) },
  ];

  useFrame(() => {
    if (!groupRef.current) return;
    if (!showExterior) {
      parts.forEach(({ ref, normal }) => {
        if (ref.current) ref.current.visible = !isFacingCamera(ref.current, normal);
      });
    } else {
      parts.forEach(({ ref }) => {
        if (ref.current) ref.current.visible = true;
      });
    }
  });
  return (
    <group rotation={[0, 0, 0]} ref={groupRef} dispose={null}>
      <group position={[0.101, 1.17, 1.168]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh.geometry}
          material={materials["MainBody.1001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_1.geometry}
          material={materials["MainBody.1002"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_2.geometry}
          material={materials.Glass}
        />
      </group>

      <mesh
        ref={roofRef}
        castShadow
        receiveShadow
        geometry={nodes.Top.geometry}
        material={materials.RoofTop}
        position={[0.002, 2.594, -1.136]}
      />
      <mesh
        ref={rearDoorRef}
        castShadow
        receiveShadow
        geometry={nodes.Van_body004.geometry}
        material={materials.RearDoor}
        position={[0.03, 1.372, -2.807]}
      />
      <mesh
        ref={passengerSideRef}
        castShadow
        receiveShadow
        geometry={nodes.passenger_side.geometry}
        material={materials.SlidingDoor}
        position={[-0.897, 1.619, -1.629]}
      />
      <mesh
        ref={driverSideRef}
        castShadow
        receiveShadow
        geometry={nodes.driver_side.geometry}
        material={materials.DriverSide}
        position={[0.829, 1.832, -1.337]}
      />
    </group>
  );
}



