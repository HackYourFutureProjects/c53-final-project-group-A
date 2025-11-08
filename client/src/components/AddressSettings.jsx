import { UseSettings } from "../context/SettingsContext";

export default function AddressSettings() {
  const { settings } = UseSettings();

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-900 mb-3">
        Address
      </label>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Street</label>
          <input
            type="text"
            defaultValue={settings.address.street}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">House no.</label>
          <input
            type="text"
            defaultValue={settings.address.houseNumber}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">City</label>
          <input
            type="text"
            defaultValue={settings.address.city}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Country</label>
          <input
            type="text"
            defaultValue={settings.address.country}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
