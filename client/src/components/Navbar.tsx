import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Navbar.module.css";

function navClass(isActive: boolean) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

function mobileTabClass(isActive: boolean) {
  return isActive ? `${styles.mobileTab} ${styles.mobileTabActive}` : styles.mobileTab;
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className={styles.nav}>
        <Link to="/" className={styles.brand}>
          R&amp;R Atlas
        </Link>

        <nav className={styles.links} aria-label="Primary navigation">
          <NavLink to="/" className={({ isActive }) => navClass(isActive)}>
            Explore
          </NavLink>
          <NavLink to="/compare" className={({ isActive }) => navClass(isActive)}>
            Compare
          </NavLink>
          <NavLink to="/methodology" className={({ isActive }) => navClass(isActive)}>
            Methodology
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => navClass(isActive)}>
            About
          </NavLink>
        </nav>

        <div className={styles.accountArea}>
          {user ? (
            <>
              <NavLink
                to="/account"
                className={({ isActive }) => (isActive ? `${styles.accountLink} ${styles.active}` : styles.accountLink)}
                aria-label="Open account dashboard"
              >
                <span className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</span>
                <span className={styles.accountName}>{user.name.split(" ")[0]}</span>
              </NavLink>
              <button className={styles.logoutButton} onClick={logout} type="button">
                Log out
              </button>
            </>
          ) : (
            <NavLink
              to="/account"
              className={({ isActive }) => (isActive ? `${styles.loginButton} ${styles.active}` : styles.loginButton)}
            >
              Log in
            </NavLink>
          )}
        </div>
      </header>

      <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">
        <NavLink to="/" className={({ isActive }) => mobileTabClass(isActive)}>
          Map
        </NavLink>
        <NavLink to="/compare" className={({ isActive }) => mobileTabClass(isActive)}>
          Compare
        </NavLink>
        <NavLink to="/methodology" className={({ isActive }) => mobileTabClass(isActive)}>
          Method
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => mobileTabClass(isActive)}>
          About
        </NavLink>
        <NavLink to="/account" className={({ isActive }) => mobileTabClass(isActive)}>
          {user ? "Profile" : "Sign in"}
        </NavLink>
      </nav>
    </>
  );
}
