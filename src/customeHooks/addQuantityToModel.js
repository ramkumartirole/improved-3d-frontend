// this function use in White Van Component

export const getAddedQuantity = (label, addedModels) =>
    addedModels?.filter((m) => m.label === label).length;


