import { focusOnModel } from "./cameraPosition";

export const removeModelFromScene = (label, setAddedModels, modelRefs, cameraRef, orbitControlsRef) => {
 setAddedModels((prev) => prev.filter((m) => m.label !== label));

//  setTimeout(() => {
//     const ref = modelRefs.current[newModel.id];
//     if (ref && cameraRef.current && orbitControlsRef.current) {
//       focusOnModel(ref, cameraRef.current, orbitControlsRef.current);
//     }
//   }, 100);
};