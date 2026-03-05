import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TodoFilter } from "@/app/todos/types";

type TodoFilterTabsProps = {
  activeFilter: TodoFilter;
};

const FILTERS: Array<{ label: string; value: TodoFilter }> = [
  { label: "전체", value: "all" },
  { label: "진행중", value: "active" },
  { label: "완료", value: "completed" },
];

function toFilterHref(filter: TodoFilter): string {
  if (filter === "all") {
    return "/todos";
  }

  return `/todos?filter=${filter}`;
}

export function TodoFilterTabs({ activeFilter }: TodoFilterTabsProps) {
  return (
    <nav aria-label="할 일 필터" className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = filter.value === activeFilter;

        return (
          <Link
            key={filter.value}
            className={cn(
              buttonVariants({ variant: isActive ? "default" : "outline", size: "sm" }),
            )}
            href={toFilterHref(filter.value)}
            prefetch={false}
          >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
