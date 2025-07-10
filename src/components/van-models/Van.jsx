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
  PerspectiveCamera,
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
import Van_White from "../van-models/Van";
import { ModelPreloader } from "../model-preloader/modelPreloader";
import { useVanContext } from "../../context/VanContext";
import PropTypes from "prop-types";
import { Canvas, useThree } from "@react-three/fiber";
import GIFVanLoader from "../loader/index";
import { centerModelByBoundingBox } from "../../customeHooks/centerCanvas";




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

function Van() {

  const { vanName } = useVanContext();

  const [enableRotate, setEnableRotate] = useState(false);
  const pivotResetCounter = 0;
  const isPivotoff = false;
  const isSelected = false;
  const [addedModels, setAddedModels] = useState([]);
  const [activeModelId, setActiveModelId] = useState(null);
  const [sceneToExport, setSceneToExport] = useState(null);
  const [showExterior, setShowExterior] = useState(false);

  const orbitControlsRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const modelRefs = useRef({});
  const groupRef = useRef();
  const interiorOrbitControlsRef = useRef(); // ✅ creates a ref


  const [isInteriorView, setIsInteriorView] = useState(false);

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



  useEffect(() => {
    centerModelByBoundingBox(groupRef)

      }, [groupRef]);

  return (
    <div className="container-fluid">
      <div className="row d-flex">

        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 d-flex justify-content-center">

          <ViewButtons
            orbitControlsRef={orbitControlsRef}
            toggleRotate={() => toggleRotate(setEnableRotate)}
          />

          <Suspense fallback={<GIFVanLoader />}>



            <div className="canvas-container" style={{ position: 'relative' }}>


              <Canvas

                gl={{ preserveDrawingBuffer: true }}
                shadows={{ type: "PCFSoftShadowMap" }}
                dpr={[1, 1.2]}
                camera={{ position: [-4, 3, -4.8], fov: 50 }}
                frameloop="demand"
              >

                <PerspectiveCamera
                  makeDefault={!isInteriorView}
                  ref={cameraRef}
                  fov={50}
                  position={[-4, 3, -4.8]}
                />
                <PerspectiveCamera
                  makeDefault={isInteriorView}
                  ref={cameraRef}
                  fov={30}
                  position={[0, 1.3,-1]}
                />
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
                <group ref={groupRef}  position={isInteriorView ? [0, 0, 0] : [0, -1.3, 0]}>
                      <Van_White showExterior={showExterior}/>
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


                        >
                          <group
                            ref={(el) => {
                              if (el) {
                                // groupRef.current = el;
                                modelRefs.current[model.id] = el;
                              }
                            }}
                            position={model.position}

                          >
                            <ModelComponent
                              onClick={() => setActiveModelId(model.id)}
                              isSelected={isActive}
                            />
                          </group>
                        </PivotControls>
                      );
                    })}


                    </group>
                    {isInteriorView && (
  <OrbitControls
    ref={interiorOrbitControlsRef}
    args={[cameraRef.current]} // use current camera + canvas
    enableZoom={false}
    enablePan={false}
    enableRotate={true}
    minPolarAngle={Math.PI / 3}  // ⬆️ Look up limit (optional)
    maxPolarAngle={Math.PI / 1.8} // ⬇️ Look down limit (optional)
    minAzimuthAngle={-Infinity} // ⬅️ rotate unlimited
    maxAzimuthAngle={Infinity}  // ➡️ rotate unlimited
    target={[0, 1.5, 1]} // 🟡 Focus point in the center of van
  />
)}

                <OrbitControls
    ref={orbitControlsRef}
    args={[cameraRef.current]}
    enableRotate={enableRotate}
    enableZoom={enableRotate} // Disable zoom in interior view if needed
    enablePan={false}
    maxPolarAngle={Math.PI / 2}
    minPolarAngle={0}

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
              addModelToScene(m, addedModels, setAddedModels, setActiveModelId, modelRefs, cameraRef, orbitControlsRef, setEnableRotate)
            }
            removeModelFromScene={(label) =>
              removeModelFromScene(label, setAddedModels)
            }

            getAddedQuantity={(label) => getAddedQuantity(label, addedModels)}
            showExterior={showExterior}
            toggleExterior={setShowExterior}
            setActiveModelId={setActiveModelId}
            sceneRef={sceneRef}

          />
        </div>
      </div>
      <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '35%',
          zIndex: 1000
        }}>
          <button
          onClick={() => setIsInteriorView(!isInteriorView)}
            className="btn btn-dark"
                      >
interior view button

          </button>
        </div>
    </div>
  );
}

export default Van;
