import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { appRoutes } from "./routes";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {appRoutes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
