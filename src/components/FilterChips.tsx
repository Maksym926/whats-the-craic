import { Chip } from "@/components/Chip"
import { CATEGORY_LABEL } from "@/lib/categories"
import type { Category } from "@/types"

interface FilterChipsProps {
  categories: Category[]
  /** null = All */
  selected: Category | null
  onChange: (category: Category | null) => void
}

/** Horizontally scrolling single-select category filter. */
export function FilterChips({ categories, selected, onChange }: FilterChipsProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Filter by category"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none]"
    >
      <Chip mode="radio" selected={selected === null} onClick={() => onChange(null)}>
        all
      </Chip>
      {categories.map((c) => (
        <Chip key={c} mode="radio" selected={selected === c} onClick={() => onChange(c)}>
          {CATEGORY_LABEL[c]}
        </Chip>
      ))}
    </div>
  )
}
