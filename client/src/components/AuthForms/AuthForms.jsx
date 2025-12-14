import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginForm from "../../pages/LoginForm/LoginForm";
import SignupForm from "../../pages/SignupForm/SignupForm";
import SignupSuccessPopup from "../SuccessPopup/SignupSuccessPopup";
import LoginSuccessPopup from "../SuccessPopup/LoginSuccessPopup";
import { UseUser } from "../../context/UserContext";
import ForgotPasswordForm from "../../pages/ForgotPassword/ForgotPassword";
import ResetPasswordForm from "../../pages/ResetPassword/ResetPassword";
import "./AuthForms.css";

const AuthForms = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("token");

  const navigate = useNavigate();
  const {
    login,
    signup,
    // , clearError
  } = UseUser();
  const [tab, setTab] = useState("login");
  const [successPopup, setSuccessPopup] = useState(false);
  const [signedUpUser, setSignedUpUser] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [loginSuccessPopup, setLoginSuccessPopup] = useState(false);
  const [resetToken, setResetToken] = useState(urlToken || null);

  useEffect(() => {
    if (urlToken) {
      setResetToken(urlToken);
      setTab("reset");
    }
  }, [urlToken]);

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
          // email={loginData.email}
          // password={loginData.password}
          setLoginSuccessPopup={setLoginSuccessPopup}
          switchToSignup={() => handleSwitchTab("signup")}
          switchToForgotPassword={() => handleSwitchTab("forgot")}
        />
      )}
      {/* --- FORGOT PASSWORD FORM --- */}
      {tab === "forgot" && (
        <ForgotPasswordForm
          switchToLogin={() => handleSwitchTab("login")}
          switchToReset={(token) => {
            setResetToken(token);
            setTab("reset");
          }}
        />
      )}

      {/* --- RESET PASSWORD FORM --- */}
      {tab === "reset" && (
        <ResetPasswordForm
          token={resetToken}
          switchToLogin={() => handleSwitchTab("login")}
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
