
// import * as THREE from "three";

// export const handleDragEnd = ({
//   groupRef,
//   activeModelId,
//   setAddedModels,
//   setPosition,
//   addToHistory,
//   setHistory,
//   setFuture,
//   setPivotResetCounter
// }) => {
//   if (!groupRef.current || !activeModelId) return;

//   requestAnimationFrame(() => {
//     groupRef.current.updateMatrixWorld(true);
//     const worldPos = new THREE.Vector3();
//     groupRef.current.getWorldPosition(worldPos);
//     const newPos = [worldPos.x, worldPos.y, worldPos.z];

//     setPosition(newPos);
//     addToHistory(newPos, setHistory, setFuture);

//     setAddedModels((prev) =>
//       prev.map((m) =>
//         m.id === activeModelId ? { ...m, position: newPos } : m
//       )
//     );

//     setPivotResetCounter((prev) => prev + 1);
//   });
// };

// export const addToHistory = (newPos, setHistory, setFuture) => {
//   setHistory((prev) => [...prev, newPos]);
//   setFuture([]);
// };

// export const handleUndo = ({
//   history,
//   setHistory,
//   setFuture,
//   setPosition,
//   groupRef,
//   activeModelId,
//   setAddedModels
// }) => {
//   if (history.length <= 1) return;
//   const previous = history[history.length - 2];
//   const current = history[history.length - 1];

//   setFuture((prev) => [current, ...prev]);
//   setHistory((prev) => prev.slice(0, -1));
//   setPosition(previous);

//   if (groupRef.current) {
//     groupRef.current.position.set(...previous);
//     groupRef.current.updateMatrixWorld(true);
//   }

//   setAddedModels((prev) =>
//     prev.map((m) =>
//       m.id === activeModelId ? { ...m, position: previous } : m
//     )
//   );
// };

// export const handleRedo = ({
//   future,
//   setFuture,
//   setHistory,
//   setPosition,
//   groupRef,
//   activeModelId,
//   setAddedModels
// }) => {
//   if (future.length === 0) return;
//   const [next, ...rest] = future;

//   setFuture(rest);
//   setHistory((prev) => [...prev, next]);
//   setPosition(next);

//   if (groupRef.current) {
//     groupRef.current.position.set(...next);
//     groupRef.current.updateMatrixWorld(true);
//   }

//   setAddedModels((prev) =>
//     prev.map((m) =>
//       m.id === activeModelId ? { ...m, position: next } : m
//     )
//   );
// };

  // export const incrementModelQuantity = (model, addedModels, setAddedModels, setActiveModelId, setPopupMessage, setShowPopup) => {
  //   const quantity = getAddedQuantity(model.label, addedModels);
  //   if (quantity >= MAX_QUANTITY[model.label]) {
  //     setPopupMessage(`You can add only ${MAX_QUANTITY[model.label]} ${model.label}`);
  //     setShowPopup(true);
  //     setTimeout(() => setShowPopup(false), 2000);
  //     return;
  //   }

  //   const newModel = {
  //     ...model,
  //     id: Date.now(),
  //     position: [0, 0, 0],
  //   };

  //   setActiveModelId(newModel.id);
  //   setAddedModels((prev) => [...prev, newModel]);
  // };

  // export const decrementModelQuantity = (label, setAddedModels) => {
  //   setAddedModels((prev) => {
  //     const matches = prev.filter((m) => m.label === label);
  //     if (matches.length === 0) return prev;

  //     const toRemove = matches.reduce((a, b) => (a.id > b.id ? a : b));
  //     return prev.filter((m) => m.id !== toRemove.id);
  //   });
  // };
