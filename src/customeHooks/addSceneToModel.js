// this function use in White Van Component
import { MAX_QUANTITY } from "./maxQuatity";
import { getAddedQuantity } from "./addQuantityToModel";
import { focusOnModel } from "./cameraPosition";

export const addModelToScene = (model, addedModels, setAddedModels, setActiveModelId, modelRefs, cameraRef, orbitControlsRef) => {
  const maxQty = MAX_QUANTITY[model.label] || 1;
  const currentQty = getAddedQuantity(model.label, addedModels);

  if (currentQty >= maxQty) return;

  // Define ceiling types
  const ceilingTypes = ['ceiling', 'wall-ceiling', 'wall-ceiling-door-panel'];

  const isCeiling = ceilingTypes.includes(model.type);
  const isWallCeilingDoorPanel = model.type === 'wall-ceiling-door-panel';
  const isWallPanel = model.type.startsWith('wall-panel'); // Checks for any wall-panel type

  let filtered = addedModels;

  // Case 1: Adding wall-ceiling-door-panel - remove all ceiling types
  if (isWallCeilingDoorPanel) {
    filtered = addedModels.filter(m =>
      m.type !== 'wall-panel' &&            // Remove wall-ceiling
      m.type !== 'ceiling' &&
      m.type !== 'door-panel' &&
      m.type !== 'wall-ceiling' &&  // Remove door panel
      (maxQty === 1 ? m.type !== model.type : true) // Enforce quantity if needed
    );
  }

  // Case 2: Adding any wall panel - remove wall-ceiling-door-panel
  else if (isWallPanel) {
    filtered = addedModels.filter(m =>
      m.type !== 'wall-ceiling' &&            // Remove wall-ceiling
      m.type !== 'wall-ceiling-door-panel' && // Remove door panel
      (maxQty === 1 ? m.type !== model.type : true) // Enforce quantity if needed
    );
  }
  else if (model.type === 'wall-ceiling') {
    filtered = addedModels.filter(m =>           // Remove wall-ceiling
      m.type !== 'wall-ceiling-door-panel' && // Remove door panel
      (maxQty === 1 ? m.type !== model.type : true) // Enforce quantity if needed
    );
  }

  // Case 3: Adding ceiling - remove other ceiling types
  else if (isCeiling) {
    filtered = addedModels.filter(m => !ceilingTypes.includes(m.type));
  }
  // Default case for other models
  else if (maxQty === 1) {
    filtered = addedModels.filter(m => m.type !== model.type);
  }

  const newModel = {
    ...model,
    id: Date.now(),
    position: [0, 0, 0],
  };

  setActiveModelId(newModel.id);

  setTimeout(() => {
    const ref = modelRefs.current[newModel.id];
    if (ref && cameraRef.current && orbitControlsRef.current) {
      focusOnModel(model, ref, cameraRef.current, orbitControlsRef.current);
    }
  }, 100);

  setAddedModels([...filtered, newModel]);
};