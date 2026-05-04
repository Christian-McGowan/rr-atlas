import HomePage from "./pages/HomePage";
import AreaPage from "./pages/AreaPage";
import FireMapPage from "./pages/FireMapPage";
import FireAreaPage from "./pages/FireAreaPage";
import AboutPage from "./pages/AboutPage";

export const appRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/us/:slug", element: <AreaPage /> },
  { path: "/fire", element: <FireMapPage /> },
  { path: "/fire/:slug", element: <FireAreaPage /> }
  { path: "/about", element: <AboutPage /> }
];
