import HomePage from "./pages/HomePage";
import AreaPage from "./pages/AreaPage";
import FireMapPage from "./pages/FireMapPage";
import FireAreaPage from "./pages/FireAreaPage";
import AboutPage from "./pages/AboutPage";
import AccountPage from "./pages/AccountPage";
import MethodologyPage from "./pages/MethodologyPage";

export const appRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/account", element: <AccountPage /> },
  { path: "/us/:slug", element: <AreaPage /> },
  { path: "/fire", element: <FireMapPage /> },
  { path: "/fire/:slug", element: <FireAreaPage /> }
  { path: "/about", element: <AboutPage /> }
  { path: "/fire/:slug", element: <FireAreaPage /> },
  { path: "/methodology", element: <MethodologyPage />}
];
