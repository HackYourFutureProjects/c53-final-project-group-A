import { UseAuth } from "../../context/AuthContext";

export default function AddressSettings({
  saveProfileSettings,
  streetInputRef,
  houseInputRef,
  cityInputRef,
  countryInputRef,
}) {
  const { user } = UseAuth();

  function pressEnterKey(e) {
    if (e.key === "Enter") {
      saveProfileSettings(
        streetInputRef,
        houseInputRef,
        cityInputRef,
        countryInputRef,
      );
    }
  }
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-900 mb-3">
        Address
      </label>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Street</label>
          <input
            id="streetInput"
            ref={streetInputRef}
            type="text"
            defaultValue={user.address.street}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={pressEnterKey}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">House no.</label>
          <input
            id="houseInput"
            ref={houseInputRef}
            type="text"
            defaultValue={user.address.houseNumber}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={pressEnterKey}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="cityInput"
            ref={cityInputRef}
            type="text"
            defaultValue={user.address.city}
            aria-required="true"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={pressEnterKey}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Country</label>
          <input
            id="countryInput"
            ref={countryInputRef}
            type="text"
            defaultValue={user.address.country}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={pressEnterKey}
          />
        </div>
      </div>
    </div>
  );
}
