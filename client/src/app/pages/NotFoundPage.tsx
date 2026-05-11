import styles from "../../styles/Page.module.css";
import SearchBar from "../../components/SearchBar";

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardTitle}>Page not found</div>
            <div className={styles.cardSub}>Try searching for a place or hazard.</div>
            <div style={{ marginTop: 16 }}>
              <SearchBar placeholder='Try: "LA", "90001", "fire map"' />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
