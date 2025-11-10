import { UseSettings } from "../context/SettingsContext";

export default function AddressSettings({
  saveProfileSettings,
  streetInputRef,
  houseInputRef,
  cityInputRef,
  countryInputRef,
}) {
  const { settings } = UseSettings();

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
            defaultValue={settings.address.street}
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
            defaultValue={settings.address.houseNumber}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={pressEnterKey}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">City</label>
          <input
            id="cityInput"
            ref={cityInputRef}
            type="text"
            defaultValue={settings.address.city}
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
            defaultValue={settings.address.country}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={pressEnterKey}
          />
        </div>
      </div>
    </div>
  );
}
