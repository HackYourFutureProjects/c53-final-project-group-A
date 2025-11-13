import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../pages/LoginForm/LoginForm";
import SignupForm from "../../pages/SignupForm/SignupForm";
import SignupSuccessPopup from "../SuccessPopup/SignupSuccessPopup";
import LoginSuccessPopup from "../SuccessPopup/LoginSuccessPopup";
import { UseAuth } from "../../context/AuthContext";
import "./AuthForms.css";

const AuthForms = () => {
  const navigate = useNavigate();
  const { login, signup, clearError } = UseAuth();
  const [tab, setTab] = useState("login");
  const [successPopup, setSuccessPopup] = useState(false);
  const [signedUpUser, setSignedUpUser] = useState("");

  const [loginSuccessPopup, setLoginSuccessPopup] = useState(false);

  const goToProfile = () => {
    setSuccessPopup(false);
    navigate("/profile");
  };

  //  SWITCH TAB //
  const handleSwitchTab = (newTab) => {
    setTab(newTab);
    clearError(); // clear error immediately when switching tabs
  };

  return (
    <div className="auth-container" id="auth-container">
      <div className="tabs">
        <button
          className={tab === "login" ? "active-tab" : ""}
          onClick={() => handleSwitchTab("login")}
        >
          Login
        </button>
        <button
          className={tab === "signup" ? "active-tab" : ""}
          onClick={() => handleSwitchTab("signup")}
        >
          Sign Up
        </button>
      </div>

      {/* --- LOGIN FORM --- */}
      {tab === "login" && (
        <LoginForm
          login={async (email, password) => {
            await login(email, password);
            setLoginSuccessPopup(true);
          }}
          switchToSignup={() => handleSwitchTab("signup")}
        />
      )}

      {/* --- SIGNUP FORM --- */}
      {tab === "signup" && (
        <SignupForm
          signup={signup}
          setSuccessPopup={setSuccessPopup}
          setSignedUpUser={setSignedUpUser}
          switchToLogin={() => handleSwitchTab("login")}
        />
      )}

      {/* --- SUCCESS POPUP signup --- */}
      {successPopup && (
        <SignupSuccessPopup
          user={signedUpUser}
          onClose={() => setSuccessPopup(false)}
          goToProfile={goToProfile}
        />
      )}

      {/* --- LOGIN SUCCESS POPUP --- */}
      {loginSuccessPopup && (
        <LoginSuccessPopup onClose={() => setLoginSuccessPopup(false)} />
      )}
    </div>
  );
};

export default AuthForms;
