export const TYPE_CONFLICTS = {
  "wall-ceiling-door-panel": [
    "ceiling",
    "wall-panel",
    "wall-ceiling",
    "door-panel",
  ],
  "wall-ceiling": [
    "ceiling",
    "wall-panel",
    "wall-ceiling",
    "wall-ceiling-door-panel",
  ],
  ceiling: ["wall-ceiling-door-panel", "wall-ceiling", "ceiling"],
  "wall-panel": ["wall-ceiling-door-panel", "wall-ceiling", "wall-panel"],
  "door-panel": ["wall-ceiling-door-panel", "door-panel"],
};

export const stepDescriptions = {
  "Driver’s Area": "Enhance the driver's cabin for functionality.",
  "Behind the Driver": "Optimize space behind the driver's seat.",
  "Bed/Dinette": "Design a versatile sleeping and dining space.",
  Shower: "Incorporate efficient bathroom solutions.",
  "Behind the Passenger Seat":
    "Finish off your design by perfecting the overhead details.",
  Panel: "Customize interior surfaces.",
  "Rear-View": "Add features to the rear of the van.",
  Roof: "Enhance the roof with functional elements.",
  Windows: "Select window options for your van.",
  "Right-Side": "Customize the right side of the van.",
  "Left-Side": "Customize the left side of the van.",
  Climate: "Manage your van's climate systems.",
  Power: "Configure your van's power sources.",
  Ventilation: "Set up ventilation systems.",
};

export const groupByGroup = (models) => {
  return models.reduce((acc, model) => {
    if (!acc[model.group]) acc[model.group] = [];
    acc[model.group].push(model);
    return acc;
  }, {});
};

export const getStepsByTab = (
  tab,
  interiorModels,
  exteriorModels,
  systemModels
) => {
  const interiorSteps = Object.entries(groupByGroup(interiorModels));
  const exteriorSteps = Object.entries(groupByGroup(exteriorModels));
  const systemSteps = Object.entries(groupByGroup(systemModels));

  if (tab === "interior") return interiorSteps;
  if (tab === "exterior") return exteriorSteps;
  return systemSteps;
};

export const getFilteredSelectedModels = (
  currentLabel,
  currentType,
  allModels
) => {
  const conflictingTypes = TYPE_CONFLICTS[currentType] || [];
  return (prevSelected) => {
    return new Set(
      [...prevSelected].filter((label) => {
        const model = allModels.find((m) => m.label === label);
        return (
          model &&
          model.type !== currentType &&
          !conflictingTypes.includes(model.type)
        );
      })
    );
  };
};
