import { useState, useRef } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import "./DropdownSort.css";

export default function DropdownSort({
  options,
  activeValues,
  onFilterChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const filterkey = "Custom Sort";

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button
        className="filter-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{filterkey}</span>
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
            <span className="dropdown-title">{filterkey}</span>
            <button onClick={() => setIsOpen(false)} className="dropdown-close">
              ×
            </button>
          </div>
          {options.map((option) => {
            const checked =
              activeValues && typeof activeValues.has === "function"
                ? activeValues.has(option)
                : false;

            return (
              <label key={option} className="dropdown-option">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  name={filterkey}
                  checked={checked}
                  onChange={(e) =>
                    onFilterChange(filterkey, option, e.target.checked)
                  }
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
