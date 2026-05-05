import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.nav}>
      <Link to="/" className={styles.brand}>
        R&amp;R Atlas
      </Link>

      <nav className={styles.links}>
        <NavLink to="/" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          Explore
        </NavLink>
        <NavLink to="/methodology" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          Methodology
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          About
        </NavLink>
      </nav>

      <div className={styles.accountArea}>
        {user ? (
          <>
            <NavLink to="/account" className={({ isActive }) => (isActive ? `${styles.accountLink} ${styles.active}` : styles.accountLink)}>
              <span className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</span>
              <span className={styles.accountName}>{user.name.split(" ")[0]}</span>
            </NavLink>
            <button className={styles.logoutButton} onClick={logout} type="button">
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/account" className={({ isActive }) => (isActive ? `${styles.loginButton} ${styles.active}` : styles.loginButton)}>
            Log in
          </NavLink>
        )}
      </div>
    </header>
  );
}
