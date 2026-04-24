import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./AppShell";
import { routePatterns, routes } from "./routes";
import AddPage from "../pages/AddPage";
import WordsPage from "../pages/WordsPage";
import SetsPage from "../pages/SetsPage";
import SetDetailPage from "../pages/SetDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to={routes.add} replace />} />
        <Route path={routePatterns.add} element={<AddPage />} />
        <Route path={routePatterns.words} element={<WordsPage />} />
        <Route path={routePatterns.sets} element={<SetsPage />} />
        <Route path={routePatterns.setDetail} element={<SetDetailPage />} />
        <Route path="*" element={<Navigate to={routes.add} replace />} />
      </Route>
    </Routes>
  );
}
