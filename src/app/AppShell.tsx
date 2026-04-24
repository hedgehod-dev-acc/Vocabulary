import { Outlet, useLocation } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";

export default function AppShell() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-dvh flex flex-col relative">
      <div className="ambient-bg" aria-hidden="true" />
      <div
        key={pathname.split("/")[1] ?? "root"}
        className="flex-1 w-full max-w-xl mx-auto pb-[calc(env(safe-area-inset-bottom)+5.5rem)] animate-fade-in"
      >
        <Outlet />
      </div>
      <BottomTabBar />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
