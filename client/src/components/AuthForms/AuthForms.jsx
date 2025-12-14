import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ForgotPasswordForm from "../../pages/ForgotPassword/ForgotPassword";
import LoginForm from "../../pages/LoginForm/LoginForm";
import ResetPasswordForm from "../../pages/ResetPassword/ResetPassword";
import SignupForm from "../../pages/SignupForm/SignupForm";
import LoginSuccessPopup from "../SuccessPopup/LoginSuccessPopup";
import SignupSuccessPopup from "../SuccessPopup/SignupSuccessPopup";
import "./AuthForms.css";

const AuthForms = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("token");

  const navigate = useNavigate();
  const [tab, setTab] = useState(() => (urlToken ? "reset" : "login"));
  const [successPopup, setSuccessPopup] = useState(false);

  const [loginSuccessPopup, setLoginSuccessPopup] = useState(false);

  const goToProfile = () => {
    setSuccessPopup(false);
    navigate("/profile");
  };

  //  SWITCH TAB //
  const handleSwitchTab = (newTab) => {
    setTab(newTab);
    // clearError(); // clear error immediately when switching tabs
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
          setLoginSuccessPopup={setLoginSuccessPopup}
          switchToSignup={() => handleSwitchTab("signup")}
          switchToForgotPassword={() => handleSwitchTab("forgot")}
        />
      )}
      {/* --- FORGOT PASSWORD FORM --- */}
      {tab === "forgot" && (
        <ForgotPasswordForm switchToLogin={() => handleSwitchTab("login")} />
      )}

      {/* --- RESET PASSWORD FORM --- */}
      {tab === "reset" && (
        <ResetPasswordForm
          token={urlToken}
          switchToLogin={() => handleSwitchTab("login")}
        />
      )}

      {/* --- SIGNUP FORM --- */}
      {tab === "signup" && (
        <SignupForm
          setSignupSuccessPopup={setSuccessPopup}
          switchToLogin={() => handleSwitchTab("login")}
        />
      )}

      {/* --- SUCCESS POPUP signup --- */}
      {successPopup && (
        <SignupSuccessPopup
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
