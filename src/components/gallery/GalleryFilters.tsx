"use client";

import { Search, X } from "lucide-react";

/**
 * Category chips + search (spec sections 20, 21).
 *
 * Only categories that actually have visible photos are offered, so a visitor
 * can never select a filter that returns an empty grid.
 */
export function GalleryFilters({
  categories,
  active,
  onCategoryChange,
  search,
  onSearchChange,
  counts,
}: {
  categories: string[];
  active: string;
  onCategoryChange: (category: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-5"
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search gallery..."
          aria-label="Search the gallery"
          className="field !py-3 !pl-10 !pr-10"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-slate-5 transition-colors hover:bg-slate-2 hover:text-navy-900"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            data-active={active === category}
            aria-pressed={active === category}
            className="chip"
          >
            {category}
            <span
              className={`numeric text-[10px] ${
                active === category ? "text-white/60" : "text-slate-5"
              }`}
            >
              {counts[category] ?? 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
