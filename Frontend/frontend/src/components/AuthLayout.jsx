import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-stage">
        <section className="auth-hero">
          <p className="eyebrow">Secondhand Marketplace</p>
          <h1 className="auth-title">Account access stays separate from the shopping flow.</h1>
          <p className="muted">
            Sign in or create an account first, then we send you back to products and seller tools.
          </p>
          <Link className="ghost-button auth-back-link" to="/">
            Back to marketplace
          </Link>
        </section>

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
