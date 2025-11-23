import {
  // useState,
  useRef,
} from "react";
// import useOutsideClick from "../../hooks/useOutsideClick";
import "./DropdownSort.css";

export default function DropdownSort() {
  // const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // useOutsideClick(dropdownRef, () => setIsOpen(false));

  return <div className="dropdown-container" ref={dropdownRef}></div>;
}
