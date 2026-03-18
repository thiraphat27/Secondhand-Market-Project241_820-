import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await login(formData);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card auth-card">
      <div className="stack-sm">
        <p className="eyebrow">Account</p>
        <h2>Login</h2>
        <p className="muted">Use your account to manage your marketplace listings.</p>
      </div>

      <form className="stack-md" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            className="input"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            required
            type="email"
            value={formData.email}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            className="input"
            name="password"
            onChange={handleChange}
            placeholder="Your password"
            required
            type="password"
            value={formData.password}
          />
        </label>

        {error ? <div className="error-banner">{error}</div> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="muted">
        No account yet? <Link to="/register">Create one</Link>
      </p>
    </section>
  );
}

export default Login;
