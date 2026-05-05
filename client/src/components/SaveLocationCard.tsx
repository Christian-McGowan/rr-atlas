import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Page.module.css";
import type { Place } from "../lib/types";

export default function SaveLocationCard({ place }: { place: Place }) {
  const { user, saveLocation } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const alreadySaved = user?.savedLocations.some((saved) => saved.slug === place.slug) ?? false;

  async function handleSave() {
    setMessage(null);
    setSaving(true);
    try {
      await saveLocation(place);
      setMessage(`${place.label} is now saved for monitoring.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save this location right now.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Account actions</div>
          <div className={styles.cardSub}>Save this profile and apply alert preferences to future updates.</div>
        </div>
      </div>
      <div className={styles.actionBody}>
        {user ? (
          <>
            <button className={styles.primaryAction} onClick={handleSave} disabled={saving || alreadySaved} type="button">
              {alreadySaved ? "Saved to account" : saving ? "Saving..." : "Save location"}
            </button>
            <Link className={styles.secondaryAction} to="/account">
              Manage account
            </Link>
          </>
        ) : (
          <>
            <Link className={styles.primaryAction} to="/account">
              Log in or create account
            </Link>
            <span className={styles.actionHint}>Accounts unlock saved locations and prototype alert settings.</span>
          </>
        )}
        {message && <div className={styles.inlineNotice}>{message}</div>}
      </div>
    </div>
  );
}
