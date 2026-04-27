import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";
import { uiPrefs } from "../features/ui/uiPrefs";

export default function AppShell() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/sets")) {
      uiPrefs.setSetsPath(pathname);
    }
  }, [pathname]);

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
