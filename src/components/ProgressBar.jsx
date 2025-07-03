import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-bar-bg">
      <div className="progress-bar-fg" style={{ width: `${percentage}%` }} />
    </div>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default ProgressBar;
