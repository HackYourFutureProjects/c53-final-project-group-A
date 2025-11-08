import { defaultUser } from "../../data/defaultUser";
import SkillsSettings from "../../components/SkillsSettings";
import AddressSettings from "../../components/AddressSettings";

export default function Profile() {
  return (
    <div className="content-container">
      {/* <!-- Page Title --> */}
      <h1 className="text-2xl font-semibold text-center text-gray-900 mb-8">
        Profile
      </h1>
      {/* <!-- Profile Section with Avatar and Name --> */}
      <div className="mb-8">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-300 rounded flex-shrink-0 overflow-hidden">
              <img
                src={defaultUser.avatar}
                alt={defaultUser.name}
                className="w-20 h-20 object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50">
              <svg
                className="w-3 h-3 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Name
            </label>
            <input
              type="text"
              defaultValue={defaultUser.name}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <label className="block text-sm font-medium text-gray-900 mb-3">
        Password
      </label>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Set New Password
          </label>
          <input
            type="text"
            placeholder="Type 8 characters or more"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Confirm Password
          </label>
          <input
            type="text"
            placeholder="Write the same password again"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <hr className="border-gray-300 mb-8" />
      {/* Settings Section */}
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
      <AddressSettings />
      <SkillsSettings />
      {/* <!-- Save Button --> */}
      <div className="flex justify-end mb-8">
        <button className="px-8 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium">
          Save
        </button>
      </div>
      <hr className="border-gray-300 mb-8" />
      {/* <!-- Profile Management Section --> */}
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Profile management
      </h2>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">Delete Profile</h3>
          <p className="text-sm text-gray-600">
            Permanently delete your account and data.
          </p>
        </div>
        <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition font-medium">
          Delete Profile
        </button>
      </div>
    </div>
  );
}
