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
  // const [vanModel,setVanModel] = useState(null);
  // const groupRef = useRef();


//   call karne kliye
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
                    //   ye fucntion PivotControls me call karna hai


                      // incrementModelQuantity={(m) =>
            //   incrementModelQuantity(m, addedModels, setAddedModels, setActiveModelId, setPopupMessage, setShowPopup)
            // }
            // decrementModelQuantity={(label) =>
            //   decrementModelQuantity(label, setAddedModels)
            // }
            // setUploadProgress={setUploadProgress}
            // setUploadSuccess={setUploadSuccess}
            // uploadProgress={uploadProgress}
            // multi form k liye jo k ab reove hohaya ha 