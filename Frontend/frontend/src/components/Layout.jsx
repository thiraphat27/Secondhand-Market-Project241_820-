import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Layout() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Secondhand Marketplace</p>
          <h1 className="brand-title">Buy, sell, and manage used items cleanly.</h1>
        </div>

        <div className="topbar-actions">
          {user ? <span className="user-chip">{user.username}</span> : null}
          {!isAuthenticated ? (
            <>
              <NavLink className="ghost-button auth-link-button" to="/login">
                Login
              </NavLink>
              <NavLink className="primary-button auth-link-button" to="/register">
                Register
              </NavLink>
            </>
          ) : null}
          {isAuthenticated ? (
            <button className="ghost-button" onClick={logout} type="button">
              Logout
            </button>
          ) : null}
        </div>
      </header>

      <nav className="nav-tabs">
        <NavLink
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          to="/"
        >
          Products
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          to="/add-product"
        >
          Add Product
        </NavLink>
      </nav>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
