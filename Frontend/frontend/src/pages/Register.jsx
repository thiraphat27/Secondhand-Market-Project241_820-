import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
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
      await register(formData);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card auth-card">
      <div className="stack-sm">
        <p className="eyebrow">Account</p>
        <h2>Create account</h2>
        <p className="muted">
          Register once, then add and manage your own marketplace products.
        </p>
      </div>

      <form className="stack-md" onSubmit={handleSubmit}>
        <label className="field">
          <span>Username</span>
          <input
            className="input"
            name="username"
            onChange={handleChange}
            placeholder="yourname"
            required
            type="text"
            value={formData.username}
          />
        </label>

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
            minLength="6"
            name="password"
            onChange={handleChange}
            placeholder="At least 6 characters"
            required
            type="password"
            value={formData.password}
          />
        </label>

        {error ? <div className="error-banner">{error}</div> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default Register;
