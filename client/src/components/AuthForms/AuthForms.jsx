import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../pages/LoginForm/LoginForm";
import SignupForm from "../../pages/SignupForm/SignupForm";
import SuccessPopup from "../SuccessPopup/SuccessPopup";
import LoginSuccessPopup from "../SuccessPopup/LoginSuccessPopup";
import { useAuth } from "../../context/AuthContext";
import "./AuthForms.css";

const AuthForms = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [tab, setTab] = useState("login");
  const [successPopup, setSuccessPopup] = useState(false);
  const [signedUpUser, setSignedUpUser] = useState("");

  const [loginSuccessPopup, setLoginSuccessPopup] = useState(false);

  const goToProfile = () => {
    setSuccessPopup(false);
    navigate("/profile");
  };

  return (
    <div className="auth-container" id="auth-container">
      <div className="tabs">
        <button
          className={tab === "login" ? "active-tab" : ""}
          onClick={() => setTab("login")}
        >
          Login
        </button>
        <button
          className={tab === "signup" ? "active-tab" : ""}
          onClick={() => setTab("signup")}
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
          switchToSignup={() => setTab("signup")}
        />
      )}

      {/* --- SIGNUP FORM --- */}
      {tab === "signup" && (
        <SignupForm
          signup={signup}
          setSuccessPopup={setSuccessPopup}
          setSignedUpUser={setSignedUpUser}
          switchToLogin={() => setTab("login")}
        />
      )}

      {/* --- SUCCESS POPUP signup --- */}
      {successPopup && (
        <SuccessPopup
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
