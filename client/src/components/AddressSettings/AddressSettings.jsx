import { UseUser } from "../../context/UserContext";
import "./AddressSettings.css";

export default function AddressSettings({
  handleSaveClick,
  streetInputRef,
  houseInputRef,
  cityInputRef,
  countryInputRef,
  clearAlert,
}) {
  const { user } = UseUser();

  function pressEnterKey(e) {
    if (e.key === "Enter") {
      handleSaveClick(
        streetInputRef,
        houseInputRef,
        cityInputRef,
        countryInputRef,
      );
    }
  }
  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="address-label">Street</label>
          <input
            id="streetInput"
            ref={streetInputRef}
            type="text"
            defaultValue={user?.street ?? ""}
            className="address-input"
            onKeyDown={pressEnterKey}
            onChange={clearAlert}
          />
        </div>
        <div>
          <label className="address-label">House no.</label>
          <input
            id="houseInput"
            ref={houseInputRef}
            type="text"
            defaultValue={user?.housenumber ?? ""}
            className="address-input"
            onKeyDown={pressEnterKey}
            onChange={clearAlert}
          />
        </div>
        <div>
          <label className="address-label">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="cityInput"
            ref={cityInputRef}
            type="text"
            defaultValue={user?.city ?? ""}
            aria-required="true"
            className="address-input"
            onKeyDown={pressEnterKey}
            onChange={clearAlert}
          />
        </div>
        <div>
          <label className="address-label">Country</label>
          <input
            id="countryInput"
            ref={countryInputRef}
            type="text"
            defaultValue={user?.country ?? ""}
            className="address-input"
            onKeyDown={pressEnterKey}
            onChange={clearAlert}
          />
        </div>
      </div>
    </div>
  );
}
