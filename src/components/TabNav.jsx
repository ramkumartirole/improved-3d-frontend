import React from "react";

const tabs = [
  { key: "interior", label: "Interior", icon: "bi-house-door" },
  { key: "exterior", label: "Exterior", icon: "bi-box" },
  { key: "system", label: "System", icon: "bi-gear" },
];

const TabNav = ({ activeTab, switchTab }) => {
  return (
    <div
      className="d-flex justify-content-center gap-2 pt-2 pb-2 bg-body-secondary shadow-sm sticky-top"
      style={{ zIndex: 2 }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`btn px-3 py-2 fw-semibold shadow-sm position-relative tab-btn${
            activeTab === tab.key ? " active" : ""
          }`}
          aria-current={activeTab === tab.key}
          onClick={() => switchTab(tab.key)}
        >
          {tab.label}
          {activeTab === tab.key && (
            <span
              className="position-absolute top-0 start-100 translate-middle rounded-pill bg-success selected-indicator"
              aria-label="Selected"
            >
              <span className="visually-hidden">selected</span>
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNav;
