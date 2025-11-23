import { useState, useRef } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";

export default function DropdownSort() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const [selected, setSelected] = useState([
    "Most skill matches",
    "Fewest transport transfers",
    "Nearest first",
    "Newest first",
  ]);
  const [disabled, setDisabled] = useState([]);

  const dragged = useRef(null);

  function onDragStart(e, criterion, from) {
    dragged.current = { criterion, from };
    e.dataTransfer.setData("text/plain", criterion);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragEnd() {
    dragged.current = null;
  }

  function handleDrop(container) {
    if (!dragged.current) return;
    const { criterion, from } = dragged.current;

    if (container === "selected") {
      console.log("dropping into selected", dragged.current);
      if (from === "disabled") {
        setDisabled((prev) => prev.filter((t) => t !== criterion));
        setSelected((prev) => [...prev, criterion]);
      } else {
        // from selected -> keep in selected
      }
    } else {
      // dropping into disabled
      if (from === "selected") {
        setSelected((prev) => prev.filter((t) => t !== criterion));
        setDisabled((prev) => [...prev, criterion]);
      } else {
        // from disabled -> keep in disabled (or append)
        // ensure we don't duplicate: if it already came from disabled and we dropped into disabled, do nothing
      }
    }

    dragged.current = null;
  }

  function handleRemoveFromSelected(criterion) {
    setSelected((prev) => prev.filter((t) => t !== criterion));
    setDisabled((prev) => [...prev, criterion]);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="sortBtn"
        className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center space-x-2"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        type="button"
      >
        <span>Custom Sort</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        id="sortDropdown"
        className={`absolute top-full mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg z-50 ${
          isOpen ? "" : "hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <p className="text-sm font-medium mb-2">
            Drag and drop the sorting criteria between areas to change their
            priority or disable them.
          </p>
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Selected Properties:</p>
            <div
              id="selectedSort"
              className="min-h-16 border-2 border-dashed border-gray-300 rounded p-2 bg-gray-50 hover:bg-gray-50"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragEnter={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop("selected");
              }}
            >
              {selected.length === 0 ? (
                <p className="text-xs text-gray-400 text-center">Drop here</p>
              ) : (
                selected.map((criterion) => (
                  <div
                    key={criterion}
                    className="sort-item inline-flex items-center space-x-2 m-1 bg-white border border-gray-200 rounded px-3 py-2 hover:bg-blue-50"
                    draggable
                    onDragStart={(e) => onDragStart(e, criterion, "selected")}
                    onDragEnd={onDragEnd}
                  >
                    <span>{criterion}</span>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      type="button"
                      onClick={() => handleRemoveFromSelected(criterion)}
                      aria-label={`Remove ${criterion}`}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Disabled Properties:</p>
            <div
              id="disabledProps"
              className="min-h-16 border-2 border-dashed border-gray-300 rounded p-2 bg-gray-50"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragEnter={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop("disabled");
              }}
            >
              {disabled.length === 0 ? (
                <p className="text-xs text-gray-400 text-center">Drop here</p>
              ) : (
                disabled.map((criterion) => (
                  <div
                    key={criterion}
                    className="sort-item px-3 py-2 bg-white border border-gray-200 rounded cursor-move hover:bg-blue-50 m-1"
                    draggable
                    onDragStart={(e) => onDragStart(e, criterion, "disabled")}
                    onDragEnd={onDragEnd}
                  >
                    {criterion}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
