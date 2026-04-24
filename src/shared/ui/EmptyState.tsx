import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="py-14 text-center animate-fade-in">
      {icon && <div className="mb-3 grid place-items-center">{icon}</div>}
      <p className="text-[17px] font-semibold text-neutral-800">{title}</p>
      {description && (
        <p className="mt-1 text-[14px] text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
