import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { UseUser } from "../context/UserContext";
import { Mail } from "lucide-react";
import { gif } from "../assets";
import AlertMessage from "../components/AlertMessage/AlertMessage";

const ForgotPasswordForm = ({ switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { setMessage } = UseUser();
  const [alert, setAlert] = useState({ type: "", message: "" });

  const { isLoading, error, performFetch } = useFetch(
    "/users/forgot-password",
    (data) => {
      setSent(true);
      setMessage(data.msg);
    },
  );

  useEffect(() => {
    if (error) {
      setAlert({ type: "error", message: String(error) });
      const timer = setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload when the form is submitted
    performFetch({
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="form-card">
      {!sent ? (
        <>
          <h2>Forgot Password</h2>
          <p style={{ marginBottom: "10px" }}>
            Enter your email and we will send a link to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage(null);
                }}
                style={{ paddingRight: "35px" }}
              />
              <Mail size={18} className="input-icon-right" />
            </div>

            {alert.message && (
              <AlertMessage type={alert.type} message={alert.message} />
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span>Sending...</span>
                  <img src={gif.spinner} className="spinner" />
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="switch-text">
            <span className="switch-link" onClick={switchToLogin}>
              Back to Login
            </span>
          </p>
        </>
      ) : (
        <>
          <h2>Check your email</h2>
          <p>
            A password reset link has been sent to <b>{email}</b>. Please check
            your inbox and click the link to reset your password.
          </p>
          <p className="switch-text">
            <span className="switch-link" onClick={switchToLogin}>
              Back to Login
            </span>
          </p>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
