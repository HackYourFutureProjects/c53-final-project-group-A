import { useState } from "react";
import { Loader, X, LogIn } from "lucide-react";
import { UseUser } from "../../context/UserContext";

const LoginForm = ({ login, switchToSignup }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { loading, error, clearError } = UseUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    clearError(); // clear error while typing
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
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={loginData.email}
          onChange={handleChange} // call handleChange
          required
        />

        <label>
          Password <span style={{ color: "red", marginLeft: "2px" }}>*</span>
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={loginData.password}
          onChange={handleChange} //call handleChange
          required
        />

        {error && (
          <p className="error-text">
            <X size={14} style={{ marginRight: "5px" }} />
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader
                className="spin"
                size={18}
                style={{ marginRight: "5px" }}
              />
              Logging in...
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
    </div>
  );
};

export default LoginForm;
