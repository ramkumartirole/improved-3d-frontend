import React from "react";

const StepTitle = ({ title, description }) => {
  return (
    <div className="mb-2 px-3 pt-3">
      <h2 className="fs-5 fw-bold mb-1 section-title">{title}</h2>
      <p className="mb-3 section-desc">{description}</p>
    </div>
  );
};

export default StepTitle;
