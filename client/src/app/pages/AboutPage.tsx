const teamMembers = ["Christian McGowan", "Joanna Menghamal", "Stav Sendrovitz", "Owen Keyser", "Emmanuel De Guzman"];

const desktopPageStyle = {
  minHeight: "100vh",
  padding: "96px 24px 48px",
  background: "linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%)",
  color: "#0f172a"
};

const desktopShellStyle = {
  width: "100%",
  maxWidth: 1220,
  margin: "0 auto",
  textAlign: "center" as const
};

const desktopTitleStyle = {
  margin: "0 auto 22px",
  fontSize: 32,
  lineHeight: 1.1,
  letterSpacing: "-0.03em",
  textAlign: "center" as const
};

const desktopTextStyle = {
  maxWidth: 1120,
  margin: "0 auto 18px",
  color: "#334155",
  fontSize: 15,
  lineHeight: 1.55,
  textAlign: "center" as const
};

const desktopSubheadStyle = {
  margin: "24px auto 14px",
  fontSize: 20,
  letterSpacing: "-0.02em",
  textAlign: "center" as const
};

const teamListStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap" as const,
  gap: "14px 22px",
  listStyle: "none",
  padding: 0,
  margin: "0 auto 22px",
  fontSize: 13,
  fontWeight: 800,
  color: "#0f172a",
  textAlign: "center" as const
};

const AboutPage = () => {
  return (
    <main className="info-page" style={desktopPageStyle}>
      <section className="desktop-info-copy" style={desktopShellStyle}>
        <h1 style={desktopTitleStyle}>About R&amp;R Atlas</h1>

        <p style={desktopTextStyle}>
          Risk and Resilience Atlas is a project developed by five students from California State University, Fullerton
          as part of our capstone project. R&amp;R Atlas is a web application that provides users with a comprehensive
          overview of the risks and resilience factors in their communities. This app is meant to help users make
          informed decisions about where to live, how to prepare for environmental hazards and disasters, and how to
          create more resilient communities.
        </p>

        <h2 style={desktopSubheadStyle}>Meet the Team</h2>
        <ul style={teamListStyle}>
          {teamMembers.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>

        <h2 style={desktopSubheadStyle}>Github Repository</h2>
        <p style={desktopTextStyle}>github.com/Christian-McGowan/rr-atlas</p>
      </section>

      <section className="mobile-info-copy info-shell">
        <article className="info-card">
          <h1>About R&amp;R Atlas</h1>

          <p>
            Risk and Resilience Atlas is a capstone project from California State University, Fullerton. It helps users
            understand environmental risk and community resilience in a simpler map-based interface.
          </p>

          <p>
            The prototype is designed for exploring places, comparing city risk, saving locations, and preparing for
            future account and alert features.
          </p>
        </article>

        <article className="info-card">
          <h2>Meet the team</h2>
          <ul>
            {teamMembers.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>

          <h2>Repository</h2>
          <p>github.com/Christian-McGowan/rr-atlas</p>
        </article>
      </section>
    </main>
  );
};

export default AboutPage;
