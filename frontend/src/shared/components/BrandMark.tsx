import { RadioTower } from 'lucide-react';

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="inline-flex items-center gap-2 text-primary">
      <span className="grid size-8 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/10">
        <RadioTower className="size-4" aria-hidden="true" />
      </span>
      <span className={compact ? 'text-sm font-semibold' : 'text-base font-semibold'}>
        Cannons CAD
      </span>
    </div>
  );
}
