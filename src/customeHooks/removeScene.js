export const removeModelFromScene = (label, setAddedModels) => {
    setAddedModels((prev) => prev.filter((m) => m.label !== label));
};