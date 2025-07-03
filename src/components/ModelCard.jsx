import React from "react";
import PropTypes from "prop-types";

const ModelCard = ({
  model,
  isSelected,
  onClick,
  onKeyDown,
  onHoverStart,
  onHoverEnd,
}) => {
  return (
    <div className="col-12 mb-3">
      <div
        className={`bbv-parts clickable-card${
          isSelected ? " selected-card" : ""
        }`}
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <img src={model.image} alt={model.label} className="card-img" />
        <div className="card-content">
          <h6 className="mb-1 fw-semibold card-label">{model.label}</h6>
          {model.description && (
            <p className="mb-0 card-desc">{model.description}</p>
          )}
        </div>
        {isSelected && (
          <span className="badge bg-success added-badge">added</span>
        )}
      </div>
    </div>
  );
};

ModelCard.propTypes = {
  model: PropTypes.shape({
    label: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onHoverStart: PropTypes.func,
  onHoverEnd: PropTypes.func,
};

export default ModelCard;
