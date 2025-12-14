import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { UseUser } from "../../context/UserContext";
import { Mail } from "lucide-react";
import { gif } from "../../assets";

const ForgotPasswordForm = ({ switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { setMessage } = UseUser();

  const {
    isLoading: userLoading,
    error,
    performFetch,
  } = useFetch("/users/forgot-password", (data) => {
    setSent(true);
    setMessage(data.msg);
  });

  useEffect(() => {
    if (error) {
      setMessage(error);
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
            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={userLoading}>
              {userLoading ? (
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
