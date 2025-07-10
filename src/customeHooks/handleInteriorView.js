// // export const handleInteriorView = (isInteriorView, setIsInteriorView, cameraRef, orbitControlsRef, setEnableRotate) => {
// //     const next = !isInteriorView;
// //     setIsInteriorView(next);

// //     if (next) {
// //       // Interior mode ON
// //       cameraRef.current.position.set(0, 1.6, 0);
// //       orbitControlsRef.current.target.set(0, 0.6, 0.6);
// //       orbitControlsRef.current.enablePan = false;
// //       orbitControlsRef.current.enableZoom = false;
// //       setEnableRotate(true);
// //       orbitControlsRef.current.maxDistance = 0.01;
// //       orbitControlsRef.current.minDistance = 0.01;
// //       orbitControlsRef.current.update();
// //     } else {
// //       // Exterior mode
// //       cameraRef.current.position.set(-4, 3, -4.8);
// //       orbitControlsRef.current.target.set(0, 1.5, 0); // 👈 FIX: exterior target
// //       orbitControlsRef.current.enablePan = true;
// //       orbitControlsRef.current.enableZoom = true;
// //       orbitControlsRef.current.maxDistance = 10;
// //       orbitControlsRef.current.minDistance = 0.1;
// //       setEnableRotate(false);
// //       orbitControlsRef.current.update();
// //     }
// //   };
// export const handleInteriorView = (
//   isInteriorView,
//   setIsInteriorView,
//   cameraRef,
//   orbitControlsRef,
//   setEnableRotate
// ) => {
//   const next = !isInteriorView;
//   setIsInteriorView(next);

//   // 1. COMPLETE TRANSFORMATION RESET
//   cameraRef.current.position.set(0, 0, 0);
//   cameraRef.current.rotation.set(0, 0, 0);
//   orbitControlsRef.current.target.set(0, 0, 0);
//   orbitControlsRef.current.reset();

//   // 2. APPLY ABSOLUTE POSITIONS (IGNORES ALL SCENE OBJECTS)
//   if (next) {
//     // INTERIOR VIEW - Fixed coordinates
//     cameraRef.current.position.set(0.9, 1.6, 0);
//     orbitControlsRef.current.target.set(0, 1.5, 0);

//     // Lock controls
//     orbitControlsRef.current.enablePan = false;
//     orbitControlsRef.current.enableZoom = true;
//     orbitControlsRef.current.maxDistance = 0.01;
//     orbitControlsRef.current.minDistance = 0.01;
//   } else {
//     // EXTERIOR VIEW - Fixed coordinates
//     cameraRef.current.position.set(-4, 3, -4.8);
//     orbitControlsRef.current.target.set(0, 1.5, 0);

//     // Free controls
//     orbitControlsRef.current.enablePan = true;
//     orbitControlsRef.current.enableZoom = true;
//     orbitControlsRef.current.maxDistance = 10;
//     orbitControlsRef.current.minDistance = 0.1;
//   }

//   // 3. FORCE UPDATE (IGNORES SCENE CONTENT)
//   cameraRef.current.updateMatrixWorld();
//   orbitControlsRef.current.update();

//   // 4. SET ROTATION (AFTER POSITIONING)
//   setEnableRotate(next);
//   orbitControlsRef.current.enableRotate = next;
// };