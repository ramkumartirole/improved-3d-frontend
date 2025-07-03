// React & Routing
import React, { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  groupByGroup,
  getFilteredSelectedModels,
  getStepsByTab,
  TYPE_CONFLICTS,
  stepDescriptions,
} from "./utils/formUtils";
import exportScene from "./utils/exportScene";

// Context & Hooks
import { useAuth } from "./context/AuthContext";

// API & Utils
import axios from "axios";
import Swal from "sweetalert2";
import { showQuoteForm } from "./utils/showQuoteForm";

// Environment
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

// Assets & Data
import "./MultiStepForm.css";
import { interiorModels, exteriorModels, systemModels } from "./ModelData";

//UI Components
import TabNav from "./components/TabNav";
import ProgressBar from "./components/ProgressBar";
import StepTitle from "./components/StepTitle";
import ModelCard from "./components/ModelCard";
import BottomNavigation from "./components/BottomNavigation";

const MultiStepForm = ({
  setUploadProgress,
  setUploadSuccess,
  uploadProgress,
  sceneRef,
  addModelToScene,
  removeModelFromScene,
  getAddedQuantity,
  showExterior,
  toggleExterior,
  setActiveModelId,
  setActiveExteriorModelId,
}) => {
  const [isVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("interior");
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSelectedLabel, setLastSelectedLabel] = useState(null);
  const [selectedCard, setSelectedCard] = useState(new Set());

  const [isUploading, setIsUploading] = useState(false);
  const [modelUrl, setModelUrl] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const steps = useMemo(() => {
    return getStepsByTab(
      activeTab,
      interiorModels,
      exteriorModels,
      systemModels
    );
  }, [activeTab]);

  const handleCardClick = (model) => {
    setSelectedCard((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(model.label)) {
        newSelected.delete(model.label);
      } else {
        newSelected.add(model.label);
        setLastSelectedLabel(model.label); //  Track last selected
      }
      return newSelected;
    });

    toggleModelSelection(model);
  };

  const toggleModelSelection = (model) => {
    const quantity = getAddedQuantity(model.label);

    const maxQty =
      {
        awning: 2,
        "reading-light": 3,
        // add others here
      }[model.type] || 1;

    let storageKey =
      activeTab === "interior"
        ? "selectedInteriorModels"
        : activeTab === "exterior"
        ? "selectedExteriorModels"
        : "selectedSystemModels";

    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");

    if (quantity > 0) {
      removeModelFromScene(model.label);
      const updated = existing.filter((item) => item !== model.label);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } else {
      //remove all conflicting types if TYPE_CONFLICTS exists
      const conflictTypes = TYPE_CONFLICTS[model.type] || [];

      if (conflictTypes.length > 0) {
        conflictTypes.forEach((type) => removeModelFromScene(type));
      } else if (maxQty === 1) {
        removeModelFromScene(model.type);
      }

      addModelToScene(model);

      if (!existing.includes(model.label)) {
        existing.push(model.label);
        localStorage.setItem(storageKey, JSON.stringify(existing));
      }
    }
  };

  const scene = sceneRef.current?.getScene();

  const handleGetQuote = async () => {
    if (!user) {
      showQuoteForm(async (formData) => {
        // Require phone number for guests
        if (!formData.phone || !formData.phone.trim()) {
          Swal.fire({
            icon: "warning",
            title: "Phone Required",
            text: "Please enter your phone number to get a quote.",
          });
          return;
        }
        try {
          const modelUrl = await exportScene(
            sceneRef,
            user,
            setUploadProgress,
            setUploadSuccess,
            setModelUrl
          );

          const payload = { ...formData, modelUrl };

          await axios.post(`${API_BASE_URL}/api/quotes`, payload);

          Swal.fire({
            icon: "success",
            title: "Submitted!",
            text: "Your quote request—including your model!—has been received.",
          });
        } catch (err) {
          console.error("❌ Guest quote submission failed:", err);
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Something went wrong while submitting your quote.",
          });
        }
      });
    } else {
      // Require phone number for logged-in users as well
      if (!user.phone || !user.phone.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Phone Required",
          text: "Please add your phone number in your profile before requesting a quote.",
        });
        return;
      }
      try {
        const modelUrl = await exportScene(
          sceneRef,
          user,
          setUploadProgress,
          setUploadSuccess,
          setModelUrl
        );
        const payload = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          modelUrl,
        };

        await axios.post(`${API_BASE_URL}/api/quotes`, payload);

        Swal.fire({
          icon: "success",
          title: "Submitted!",
          text: "Your quote request has been received.",
        });
      } catch (err) {
        console.error("❌ Logged-in quote submission failed:", err);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong while submitting your quote.",
        });
      }
    }
  };

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToNextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, steps]);

  // Progress calculation for the thin bar

  const progressPercentage = useMemo(() => {
    return Math.round(((currentStep + 1) / steps.length) * 100);
  }, [currentStep, steps.length]);

  const switchTab = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentStep(0);
    toggleExterior(tabkey === "exterior");
  };

  // --- UI Starts Here ---
  return (
    <div className="main-content d-flex flex-column position-relative">
      {/* Tab Navigation Component */}
      <TabNav activeTab={activeTab} switchTab={switchTab} />

      <ProgressBar percentage={progressPercentage} />

      <StepTitle
        title={steps[currentStep][0].replace(/-/g, " ")}
        description={stepDescriptions[steps[currentStep][0]]}
      />

      <div className="shadow p-3 main-content bg-white flex-grow-1 d-flex flex-column card-list">
        <div className="row">
          {steps[currentStep][1].map((model) => {
            const isSelected = selectedCard.has(model.label);

            return (
              <ModelCard
                key={model.label}
                model={model}
                isSelected={isSelected}
                onClick={() => {
                  setSelectedCard((prevSelected) => {
                    const newSelected = getFilteredSelectedModels(
                      model.label,
                      model.type
                    )(prevSelected);

                    if (!prevSelected.has(model.label)) {
                      newSelected.add(model.label);
                      setLastSelectedLabel(model.label);
                    }

                    return newSelected;
                  });

                  toggleModelSelection(model);
                }}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  (() => {
                    setSelectedCard((prevSelected) => {
                      const newSelected = getFilteredSelectedModels(
                        model.label,
                        model.type
                      )(prevSelected);

                      if (!prevSelected.has(model.label)) {
                        newSelected.add(model.label);
                        setLastSelectedLabel(model.label);
                      }

                      return newSelected;
                    });

                    toggleModelSelection(model);
                  })()
                }
                onHoverStart={(e) => e.currentTarget.classList.add("hover")}
                onHoverEnd={(e) => e.currentTarget.classList.remove("hover")}
              />
            );
          })}
        </div>
      </div>

      <BottomNavigation
        activeTab={activeTab}
        currentStep={currentStep}
        steps={steps}
        goToPrevStep={goToPrevStep}
        goToNextStep={goToNextStep}
        switchTab={switchTab}
        handleGetQuote={handleGetQuote}
      />
    </div>
  );
};

export default MultiStepForm;
