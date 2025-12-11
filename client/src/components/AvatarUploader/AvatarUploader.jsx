import { useRef } from "react";
import "./AvatarUploader.css";
import useFetch from "../../hooks/useFetch";
import { gif } from "../../assets";

export default function AvatarUploader({ user, updateProfile, setAlert }) {
  const fileInputRef = useRef(null);

  const { isLoading, error, performFetch } = useFetch(
    "/users/update-avatar",
    (result) => {
      updateProfile({ avatar: result.url });
      setAlert({ type: "success", message: "Avatar updated!" });
    },
  );

  if (error) {
    console.error("Avatar upload error:", error);
    setAlert({ type: "error", message: "Failed to upload avatar." });
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("pic", file);

    performFetch({
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="avatar-uploader-container">
      <img src={user.avatar} alt={user.name} className="avatar-image" />

      <button
        type="button"
        className="avatar-edit-btn"
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <img src={gif.spinner} alt="Loading..." className="spinner" />
        ) : (
          <svg
            className="avatar-edit-icon"
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
        )}
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
