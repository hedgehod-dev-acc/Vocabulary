import { NavLink } from "react-router-dom";
import {
  FolderSimple,
  ListBullets,
  PlusCircle,
  type Icon,
} from "@phosphor-icons/react";
import { routes } from "./routes";

interface Tab {
  to: string;
  label: string;
  Icon: Icon;
}

const TABS: Tab[] = [
  { to: routes.add, label: "Add", Icon: PlusCircle },
  { to: routes.words, label: "Words", Icon: ListBullets },
  { to: routes.sets, label: "Sets", Icon: FolderSimple },
];

export default function BottomTabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-t border-neutral-200"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="w-full max-w-xl mx-auto grid grid-cols-3">
        {TABS.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === routes.sets ? false : undefined}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 h-14 text-[11px] font-medium transition ${
                  isActive ? "text-indigo-600" : "text-neutral-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    weight={isActive ? "fill" : "regular"}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
