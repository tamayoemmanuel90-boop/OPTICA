"use client";

import { Search, X } from "lucide-react";
import { FILTER_OPTIONS } from "@/lib/data/catalog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface FilterState {
  query: string;
  audience: string[];
  category: string[];
  brand: string[];
  shape: string[];
  material: string[];
  color: string[];
  price: string | null;
}

export const EMPTY_FILTERS: FilterState = {
  query: "",
  audience: [],
  category: [],
  brand: [],
  shape: [],
  material: [],
  color: [],
  price: null,
};

function toggle(arr: readonly string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

interface ProductFiltersProps {
  value: FilterState;
  onChange: (f: FilterState) => void;
  count: number;
}

export function ProductFilters({ value, onChange, count }: ProductFiltersProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  const activeAdvanced =
    value.brand.length +
    value.shape.length +
    value.material.length +
    value.color.length +
    (value.price ? 1 : 0);
  const activeTotal =
    activeAdvanced +
    value.audience.length +
    value.category.length +
    (value.query ? 1 : 0);

  return (
    <div className="border-y border-black/5 py-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Búsqueda */}
        <div className="relative w-full xl:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            aria-label="Buscar armazones"
            placeholder="Buscar por nombre, marca, modelo o categoría…"
            value={value.query}
            onChange={(e) => set({ query: e.target.value })}
            className="h-11 w-full border border-black/10 bg-white pl-10 pr-9 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-brand"
          />
          {value.query && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => set({ query: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-black/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Chips + filtros avanzados */}
        <div className="flex flex-wrap items-center gap-2">
          <ChipGroup
            ariaLabel="Filtrar por audiencia"
            options={FILTER_OPTIONS.audience}
            selected={value.audience}
            onToggle={(v) => set({ audience: toggle(value.audience, v) })}
          />
          <ChipGroup
            ariaLabel="Filtrar por categoría"
            options={FILTER_OPTIONS.category}
            selected={value.category}
            onToggle={(v) => set({ category: toggle(value.category, v) })}
          />

          <MultiDropdown
            label="Marca"
            options={FILTER_OPTIONS.brands}
            selected={value.brand}
            onToggle={(v) => set({ brand: toggle(value.brand, v) })}
          />
          <MultiDropdown
            label="Forma"
            options={FILTER_OPTIONS.shapes}
            selected={value.shape}
            onToggle={(v) => set({ shape: toggle(value.shape, v) })}
          />
          <MultiDropdown
            label="Material"
            options={FILTER_OPTIONS.materials}
            selected={value.material}
            onToggle={(v) => set({ material: toggle(value.material, v) })}
          />
          <MultiDropdown
            label="Color"
            options={FILTER_OPTIONS.colors}
            selected={value.color}
            onToggle={(v) => set({ color: toggle(value.color, v) })}
            swatches
          />
          <MultiDropdown
            label="Precio"
            options={FILTER_OPTIONS.price}
            selected={value.price ? [value.price] : []}
            onToggle={(v) => set({ price: value.price === v ? null : v })}
          />

          {activeTotal > 0 && (
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              className="ml-1 inline-flex h-8 items-center gap-1 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand transition-opacity hover:opacity-70"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Limpiar ({activeTotal})
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-neutral-400" aria-live="polite">
        {count} {count === 1 ? "modelo" : "modelos"} · Precios en MXN
      </p>
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  onToggle,
  ariaLabel,
}: {
  options: readonly { value: string; label: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(o.value)}
            className={cn(
              "h-9 rounded-full border px-4 text-[12px] font-semibold transition-colors",
              active
                ? "border-ink bg-ink text-white"
                : "border-black/15 bg-white text-neutral-600 hover:border-ink hover:text-ink"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function MultiDropdown({
  label,
  options,
  selected,
  onToggle,
  swatches = false,
}: {
  label: string;
  options: readonly { value: string; label: string; hex?: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  swatches?: boolean;
}) {
  const active = selected.length > 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-[12px] font-semibold transition-colors",
            active
              ? "border-ink bg-ink text-white"
              : "border-black/15 bg-white text-neutral-600 hover:border-ink hover:text-ink"
          )}
        >
          {label}
          {active && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold">
              {selected.length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto rounded-none">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((o) => (
          <DropdownMenuCheckboxItem
            key={o.value}
            checked={selected.includes(o.value)}
            onCheckedChange={() => onToggle(o.value)}
            onSelect={(e) => e.preventDefault()}
            className="rounded-none"
          >
            <span className="flex items-center gap-2">
              {swatches && o.hex && (
                <span
                  className="inline-block h-3 w-3 rounded-full border border-black/10"
                  style={{ backgroundColor: o.hex }}
                  aria-hidden
                />
              )}
              {o.label}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
