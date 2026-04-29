import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../styles/SearchBar.module.css";
import { api } from "../lib/api";

type Props = {
  placeholder?: string;
  autoFocus?: boolean;
};

export default function SearchBar({ placeholder, autoFocus }: Props) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [q, setQ] = useState<string>(() => params.get("q") ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // If user clicks a "Quick risk" button that changes ?q=, keep input in sync
  useEffect(() => {
    const next = params.get("q") ?? "";
    setQ(next);
    setErr(null);
  }, [params]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;

    setBusy(true);
    setErr(null);

    try {
      const res = await api.search(query);
      if (res?.route) {
        navigate(res.route);
        return;
      }
      setErr(res?.message ?? 'No match. Try: "LA", "90001", "fire map", "fire LA"');
    } catch {
      setErr("Search failed. Make sure the server is running on :5050.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <input
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className={styles.input}
        placeholder={placeholder ?? 'Try: "LA", "90001", "fire map", "fire LA"'}
        aria-label="Search"
      />
      <button className={styles.button} disabled={busy}>
        {busy ? "…" : "Search"}
      </button>

      {err && <div className={styles.error}>{err}</div>}
    </form>
  );
}
