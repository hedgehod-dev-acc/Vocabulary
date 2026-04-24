import { Outlet } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";

export default function AppShell() {
  return (
    <div className="min-h-dvh flex flex-col">
      <div
        className="flex-1 w-full max-w-xl mx-auto pb-[calc(env(safe-area-inset-bottom)+4rem)]"
      >
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  );
}
