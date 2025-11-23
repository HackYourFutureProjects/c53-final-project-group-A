import { useState, useRef } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import "./DropdownFilter.css";

export default function DropdownFilter({
  buttonText,
  title,
  options,
  filterKey,
  activeValues,
  onFilterChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const inputType = filterKey === "sort" ? "radio" : "checkbox";
  const isRadioMode = filterKey === "sort";

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button
        className="filter-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{buttonText}</span>
        <svg
          className="dropdown-arrow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-content">
          <div className="dropdown-header">
            <span className="dropdown-title">{title}</span>
            <button onClick={() => setIsOpen(false)} className="dropdown-close">
              ×
            </button>
          </div>
          {options.map((option) => {
            const checked = isRadioMode
              ? activeValues === option
              : activeValues && typeof activeValues.has === "function"
                ? activeValues.has(option)
                : false;

            return (
              <label key={option} className="dropdown-option">
                <input
                  type={inputType}
                  className="form-checkbox"
                  name={filterKey}
                  checked={checked}
                  onChange={(e) => {
                    if (isRadioMode) {
                      onFilterChange(filterKey, option);
                      if (e.target.checked) setIsOpen(false);
                    } else {
                      onFilterChange(filterKey, option, e.target.checked);
                    }
                  }}
                />
                <span className="option-text">{option}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
