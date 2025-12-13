import { useState } from "react";
import { X, LogIn, Mail, Eye, EyeOff } from "lucide-react";
import { UseUser } from "../../context/UserContext";
import { gif } from "../../assets";

const LoginForm = ({ login, switchToSignup, switchToForgotPassword }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const {
    loading,
    error,
    // , clearError
  } = UseUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    // clearError(); // clear error while typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(loginData.email, loginData.password);
  };

  return (
    <div className="form-card" id="login-form">
      <form onSubmit={handleSubmit}>
        <label>
          Email <span style={{ color: "red", marginLeft: "2px" }}>*</span>
        </label>
        <div className="input-wrapper">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={handleChange} // call handleChange
            required
            style={{ paddingRight: "35px" }}
          />
          <Mail size={18} className="input-icon-right" />
        </div>
        <label>
          Password <span style={{ color: "red", marginLeft: "2px" }}>*</span>
        </label>
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={handleChange} //call handleChange
            required
            style={{ paddingRight: "35px" }}
          />
          {showPassword ? (
            <EyeOff
              size={18}
              className="input-icon-right"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              size={18}
              className="input-icon-right"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {error && (
          <p className="error-text">
            <X size={14} style={{ marginRight: "5px" }} />
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span>Logging in...</span>
              <img src={gif.spinner} className="spinner" />
            </>
          ) : (
            <>
              <LogIn size={16} style={{ marginRight: "5px" }} />
              Login
            </>
          )}
        </button>
      </form>

      <p className="switch-text">
        Don’t have a profile?{" "}
        <span className="switch-link" onClick={switchToSignup}>
          Sign Up
        </span>
      </p>
      <p className="forgot-text">
        <a
          href="#"
          className="forgot-link"
          onClick={(e) => {
            e.preventDefault(); // prevent page reload
            switchToForgotPassword();
          }}
        >
          Forgot Password?
        </a>
      </p>
      <p
        className="gdpr-text"
        style={{
          fontSize: "12px",
          marginTop: "10px",
          color: "#666",
          lineHeight: "1.4",
        }}
      >
        By signing up, you agree to the{" "}
        <a
          href="https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0070f3", textDecoration: "underline" }}
        >
          GDPR & Privacy Policy
        </a>
        . We handle your data according to GDPR rules. Your information is
        secure and will be deleted if you remove your account.
      </p>
    </div>
  );
};

export default LoginForm;
