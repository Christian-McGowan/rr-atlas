const desktopPageStyle = {
  minHeight: "100vh",
  padding: "96px 24px 48px",
  background: "linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%)",
  color: "#0f172a"
};

const desktopShellStyle = {
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
  textAlign: "center" as const
};

const desktopTitleStyle = {
  margin: "0 auto 28px",
  fontSize: 44,
  lineHeight: 1.05,
  letterSpacing: "-0.03em",
  textAlign: "center" as const
};

const desktopTextStyle = {
  maxWidth: 1080,
  margin: "0 auto 18px",
  color: "#0f172a",
  fontSize: 17,
  lineHeight: 1.65,
  textAlign: "left" as const
};

const MethodologyPage = () => {
  return (
    <main className="info-page" style={desktopPageStyle}>
      <section className="desktop-info-copy" style={desktopShellStyle}>
        <h1 style={desktopTitleStyle}>Methodology for R&amp;R Atlas</h1>

        <p style={desktopTextStyle}>
          In its current form, this Risk and Resilience Atlas web application is only a prototype as a proof of concept
          meant to demonstrate the application&apos;s basic functionality and user interface. Even though we expect a fully
          released R&amp;R Atlas to use real data, this prototype utilizes in-memory demo data in order to quickly
          demonstrate how risk and resilience data will be shown on the application.
        </p>

        <p style={desktopTextStyle}>
          This prototype demonstrates usage of an interactive map, a search bar that when used will show results for the
          current demo data, the ability to compare two cities, a login/create account feature, and a few page menu
          options a user can click through.
        </p>

        <p style={desktopTextStyle}>
          When an actual working release of R&amp;R Atlas is completed, the risk and resilience data will be pulled from
          numerous federal and organizational data sources, including NOAA, FEMA, AirNow, and USGS, using API adapters.
          Data will also be taken from various news feeds that cover topics involving risk and resilience.
        </p>

        <p style={desktopTextStyle}>
          The accessibility of this data onto a simplistic UI will be important priorities for the development of R&amp;R
          Atlas going forward, which makes the development of this prototype important for our users that might not be
          skilled with data analysis and research.
        </p>

        <p style={desktopTextStyle}>
          The final release of R&amp;R Atlas will be an updated version of this prototype that does not significantly
          rewrite the client UI, uses real data, integrates a database with risk and resilience data collections,
          integrates a notification system, and implements the ability for users to save locations.
        </p>
      </section>

      <section className="mobile-info-copy info-shell">
        <article className="info-card">
          <h1>Methodology for R&amp;R Atlas</h1>

          <p>
            R&amp;R Atlas is currently a prototype that demonstrates the application&apos;s basic user flow, visual design,
            and core risk/resilience features using demo data.
          </p>

          <p>
            The prototype includes an interactive map, search, city comparison, account creation, saved-location actions,
            and basic menu pages.
          </p>
        </article>

        <article className="info-card">
          <h2>Future data sources</h2>
          <p>
            A full version would connect to sources such as NOAA, FEMA, AirNow, and USGS through API adapters, then
            summarize the data into simple risk and resilience indicators.
          </p>

          <h2>Prototype goal</h2>
          <p>
            The goal is to show how complex environmental information can become a clear, mobile-friendly decision tool
            without requiring users to read raw datasets.
          </p>
        </article>
      </section>
    </main>
  );
};

export default MethodologyPage;
