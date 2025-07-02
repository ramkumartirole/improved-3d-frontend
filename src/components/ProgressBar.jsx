import React from "react";

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-bar-bg">
      <div className="progress-bar-fg" style={{ width: `${percentage}%` }} />
    </div>
  );
};

export default ProgressBar;
