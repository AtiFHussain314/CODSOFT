import { BriefcaseBusiness, LayoutDashboard, LogOut, Menu, Search, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const dashboardPath = user?.role === "employer" ? "/employer" : "/candidate";

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <nav className="nav container">
        <Link className="brand" to="/" onClick={close}>
          <span className="brand-mark">
            <BriefcaseBusiness size={22} />
          </span>
          <span>TalentBridge</span>
        </Link>

        <button className="icon-button menu-button" type="button" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
          <span className="sr-only">Menu</span>
        </button>

        <div className={`nav-links ${open ? "is-open" : ""}`}>
          <NavLink to="/jobs" onClick={close}>
            <Search size={17} />
            Jobs
          </NavLink>
          {user && (
            <NavLink to={dashboardPath} onClick={close}>
              <LayoutDashboard size={17} />
              Dashboard
            </NavLink>
          )}
          {!user ? (
            <>
              <NavLink to="/login" onClick={close}>
                <UserRound size={17} />
                Login
              </NavLink>
              <Link className="button button-small" to="/register" onClick={close}>
                Sign up
              </Link>
            </>
          ) : (
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                logout();
                close();
              }}
            >
              <LogOut size={17} />
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

