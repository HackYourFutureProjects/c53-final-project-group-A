import { useState } from "react";
import { Loader, X, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ login, switchToSignup }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(loginData.email, loginData.password);
  };

  return (
    <div className="form-card" id="login-form">
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={loginData.email}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
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
