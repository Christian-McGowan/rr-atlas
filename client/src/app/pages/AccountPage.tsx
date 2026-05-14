import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/Account.module.css";
import type { AlertPreferences } from "../../lib/types";

const HAZARD_OPTIONS = ["Wildfire", "Flood", "Severe storm", "Air quality", "Extreme heat", "Earthquake"];
const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Extreme"];

type AuthMode = "login" | "register";

function emptyPrefs(): AlertPreferences {
  return {
    emailAlerts: true,
    inAppAlerts: true,
    minimumSeverity: "Medium",
    hazards: ["Wildfire", "Flood", "Severe storm"],
    weeklySummary: true,
    quietHours: false
  };
}

function AuthForms() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "register") {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.authShell}>
      <div className={styles.authInfo}>
        <div className={styles.eyebrow}>Prototype account system</div>
        <h1 className={styles.title}>Save risk profiles and manage alert settings.</h1>
        <p className={styles.lead}>
          Create a lightweight account for saved locations, notification preferences, and a personalized Atlas dashboard.
          This prototype stores accounts through the local Express server and keeps the signed-in session in the browser.
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <span>📍</span>
            <strong>Saved locations</strong>
            <small>Keep city and ZIP profiles available for monitoring.</small>
          </div>
          <div className={styles.featureCard}>
            <span>🔔</span>
            <strong>Alert preferences</strong>
            <small>Choose hazard types, severity level, and channels.</small>
          </div>
          <div className={styles.featureCard}>
            <span>🔐</span>
            <strong>Basic sign in</strong>
            <small>Email and password only; no MFA or production auth complexity.</small>
          </div>
        </div>
      </div>

      <div className={styles.authCard}>
        <div className={styles.modeSwitch} role="tablist" aria-label="Choose authentication mode">
          <button
            className={mode === "login" ? styles.modeActive : styles.modeButton}
            onClick={() => setMode("login")}
            type="button"
          >
            Log in
          </button>
          <button
            className={mode === "register" ? styles.modeActive : styles.modeButton}
            onClick={() => setMode("register")}
            type="button"
          >
            Create account
          </button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          {mode === "register" && (
            <label className={styles.field}>
              <span>Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} minLength={2} required />
            </label>
          )}

          <label className={styles.field}>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              minLength={6}
              required
            />
          </label>

          {mode === "register" && (
            <label className={styles.field}>
              <span>Confirm password</span>
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type="password"
                minLength={6}
                required
              />
            </label>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submitButton} disabled={busy} type="submit">
            {busy ? "Working..." : mode === "register" ? "Create account" : "Log in"}
          </button>
        </form>
      </div>
    </section>
  );
}

function PreferencesEditor({ initialPreferences }: { initialPreferences: AlertPreferences }) {
  const { updatePreferences } = useAuth();
  const [preferences, setPreferences] = useState<AlertPreferences>(initialPreferences);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleHazard(hazard: string) {
    setPreferences((current) => {
      const nextHazards = current.hazards.includes(hazard)
        ? current.hazards.filter((item) => item !== hazard)
        : [...current.hazards, hazard];
      return { ...current, hazards: nextHazards };
    });
  }

  async function savePreferences() {
    setSaving(true);
    setMessage(null);
    try {
      await updatePreferences(preferences);
      setMessage("Alert preferences saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save preferences.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.cardHeaderInline}>
        <div>
          <h2>Alert preferences</h2>
          <p>Prototype rules that would be applied to saved-location monitoring.</p>
        </div>
        <button className={styles.saveButton} onClick={savePreferences} disabled={saving} type="button">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className={styles.preferenceGrid}>
        <label className={styles.toggleRow}>
          <input
            checked={preferences.emailAlerts}
            onChange={(event) => setPreferences({ ...preferences, emailAlerts: event.target.checked })}
            type="checkbox"
          />
          <span>Email alerts</span>
        </label>
        <label className={styles.toggleRow}>
          <input
            checked={preferences.inAppAlerts}
            onChange={(event) => setPreferences({ ...preferences, inAppAlerts: event.target.checked })}
            type="checkbox"
          />
          <span>In-app alerts</span>
        </label>
        <label className={styles.toggleRow}>
          <input
            checked={preferences.weeklySummary}
            onChange={(event) => setPreferences({ ...preferences, weeklySummary: event.target.checked })}
            type="checkbox"
          />
          <span>Weekly digest</span>
        </label>
        <label className={styles.toggleRow}>
          <input
            checked={preferences.quietHours}
            onChange={(event) => setPreferences({ ...preferences, quietHours: event.target.checked })}
            type="checkbox"
          />
          <span>Quiet hours</span>
        </label>
      </div>

      <label className={styles.field}>
        <span>Minimum alert severity</span>
        <select
          value={preferences.minimumSeverity}
          onChange={(event) => setPreferences({ ...preferences, minimumSeverity: event.target.value })}
        >
          {SEVERITY_OPTIONS.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.chipGroup} aria-label="Hazard categories">
        {HAZARD_OPTIONS.map((hazard) => (
          <button
            key={hazard}
            className={preferences.hazards.includes(hazard) ? styles.chipActive : styles.chip}
            onClick={() => toggleHazard(hazard)}
            type="button"
          >
            {hazard}
          </button>
        ))}
      </div>

      {message && <div className={styles.notice}>{message}</div>}
    </div>
  );
}

function ProfileEditor() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({ name });
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.dashboardCard} onSubmit={saveProfile}>
      <div className={styles.cardHeaderInline}>
        <div>
          <h2>Profile</h2>
          <p>Basic account details for this prototype.</p>
        </div>
        <button className={styles.saveButton} disabled={saving} type="submit">
          {saving ? "Saving..." : "Update"}
        </button>
      </div>

      <label className={styles.field}>
        <span>Name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} minLength={2} required />
      </label>
      {message && <div className={styles.notice}>{message}</div>}
    </form>
  );
}

function SavedLocations() {
  const { user, removeLocation } = useAuth();
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);
  const savedLocations = user?.savedLocations ?? [];

  async function remove(slug: string) {
    setRemovingSlug(slug);
    try {
      await removeLocation(slug);
    } finally {
      setRemovingSlug(null);
    }
  }

  if (savedLocations.length === 0) {
    return (
      <div className={styles.dashboardCard}>
        <h2>Saved locations</h2>
        <p className={styles.emptyState}>No saved locations yet. Search for a city or ZIP, then save its profile.</p>
        <Link className={styles.inlineButton} to="/">
          Explore map
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.dashboardCard}>
      <h2>Saved locations</h2>
      <div className={styles.savedList}>
        {savedLocations.map((location) => (
          <article className={styles.savedItem} key={location.slug}>
            <div>
              <strong>{location.label}</strong>
              <small>
                {location.type.toUpperCase()} profile · saved {new Date(location.addedAt).toLocaleDateString()}
              </small>
            </div>
            <div className={styles.savedActions}>
              <Link to={`/us/${location.slug}`}>Open</Link>
              <button disabled={removingSlug === location.slug} onClick={() => void remove(location.slug)} type="button">
                {removingSlug === location.slug ? "Removing..." : "Remove"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const preferences = useMemo(() => user?.preferences ?? emptyPrefs(), [user?.preferences]);

  if (!user) return null;

  return (
    <section className={styles.dashboardShell}>
      <div className={styles.dashboardHero}>
        <div>
          <div className={styles.eyebrow}>Account dashboard</div>
          <h1 className={styles.title}>Welcome back, {user.name.split(" ")[0]}.</h1>
          <p className={styles.lead}>Manage saved places, prototype alert rules, and basic profile details.</p>
        </div>
        <button className={styles.logoutButton} onClick={logout} type="button">
          Log out
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>{user.savedLocations.length}</span>
          <small>Saved locations</small>
        </div>
        <div className={styles.statCard}>
          <span>{preferences.hazards.length}</span>
          <small>Alert hazards</small>
        </div>
        <div className={styles.statCard}>
          <span>{preferences.minimumSeverity}</span>
          <small>Minimum severity</small>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardStack}>
          <ProfileEditor />
          <SavedLocations />
        </div>
        <PreferencesEditor initialPreferences={preferences} />
      </div>
    </section>
  );
}

export default function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingCard}>Loading account...</div>
      </main>
    );
  }

  return <main className={styles.page}>{user ? <Dashboard /> : <AuthForms />}</main>;
}
