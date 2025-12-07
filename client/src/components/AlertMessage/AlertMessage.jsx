import "./AlertMessage.css";

export default function AlertMessage({ type = "info", message }) {
  if (!message) return null;

  const classes = {
    success: "alert alert-success",
    error: "alert alert-error",
    warning: "alert alert-warning",
    info: "alert alert-info",
  };

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={classes[type]}>
      <span className="icon">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
