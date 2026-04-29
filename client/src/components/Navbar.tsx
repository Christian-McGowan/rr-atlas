import { NavLink, Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
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
    </header>
  );
}
