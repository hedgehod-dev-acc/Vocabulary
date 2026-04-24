import { useLocation, useNavigate } from "react-router-dom";
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
  match: (pathname: string) => boolean;
}

const TABS: Tab[] = [
  {
    to: routes.add,
    label: "Add",
    Icon: PlusCircle,
    match: (p) => p.startsWith("/add"),
  },
  {
    to: routes.words,
    label: "Words",
    Icon: ListBullets,
    match: (p) => p.startsWith("/words"),
  },
  {
    to: routes.sets,
    label: "Sets",
    Icon: FolderSimple,
    match: (p) => p.startsWith("/sets"),
  },
];

export default function BottomTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => t.match(pathname))
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 px-3 pointer-events-none"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
      aria-label="Primary"
    >
      <div className="pointer-events-auto w-full max-w-xl mx-auto">
        <div className="relative bg-surface/75 backdrop-blur-xl ring-1 ring-hairline rounded-2xl shadow-[var(--shadow-lift)] p-1.5 flex animate-rise">
          <span
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-1.5 rounded-xl bg-ink will-change-transform transition-transform duration-[420ms] ease-[var(--ease-spring)]"
            style={{
              width: "calc((100% - 0.75rem) / 3)",
              transform: `translateX(calc(${activeIndex} * 100%))`,
            }}
          />
          {TABS.map(({ to, label, Icon }, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={to}
                type="button"
                onClick={() => navigate(to)}
                aria-current={isActive ? "page" : undefined}
                className="relative z-10 flex-1 h-12 flex items-center justify-center gap-1.5 rounded-xl press focus-ring"
              >
                <Icon
                  size={20}
                  weight={isActive ? "fill" : "regular"}
                  aria-hidden="true"
                  className={`transition-all duration-300 ease-[var(--ease-spring)] ${
                    isActive
                      ? "text-paper scale-110"
                      : "text-ink-muted scale-100"
                  }`}
                />
                <span
                  className={`text-[12px] font-semibold tracking-tight transition-colors duration-300 ${
                    isActive ? "text-paper" : "text-ink-muted"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
