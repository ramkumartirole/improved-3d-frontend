// this function use in White Van Component
import { MAX_QUANTITY } from "./maxQuatity";
import { getAddedQuantity } from "./addQuantityToModel";
import { focusOnModel } from "./cameraPosition";

export const addModelToScene = (model, addedModels, setAddedModels, setActiveModelId, modelRefs, cameraRef, orbitControlsRef) => {
    const maxQty = MAX_QUANTITY[model.label] || 1;
    const currentQty = getAddedQuantity(model.label, addedModels);
    if (currentQty >= maxQty) return;
    const filtered =
      maxQty === 1
        ? addedModels.filter((m) => m.type !== model.type)
        : [...addedModels];

    const newModel = {
      ...model,
      id: Date.now(),
      position: [0, 0, 0],
    };
    // focusOnModel(newModel);
    setActiveModelId(newModel.id);

    setTimeout(() => {
      const ref = modelRefs.current[newModel.id];
      if (ref && cameraRef.current && orbitControlsRef.current) {
        focusOnModel(ref, cameraRef.current, orbitControlsRef.current);
      }
    }, 100);
    setAddedModels([...filtered, newModel]);
  };