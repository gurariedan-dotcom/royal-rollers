"use client";

import { useRef } from "react";
import {
  Car,
  CarProfile,
  CarSimple,
  Truck,
  Van,
  Motorcycle,
  Question,
} from "@phosphor-icons/react/dist/ssr";
import { VEHICLE_TYPES, VEHICLE_TYPE_LABELS } from "@/lib/validation";

// Phosphor's set has no distinct body-style icons for every type (no
// separate coupe/wagon/convertible glyph) -- these are the closest
// available shape per type. Swap for real photography later; the picker
// itself doesn't care what's inside each card.
const ICONS: Record<(typeof VEHICLE_TYPES)[number], typeof Car> = {
  sedan: Car,
  suv: CarProfile,
  truck: Truck,
  van: Van,
  coupe: CarSimple,
  wagon: Car,
  convertible: CarSimple,
  motorcycle: Motorcycle,
  other: Question,
};

type VehicleTypePickerProps = {
  id?: string;
  value: (typeof VEHICLE_TYPES)[number] | "";
  onChange: (value: (typeof VEHICLE_TYPES)[number]) => void;
  hasError?: boolean;
};

export default function VehicleTypePicker({ id, value, onChange, hasError }: VehicleTypePickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id={id}
      ref={trackRef}
      role="radiogroup"
      aria-label="Vehicle type"
      className={[
        "flex snap-x snap-mandatory gap-2 overflow-x-auto py-1",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        hasError ? "outline outline-1 outline-offset-4 outline-brass-dark" : "",
      ].join(" ")}
    >
      {VEHICLE_TYPES.map((type) => {
        const Icon = ICONS[type];
        const selected = value === type;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={(e) => {
              onChange(type);
              e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }}
            className={[
              "flex w-16 shrink-0 snap-center flex-col items-center gap-1.5 rounded-btn border px-1.5 py-2 text-center transition-[transform,box-shadow,background-color,border-color] duration-150 ease-out active:scale-[0.95]",
              selected
                ? "border-transparent bg-brass text-paper shadow-button"
                : "border-transparent bg-paper text-ink/70 shadow-button-sm hover:shadow-button",
            ].join(" ")}
          >
            <Icon size={20} weight={selected ? "fill" : "regular"} aria-hidden="true" />
            <span className="w-full break-words font-mono text-xs uppercase leading-tight tracking-wideish [overflow-wrap:anywhere]">
              {VEHICLE_TYPE_LABELS[type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
