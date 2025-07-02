import React from "react";

const BottomNavigation = ({
  activeTab,
  currentStep,
  steps,
  goToPrevStep,
  goToNextStep,
  switchTab,
  handleGetQuote,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const getNextButton = () => {
    if (activeTab === "interior" && isLastStep) {
      return (
        <button
          className="btn px-4 btn-next btn-outline-dark"
          onClick={() => switchTab("exterior")}
        >
          Exterior
        </button>
      );
    } else if (activeTab === "exterior" && isLastStep) {
      return (
        <button
          className="btn px-4 btn-outline-dark"
          onClick={() => switchTab("system")}
        >
          System
        </button>
      );
    } else if (isLastStep) {
      return (
        <button className="btn px-4 fw-semibold btn-done" disabled>
          Done
        </button>
      );
    } else {
      return (
        <button
          className="btn px-4 fw-semibold btn-nav btn-outline-dark"
          onClick={goToNextStep}
        >
          Next
        </button>
      );
    }
  };

  const getBackButton = () => {
    if (activeTab === "exterior" && isFirstStep) {
      return (
        <button
          className="btn px-4 py-2 fw-semibold btn-nav-alt btn-outline-dark"
          onClick={() => switchTab("interior")}
        >
          Interior
        </button>
      );
    } else if (activeTab === "system" && isFirstStep) {
      return (
        <button
          className="btn px-4 py-2 fw-semibold btn-nav-alt btn-outline-dark"
          onClick={() => switchTab("exterior")}
        >
          Exterior
        </button>
      );
    } else {
      return (
        <button
          className="btn px-4 py-2 fw-semibold btn-nav btn-outline-dark"
          onClick={goToPrevStep}
          disabled={isFirstStep}
        >
          Previous
        </button>
      );
    }
  };

  return (
    <div className="sticky-bottom-nav bg-white text-dark p-3 shadow-lg">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        {getBackButton()}
        {getNextButton()}
      </div>
      <div className="text-center mt-3">
        <button
          className="btn btn-dark btn-lg shadow-sm btn-quote"
          onClick={handleGetQuote}
        >
          Save & Get a Quote
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
