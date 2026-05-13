import HomePage from "./pages/HomePage";
import AreaPage from "./pages/AreaPage";
import FireMapPage from "./pages/FireMapPage";
import FireAreaPage from "./pages/FireAreaPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
import MethodologyPage from "./pages/MethodologyPage";
import ComparePage from "./pages/ComparePage";

export const appRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/account", element: <AccountPage /> },
  { path: "/compare", element: <ComparePage /> },
  { path: "/us/:slug", element: <AreaPage /> },
  { path: "/fire", element: <FireMapPage /> },
  { path: "/fire/:slug", element: <FireAreaPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/methodology", element: <MethodologyPage /> }
];
