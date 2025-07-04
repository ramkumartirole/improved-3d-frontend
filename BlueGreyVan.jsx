import React, {
  useEffect,
  lazy,
  Suspense,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Preload, Center } from "@react-three/drei";

import ViewButtons from "./components/ViewButtons";
import MultiStepForm from "./MultiStepForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

const Van_BlueGrey = lazy(() => import("./components/van-models/BlueVan"));

const ExportableScene = forwardRef(({ exportSceneCallback }, ref) => {
  const { scene } = useThree();

  useEffect(() => {
    exportSceneCallback(scene);
  }, [scene, exportSceneCallback]);

  useImperativeHandle(ref, () => ({
    getScene: () => scene,
  }));

  return null;
});

ExportableScene.displayName = "ExportableScene";

function BlueGreyVan() {
  const [addedModels, setAddedModels] = useState([]);
  const [activeModelId, setActiveModelId] = useState(null);
  const modelRefs = useRef({});
  const cameraRef = useRef();
  const orbitControlsRef = useRef();

  const MAX_QUANTITY = {
    Ceiling: 1,
    Kitchen: 1,
    Shower: 1,
    Microwave: 1,
    Flooring: 1,
  };

  const focusOnModel = (object3D, camera, controls) => {
    const box = new THREE.Box3().setFromObject(object3D);
    const center = new THREE.Vector3();
    const size = box.getSize(new THREE.Vector3());

    if (!box.isEmpty()) {
      box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      const offset = maxDim * 1.5;
      const direction = new THREE.Vector3(0.5, 0.5, 0.5).normalize();
      const newCamPos = center.clone().add(direction.multiplyScalar(offset));

      camera.position.copy(newCamPos);
      camera.lookAt(center);
      controls.target.copy(center);
      controls.update();
    }
  };

  const addModelToScene = (model) => {
    if (!model.component) {
      console.warn("No component provided for model:", model);
      return;
    }

    setAddedModels((prev) => {
      const maxQty = MAX_QUANTITY[model.type] || 1;

      let filtered = prev.filter((m) => m.type !== model.type);

      const newModel = {
        ...model,
        id: Date.now(),
        position: [0, 0, 0],
        component: model.component,
      };

      setTimeout(() => {
        const ref = modelRefs.current[newModel.id];
        if (ref && cameraRef.current && orbitControlsRef.current) {
          focusOnModel(ref, cameraRef.current, orbitControlsRef.current);
        }
      }, 300);

      setActiveModelId(newModel.id);
      return [...filtered, newModel];
    });
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex">
        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 d-flex justify-content-center">
          <ViewButtons
            orbitControlsRef={orbitControlsRef}
            toggleRotate={() => {}}
          />
          <Suspense fallback={<span className="loading">Loading...</span>}>
            <div className="canvas-container">
              <Canvas
                gl={{ preserveDrawingBuffer: true }}
                shadows={{ type: "PCFSoftShadowMap", autoUpdate: false }}
                dpr={[1, 1.2]}
                camera={{ position: [-4, 3, -4.8], fov: 50 }}
                frameloop="demand"
                onCreated={({ camera }) => (cameraRef.current = camera)}
              >
                <ambientLight intensity={0.25} />
                <Suspense fallback={null}>
                  <Environment
                    files="./textures/zwartkops_straight_afternoon_1k.hdr"
                    background={false}
                    environmentIntensity={1.2}
                  />
                </Suspense>
                <Preload all />
                <Center>
                  <Van_BlueGrey
                    hidePartsWhenFacingCamera={true}
                    showExterior={false}
                  />
                  {addedModels.map((model) => {
                    const ModelComponent = model.component;
                    if (!ModelComponent) return null;
                    return (
                      <group
                        key={model.id}
                        ref={(el) => {
                          if (el) modelRefs.current[model.id] = el;
                        }}
                        position={model.position}
                      >
                        <ModelComponent
                          onClick={() => {
                            setActiveModelId(model.id);
                            const ref = modelRefs.current[model.id];
                            if (
                              ref &&
                              cameraRef.current &&
                              orbitControlsRef.current
                            ) {
                              focusOnModel(
                                ref,
                                cameraRef.current,
                                orbitControlsRef.current
                              );
                            }
                          }}
                          isSelected={activeModelId === model.id}
                        />
                      </group>
                    );
                  })}
                </Center>
                <OrbitControls
                  ref={orbitControlsRef}
                  makeDefault
                  enableRotate={true}
                  enableZoom={true}
                  enablePan={false}
                  maxPolarAngle={Math.PI / 2}
                />
                <ExportableScene
                  ref={useRef()}
                  exportSceneCallback={() => {}}
                />
              </Canvas>
            </div>
          </Suspense>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 d-flex justify-content-center align-items-center">
          <MultiStepForm
            isSelected={false}
            addModelToScene={addModelToScene}
            removeModelFromScene={() => {}}
            incrementModelQuantity={() => {}}
            decrementModelQuantity={() => {}}
            getAddedQuantity={(label) =>
              addedModels.filter((m) => m.label === label).length
            }
            showExterior={false}
            toggleExterior={() => {}}
            setActiveModelId={setActiveModelId}
            setActiveExteriorModelId={() => {}}
            sceneRef={useRef()}
            setModelUrl={() => {}}
            setUploadProgress={() => {}}
            setUploadSuccess={() => {}}
            uploadProgress={0}
          />
        </div>
      </div>
    </div>
  );
}

export default BlueGreyVan;
