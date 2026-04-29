import styles from "../styles/Panel.module.css";
import type { CommunityResource } from "../lib/types";

export default function ResourceList({ resources }: { resources: CommunityResource[] }) {
  if (!resources.length) {
    return <div className={styles.empty}>No resources available (demo).</div>;
  }

  return (
    <ul className={styles.resourceList}>
      {resources.map((r) => (
        <li key={r.id} className={styles.resourceItem}>
          <div className={styles.resourceTitle}>{r.name}</div>
          <div className={styles.resourceMeta}>
            <span className={styles.badge}>{r.type}</span>
            <span className={styles.badgeMuted}>{r.address}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
