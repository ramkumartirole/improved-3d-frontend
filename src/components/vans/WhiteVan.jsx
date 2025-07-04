import {
  useEffect,
  Suspense,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import {
  OrbitControls,
  Environment,
  PivotControls,
  Preload,
  Center,
} from "@react-three/drei";

import {
  toggleRotate
} from "../../customeHooks/toogleModelRotate"
import {
  addModelToScene,
} from "../../customeHooks/addSceneToModel"
import {
  getAddedQuantity,
} from "../../customeHooks/addQuantityToModel"
import {
  removeModelFromScene,
} from "../../customeHooks/removeScene"
import ViewButtons from "../buttons/ViewButtons"
import MultiStepForm from "../../MultiStepForm";
import Van_White from "../van-models/WhiteVan";
import { ModelPreloader } from "../model-preloader/modelPreloader";
import { useVanContext } from "../../context/VanContext";
import PropTypes from "prop-types";
import { Canvas, useThree } from "@react-three/fiber";
import { focusOnModel } from "../../customeHooks/cameraPosition";



const ExportableScene = forwardRef(({ exportSceneCallback }, ref) => {
  const { scene } = useThree();

  useEffect(() => {
    exportSceneCallback(scene);
  }, [scene]);

  useImperativeHandle(ref, () => ({
    getScene: () => scene,
  }));

  return null;
});
ExportableScene.displayName = "ExportableScene";
ExportableScene.propTypes = {
  exportSceneCallback: PropTypes.func.isRequired,
};

function WhiteVan() {
  // const [popupMessage, setPopupMessage] = useState("");
  // const [showPopup, setShowPopup] = useState(false);
  // const [position, setPosition] = useState([0, 0, 0]);
  // const [history, setHistory] = useState([[0, 0, 0]]);
  // const [future, setFuture] = useState([]);
  // const [uploadProgress, setUploadProgress] = useState(0);
  // const [uploadSuccess, setUploadSuccess] = useState(false);
  // const [pivotResetCounter, setPivotResetCounter] = useState(0);
  // const [isPivotoff, setisPivotoff] = useState(false);
  // const [isSelected, setIsSelected] = useState(false);
  // const [enableRotate, setEnableRotate] = useState(false);
  const { vanName } = useVanContext();
  const [enableRotate, setEnableRotate] = useState(false);
  const pivotResetCounter = 0;
  const isPivotoff = false;
  const isSelected = false;
  const [addedModels, setAddedModels] = useState([]);
  const [activeModelId, setActiveModelId] = useState(null);
  const [sceneToExport, setSceneToExport] = useState(null);
  const [showExterior, setShowExterior] = useState(false);
  // const groupRef = useRef();
  const orbitControlsRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const modelRefs = useRef({});


  // const currentModel = addedModels.find((m) => m.id === activeModelId);

  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     const speed = 0.5;
  //     if (event.ctrlKey && (event.key === "z" || event.key === "y")) {
  //       event.preventDefault();
  //       const undoRedoParams = {
  //         history,
  //         setHistory,
  //         setFuture,
  //         setPosition,
  //         groupRef,
  //         activeModelId,
  //         setAddedModels,
  //       };
  //       event.key === "z" ? handleUndo(undoRedoParams) : handleRedo(undoRedoParams);
  //       return;
  //     }

  //     if (!currentModel) return;

  //     const newPos = [...currentModel.position || [0, 0, 0]];
  //     switch (event.key) {
  //       case "ArrowUp": newPos[1] += speed; break;
  //       case "ArrowDown": newPos[1] -= speed; break;
  //       case "ArrowLeft": newPos[0] -= speed; break;
  //       case "ArrowRight": newPos[0] += speed; break;
  //       case "PageUp": newPos[2] += speed; break;
  //       case "PageDown": newPos[2] -= speed; break;
  //       default: return;
  //     }

  //     setPosition(newPos);
  //     addToHistory(newPos, setHistory, setFuture);
  //     groupRef.current?.position.set(...newPos);
  //     groupRef.current?.updateMatrixWorld(true);

  //     setAddedModels((prev) =>
  //       prev.map((model) =>
  //         model.id === activeModelId ? { ...model, position: newPos } : model
  //       )
  //     );
  //     setPivotResetCounter((prev) => prev + 1);
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [activeModelId, addedModels, history, future]);

  useEffect(() => {
    return () => {
      sceneToExport?.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
    };
  }, [sceneToExport]);
  ModelPreloader(vanName)





const CameraAssigner = ({ cameraRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (cameraRef) {
      cameraRef.current = camera;
    }
  }, [camera]);

  return null;
};



  return (
    <div className="container-fluid">
      <div className="row d-flex">
        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 d-flex justify-content-center">
          <ViewButtons
            orbitControlsRef={orbitControlsRef}
            toggleRotate={() => toggleRotate(setEnableRotate)}
          />
          <Suspense fallback={<span className="loading">Loading...</span>}>
            <div className="canvas-container">
              <Canvas
              ref={cameraRef}
                gl={{ preserveDrawingBuffer: true }}
                shadows={{ type: "PCFSoftShadowMap" }}
                dpr={[1, 1.2]}
                camera={{ position: [-4, 3, -4.8], fov: 50 }}
                frameloop="demand"
              >
                 <CameraAssigner cameraRef={cameraRef} />

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
                  <Van_White showExterior={showExterior} />
                  {addedModels.map((model) => {
                    const ModelComponent = model.component;
                    const isActive = activeModelId === model.id;
                    const keyVal = isActive ? `${model.id}-${pivotResetCounter}` : model.id;

                    return (
                      <PivotControls
                        key={keyVal}
                        depthTest={false}
                        annotations={true}
                        anchor={[0, 0, 0]}
                        scale={1.5}
                        disableScaling={true}
                        disableRotations={true}
                        disableSliders={false}
                        opacity={0.9}
                        hoveredColor={0xfff200}
                        enabled={isPivotoff && isActive}
                        onClick={(e) => {
                          e.stopPropagation();
                          focusOnModel(
                            modelRefs.current[model.id],
                            cameraRef.current,
                            orbitControlsRef.current
                          );
                        }}
                      // onDragEnd={() =>
                      //   handleDragEnd({
                      //     showExterior,
                      //     groupRef,
                      //     activeModelId,
                      //     setAddedModels,
                      //     setPosition,
                      //     // addToHistory,
                      //     setHistory,
                      //     setFuture,
                      //     setPivotResetCounter,
                      //   })
                      // }
                      >
                        <group
                         ref={(el) => {
                          if (el) {
                            modelRefs.current[model.id] = el;
                          }
                        }}
                        position={model.position}
                          // ref={isActive ? groupRef : null}
                          // position={model.position}
                        >
                          <ModelComponent
                            onClick={() => setActiveModelId(model.id)}
                            isSelected={isActive}
                          />
                        </group>
                      </PivotControls>
                    );
                  })}
                </Center>
                <OrbitControls
                  ref={orbitControlsRef}
                  makeDefault
                  enableRotate={enableRotate}
                  enableZoom
                  enablePan={false}
                  maxPolarAngle={Math.PI / 2}
                  maxDistance={10}
                  minDistance={0.1 }
                
                />
                <ExportableScene
                  ref={sceneRef}
                  exportSceneCallback={setSceneToExport}
                />
              </Canvas>
            </div>
          </Suspense>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 d-flex justify-content-center align-items-center">
          <MultiStepForm
            isSelected={isSelected}
            addModelToScene={(m) =>
              addModelToScene(m, addedModels, setAddedModels, setActiveModelId, modelRefs, cameraRef, orbitControlsRef)
            }
            removeModelFromScene={(label) =>
              removeModelFromScene(label, setAddedModels)
            }
            // incrementModelQuantity={(m) =>
            //   incrementModelQuantity(m, addedModels, setAddedModels, setActiveModelId, setPopupMessage, setShowPopup)
            // }
            // decrementModelQuantity={(label) =>
            //   decrementModelQuantity(label, setAddedModels)
            // }
            // setUploadProgress={setUploadProgress}
            // setUploadSuccess={setUploadSuccess}
            // uploadProgress={uploadProgress}
            getAddedQuantity={(label) => getAddedQuantity(label, addedModels)}
            showExterior={showExterior}
            toggleExterior={setShowExterior}
            setActiveModelId={setActiveModelId}
            sceneRef={sceneRef}

          />
        </div>
      </div>
    </div>
  );
}

export default WhiteVan;
