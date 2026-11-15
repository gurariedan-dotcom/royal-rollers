"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import RouteProgress from "./RouteProgress";
import DatePicker from "./DatePicker";
import { quoteRequestSchema, FLEXIBILITY_LABELS, VEHICLE_TYPES, VEHICLE_TYPE_LABELS } from "@/lib/validation";

const STEPS = ["Service", "Vehicle", "Route", "Timing", "Contact"];

// Common makes for the manual-entry dropdown. Not exhaustive -- "Other" falls
// back to a free-text box so an uncommon make never blocks the customer.
const COMMON_MAKES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge",
  "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia",
  "Land Rover", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Mini",
  "Mitsubishi", "Nissan", "Porsche", "Ram", "Subaru", "Tesla", "Toyota",
  "Volkswagen", "Volvo",
];
const OTHER_MAKE = "__other__";

const CURRENT_YEAR = new Date().getFullYear();
const VEHICLE_YEARS = Array.from({ length: CURRENT_YEAR + 1 - 1980 + 1 }, (_, i) => String(CURRENT_YEAR + 1 - i));

type FormState = {
  serviceType: "carrier" | "personal_driver" | "";
  vin: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleType: (typeof VEHICLE_TYPES)[number] | "";
  isRunning: "running" | "not_running" | "";
  enclosed: "open" | "enclosed" | "";
  pickupZip: string;
  dropoffZip: string;
  roundTrip: boolean;
  preferredPickupDate: string;
  flexibilityWindow: keyof typeof FLEXIBILITY_LABELS | "";
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  agreedToTerms: boolean;
};

const EMPTY_FORM: FormState = {
  serviceType: "",
  vin: "",
  vehicleYear: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleType: "",
  isRunning: "",
  enclosed: "",
  pickupZip: "",
  dropoffZip: "",
  roundTrip: false,
  preferredPickupDate: "",
  flexibilityWindow: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  agreedToTerms: false,
};

function inputClass(hasError: boolean) {
  return hasError ? "field field-error" : "field";
}

// Year/Make/Model use the same field style; selects add room for the chevron.
const vehicleFieldClass = inputClass;

function vehicleSelectClass(hasError: boolean) {
  return `${inputClass(hasError)} cursor-pointer appearance-none pr-10`;
}

// Solid-silhouette side-profile icons for the vehicle-type picker, styled
// after flat-fill vehicle iconography: filled body, cut-out window panes,
// wheels with a cut-out rim. Not vehicle-specific art, one shared style.
// viewBox is 0 0 40 20.
const VEHICLE_ICONS: Record<
  (typeof VEHICLE_TYPES)[number],
  { body: string; windows: string[]; wheels: [number, number] }
> = {
  // low hood, early windshield rake, flat roof, short trunk -- 2 panes
  sedan: {
    body: "M2 16 L2 13 L5 13 L8.5 9 L14 6 L23 6 L27 9 L30.5 9.3 Q34 9.6 34 13 L37 13 L37 16 Z",
    windows: ["M9.5 12 L9.5 9.2 L14 6.8 L17.5 6.8 L17.5 12 Z", "M19 12 L19 6.8 L23 6.8 L26.5 9.5 L26.5 12 Z"],
    wheels: [9, 29],
  },
  // compact rounded crossover -- shorter & lower than full_size_suv, one continuous DLO
  suv: {
    body: "M2 16 L2 12 L4.5 12 L7 8 L12.5 5.7 L23 5.7 L27 8 L30 8.3 Q33.5 8.6 33.5 12 L36 12 L36 16 Z",
    windows: ["M8 11.5 L8 8.3 L12.5 6.2 L16.5 6.2 L16.5 11.5 Z", "M18 11.5 L18 6.2 L23 6.2 L26.5 8.6 L26.5 11.5 Z"],
    wheels: [9, 29],
  },
  // tall boxy body-on-frame SUV -- flat roof, near-vertical tailgate, 3 panes
  full_size_suv: {
    body: "M1 16 L1 11 L3.5 11 L6 7 L12 4.5 L24 4.5 L28 7 L32 7.3 Q35.5 7.6 35.5 11 L37.5 11 L37.5 16 Z",
    windows: [
      "M7 10.5 L7 7.6 L11.5 5.3 L15.5 5.3 L15.5 10.5 Z",
      "M17 10.5 L17 5.3 L23.5 5.3 L27.5 7.5 L27.5 10.5 Z",
      "M29 10.5 L29 7.8 L32.5 7.8 L34 9.2 L34 10.5 Z",
    ],
    wheels: [8, 33],
  },
  // steep near-vertical nose, tall greenhouse, long flat roof -- 3 panes
  minivan: {
    body: "M2 16 L2 8.5 L4.5 6 L9 5 L11 4 L29 4 L32.5 6.5 L35 7 L35 16 Z",
    windows: [
      "M6 11.5 L6 6.3 L9.5 5.3 L13 5.3 L13 11.5 Z",
      "M14.5 11.5 L14.5 5.3 L25.5 5.3 L25.5 11.5 Z",
      "M27 11.5 L27 6.8 L31 7.3 L31 11.5 Z",
    ],
    wheels: [8, 31],
  },
  // short cab up front with its own window, long flat open bed behind -- 1 pane
  pickup: {
    body: "M2 16 L2 11 L4.5 11 L7 6.5 L13 6 L15.5 9 L17 9 L34 9 L34 16 Z",
    windows: ["M6.5 10.3 L6.5 7.3 L10 7 L13 7.4 L14.7 10.3 Z"],
    wheels: [8, 30],
  },
  // boxy cargo body, rounded nose, only the windshield/front-door pane is glazed
  van: {
    body: "M2 16 L2 8 L3.5 6.7 L8 6.5 L11 4.3 L34 4.3 L37 7.5 L37 16 Z",
    windows: ["M8.5 7.6 L8.5 5 L11.5 4.6 L14.5 4.6 L14.5 7.6 Z"],
    wheels: [8, 32],
  },
  // long low hood, cabin pushed rearward, steeply raked single DLO, short deck
  coupe: {
    body: "M4 16 L4 13 L7 13 L12 8.5 L17 7 L20.5 7 L24 10 L28 12 L31 12.3 L31 16 Z",
    windows: ["M11.5 12.4 L11.5 9.2 L15.5 7.5 L18 7.5 L18 12.4 Z", "M19 12.4 L19 7.5 L22.5 7.5 L26 10.3 L26 12.4 Z"],
    wheels: [9, 27],
  },
  // sedan-like nose, roofline runs flat to a near-vertical tailgate -- 3 panes
  wagon: {
    body: "M2 16 L2 13 L5 13 L8.5 9 L14 6 L27 6 L30 9 L34 9 L34 12 L36 12 L36 16 Z",
    windows: [
      "M9.5 12 L9.5 9.2 L14 6.8 L17.5 6.8 L17.5 12 Z",
      "M19 12 L19 6.8 L28 6.8 L31 9.5 L31 12 Z",
      "M32.5 12 L32.5 9.7 L34 9.7 L35 10.6 L35 12 Z",
    ],
    wheels: [9, 32],
  },
  // low open body, thin windshield-frame mast, flat cockpit deck, headrest hump
  convertible: {
    body: "M3 16 L3 13.3 L5.5 13.3 L8 11.7 L9.5 11.9 L9.7 13 L18 13 L18.3 11.9 L19.5 11.6 L21 12.6 L21.3 13.3 L25 13.3 L25 16 Z",
    windows: ["M9.3 13 L9.9 10.2 L10.6 10.3 L10.1 13 Z"],
    wheels: [8, 21],
  },
  motorcycle: {
    body: "M9 15.5 L11 10.5 L15 10.5 L16.5 8 L20 8 L20.5 9.5 L18.5 9.5 L17.5 12 L20.5 15.5 Z",
    windows: [],
    wheels: [9, 19],
  },
  // compact rounded micro-car -- distinct short/round silhouette for the catch-all
  other: {
    body: "M4 16 L4 11.5 L5.5 9 L9 7 L16 7 L18.5 9.5 L21 9.7 Q23.5 10 23.5 12 L23.5 16 Z",
    windows: ["M7 11.8 L7.3 9.3 L10.5 8.2 L13 8.2 L13 11.8 Z", "M14.5 11.8 L14.5 8.2 L17 8.2 L19.5 10 L19.5 11.8 Z"],
    wheels: [8.5, 19],
  },
};

function VehicleIcon({ type, active }: { type: (typeof VEHICLE_TYPES)[number]; active: boolean }) {
  const tone = active ? "fill-highway" : "fill-slate";
  const { body, windows, wheels } = VEHICLE_ICONS[type];
  return (
    <svg viewBox="0 0 40 20" aria-hidden="true" className="h-6 w-10">
      <path d={body} className={tone} />
      {windows.map((w, i) => (
        <path key={i} d={w} className="fill-paper" />
      ))}
      {wheels.map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy="16.5" r="3.1" className={tone} />
          <circle cx={cx} cy="16.5" r="1.55" className="fill-paper" />
          <circle cx={cx} cy="16.5" r="0.5" className={tone} />
        </g>
      ))}
    </svg>
  );
}

// Chevron overlay for native <select> -- appearance-none strips the default
// arrow cross-browser, so this replaces it without giving up the native
// dropdown (keyboard nav, mobile wheel picker, screen readers all still work).
function SelectChevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 fill-none stroke-slate stroke-[1.75]"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Shared exclusive-choice / toggle control (Running, Transport type,
// Flexibility, Round trip): a tile with a check box, navy when selected.
function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`choice flex items-center gap-3 px-4 py-3 text-base font-semibold ${selected ? "choice-on" : ""}`}
    >
      <span
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors duration-150",
          selected ? "border-navy bg-navy" : "border-slate-light bg-card",
        ].join(" ")}
      >
        {selected && (
          <svg viewBox="0 0 16 16" className="h-3 w-3 fill-none stroke-paper stroke-[3]">
            <path d="M3 8l3.5 3.5L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

export default function QuoteForm() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [stepIndex, setStepIndex] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [vinDecodeStatus, setVinDecodeStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [entryMode, setEntryMode] = useState<"vin" | "manual">("manual");
  const [makeIsOther, setMakeIsOther] = useState(false);
  const [estimate, setEstimate] = useState<{ lowCents: number; highCents: number } | null>(null);
  const [estimateStatus, setEstimateStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [roundTripPromptOpen, setRoundTripPromptOpen] = useState(false);
  const [roundTripEstimate, setRoundTripEstimate] = useState<{ lowCents: number; highCents: number } | null>(null);
  const roundTripAsked = useRef(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Landing here from a homepage service card (?service=carrier|personal_driver)
  // pre-answers step 1 and drops the customer straight into step 2, as if
  // they'd already picked it.
  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get("service");
    if (service === "carrier" || service === "personal_driver") {
      setForm((prev) => ({ ...prev, serviceType: service }));
      setStepIndex(1);
    }
  }, []);

  // Each step can be taller or shorter than the last, and a customer who
  // scrolled down to reach the "Next" button would otherwise land mid-page
  // on the next step with no way to tell they're at its top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepIndex]);

  // Switching modes clears the fields the other mode owns, so stale data
  // from one path never silently rides along hidden in the other.
  function switchToManual() {
    setEntryMode("manual");
    setVinDecodeStatus("idle");
    setForm((prev) => ({ ...prev, vin: "" }));
  }

  function switchToVin() {
    setEntryMode("vin");
    setMakeIsOther(false);
    setForm((prev) => ({ ...prev, vehicleYear: "", vehicleMake: "", vehicleModel: "" }));
  }

  // Auto-fills Year/Make/Model from the VIN once it's 17 valid characters,
  // via NHTSA's free decode API (see app/api/vin-decode/route.ts). Only
  // fills fields that are still blank -- never overwrites something the
  // customer already typed themselves -- and everything stays editable
  // afterward, since VIN decode data occasionally has gaps or is wrong.
  useEffect(() => {
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(form.vin)) {
      setVinDecodeStatus("idle");
      return;
    }

    let cancelled = false;
    setVinDecodeStatus("loading");
    const timer = setTimeout(() => {
      fetch(`/api/vin-decode?vin=${encodeURIComponent(form.vin)}`)
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data: { year: string; make: string; model: string }) => {
          if (cancelled) return;
          setForm((prev) => ({
            ...prev,
            vehicleYear: prev.vehicleYear || data.year,
            vehicleMake: prev.vehicleMake || data.make,
            vehicleModel: prev.vehicleModel || data.model,
          }));
          setVinDecodeStatus("done");
        })
        .catch(() => {
          if (!cancelled) setVinDecodeStatus("error");
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.vin]);

  // Live, non-binding cost estimate shown once enough of the form is filled
  // in -- purely informational. It never touches toPayload() below, so it's
  // never part of what POST /api/quote receives; the only real, binding
  // price is still the one the owner sets by hand afterward.
  useEffect(() => {
    const zipsValid = /^\d{5}$/.test(form.pickupZip) && /^\d{5}$/.test(form.dropoffZip);
    const needsEnclosed = form.serviceType === "carrier";
    const ready =
      zipsValid &&
      (form.serviceType === "carrier" || form.serviceType === "personal_driver") &&
      !!form.vehicleType &&
      !!form.isRunning &&
      (!needsEnclosed || !!form.enclosed);

    if (!ready) {
      setEstimate(null);
      setEstimateStatus("idle");
      return;
    }

    let cancelled = false;
    setEstimateStatus("loading");
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        pickupZip: form.pickupZip,
        dropoffZip: form.dropoffZip,
        serviceType: form.serviceType,
        isRunning: form.isRunning,
        vehicleType: form.vehicleType,
        roundTrip: String(form.roundTrip),
      });
      if (form.enclosed) params.set("enclosed", form.enclosed);

      fetch(`/api/route-distance?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data: { estimateLowCents: number; estimateHighCents: number }) => {
          if (cancelled) return;
          setEstimate({ lowCents: data.estimateLowCents, highCents: data.estimateHighCents });
          setEstimateStatus("done");
        })
        .catch(() => {
          if (!cancelled) {
            setEstimate(null);
            setEstimateStatus("error");
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.pickupZip, form.dropoffZip, form.serviceType, form.enclosed, form.isRunning, form.vehicleType, form.roundTrip]);

  // The round-trip prompt asks the customer to add a round trip with no
  // sense of what that costs -- fetch the round-trip version of the same
  // estimate just for that dialog, so "Add round trip" shows the increase
  // instead of a blind guess.
  useEffect(() => {
    if (!roundTripPromptOpen) {
      setRoundTripEstimate(null);
      return;
    }
    const zipsValid = /^\d{5}$/.test(form.pickupZip) && /^\d{5}$/.test(form.dropoffZip);
    if (!zipsValid || !form.vehicleType || !form.isRunning) return;

    let cancelled = false;
    const params = new URLSearchParams({
      pickupZip: form.pickupZip,
      dropoffZip: form.dropoffZip,
      serviceType: form.serviceType,
      isRunning: form.isRunning,
      vehicleType: form.vehicleType,
      roundTrip: "true",
    });
    if (form.enclosed) params.set("enclosed", form.enclosed);

    fetch(`/api/route-distance?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { estimateLowCents: number; estimateHighCents: number }) => {
        if (!cancelled) setRoundTripEstimate({ lowCents: data.estimateLowCents, highCents: data.estimateHighCents });
      })
      .catch(() => {
        if (!cancelled) setRoundTripEstimate(null);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundTripPromptOpen]);

  function fieldsForStep(index: number): (keyof FormState)[] {
    switch (STEPS[index]) {
      case "Service":
        return ["serviceType"];
      case "Vehicle": {
        const vehicleFields: (keyof FormState)[] =
          entryMode === "vin"
            ? ["vin", "vehicleYear", "vehicleMake", "vehicleModel", "vehicleType"]
            : ["vehicleYear", "vehicleMake", "vehicleModel", "vehicleType"];
        return form.serviceType === "carrier"
          ? [...vehicleFields, "isRunning", "enclosed"]
          : [...vehicleFields, "isRunning"];
      }
      case "Route":
        return ["pickupZip", "dropoffZip"];
      case "Timing":
        return ["preferredPickupDate", "flexibilityWindow"];
      case "Contact":
        return ["contactName", "contactPhone", "contactEmail", "agreedToTerms"];
      default:
        return [];
    }
  }

  // Empty-string form fields need to become `undefined` before validation:
  // the schema's `enclosed` is `.optional()`, which only accepts `undefined`,
  // not "" -- and "" is exactly what an untouched (non-carrier) form has.
  function toPayload(f: FormState) {
    return {
      ...f,
      vehicleYear: f.vehicleYear || undefined,
      vehicleType: f.vehicleType || undefined,
      enclosed: f.serviceType === "carrier" ? f.enclosed || undefined : undefined,
    };
  }

  function validateStep(index: number): boolean {
    // Validate the whole form so cross-field rules (like enclosed being
    // required only for carrier) are honored.
    const result = quoteRequestSchema.safeParse(toPayload(form));

    if (result.success) {
      setFieldErrors({});
      return true;
    }

    const errorsByField: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0] as keyof FormState;
      if (!errorsByField[path]) errorsByField[path] = issue.message;
    }

    // Steps after the current one are still blank at this point in a normal
    // walk through the form -- that's expected, not an error to block on.
    // Only jump backward, for a field on an already-passed step that's now
    // invalid (e.g. switching service type after already passing Vehicle).
    const earlierErrorStepIndex = STEPS.findIndex(
      (_, i) => i < index && fieldsForStep(i).some((field) => errorsByField[field])
    );
    const targetIndex = earlierErrorStepIndex === -1 ? index : earlierErrorStepIndex;

    const relevant = fieldsForStep(targetIndex);
    const errors: Record<string, string> = {};
    for (const field of relevant) {
      if (errorsByField[field]) errors[field] = errorsByField[field];
    }
    setFieldErrors(errors);
    if (targetIndex !== index) setStepIndex(targetIndex);
    return Object.keys(errors).length === 0;
  }

  // Non-mutating check (unlike validateStep) so it's safe to call on every
  // render for disabling the Next/Submit button.
  function isStepValid(index: number): boolean {
    const result = quoteRequestSchema.safeParse(toPayload(form));
    if (result.success) return true;
    const relevant = fieldsForStep(index);
    return !result.error.issues.some((issue) => relevant.includes(issue.path[0] as keyof FormState));
  }

  function goNext() {
    if (!validateStep(stepIndex)) return;

    // Ask, once, if a one-way trip was really the intent -- easy to miss
    // since it defaults off. Never re-asks once answered either way.
    if (STEPS[stepIndex] === "Route" && !form.roundTrip && !roundTripAsked.current) {
      setRoundTripPromptOpen(true);
      return;
    }

    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function confirmOneWay() {
    roundTripAsked.current = true;
    setRoundTripPromptOpen(false);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function switchToRoundTrip() {
    roundTripAsked.current = true;
    setRoundTripPromptOpen(false);
    update("roundTrip", true);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setFieldErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit() {
    if (!validateStep(stepIndex)) return;

    setSubmitState("submitting");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form)),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setSubmitMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (submitState === "success") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border-2 border-navy bg-[#EEF2FB] p-8 text-center"
      >
        <p className="text-2xl font-extrabold text-navy">
          Request received
        </p>
        <p className="mt-3 text-ink/80">
          Check your email for a confirmation. We&apos;ll follow up by email with a
          priced quote.
        </p>
      </motion.div>
    );
  }

  const step = STEPS[stepIndex];

  return (
    <div>
      <RouteProgress steps={STEPS} currentIndex={stepIndex} />

      <div className="mt-8 space-y-5 sm:mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? {} : { opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
        {step === "Service" && (
          <fieldset>
            <legend className="sr-only">
              How should your car get there?
            </legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => update("serviceType", "carrier")}
                aria-pressed={form.serviceType === "carrier"}
                className={`choice p-5 sm:p-6 ${form.serviceType === "carrier" ? "choice-on" : ""}`}
              >
                <p className="text-xl font-extrabold text-ink">Carrier Transport</p>
                <p className="mt-1.5 text-slate">
                  Hauled by an insured carrier. No mileage added. 1-4 days.
                </p>
              </button>
              <button
                type="button"
                onClick={() => update("serviceType", "personal_driver")}
                aria-pressed={form.serviceType === "personal_driver"}
                className={`choice p-5 sm:p-6 ${form.serviceType === "personal_driver" ? "choice-on" : ""}`}
              >
                <p className="text-xl font-extrabold text-ink">Personal Driver</p>
                <p className="mt-1.5 text-slate">
                  A driver takes it directly. Faster, 24-30 hours. Adds mileage to the vehicle. Requires your own full coverage insurance.
                </p>
              </button>
            </div>
            {fieldErrors.serviceType && <p className="mt-2 text-sm text-danger">{fieldErrors.serviceType}</p>}
          </fieldset>
        )}

        {step === "Vehicle" && (
          <div className="space-y-5">
            {entryMode === "vin" ? (
              <div>
                <label htmlFor="vin" className="field-label">VIN</label>
                <input
                  id="vin"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  value={form.vin}
                  onChange={(e) => update("vin", e.target.value.toUpperCase())}
                  maxLength={17}
                  placeholder="17 characters"
                  className={`${inputClass(!!fieldErrors.vin)} font-mono uppercase`}
                />
                <p className="mt-2 text-sm text-slate">
                  On your registration, insurance card, or the dashboard on the driver&apos;s side.
                </p>
                <AnimatePresence mode="wait">
                  {vinDecodeStatus === "loading" && (
                    <motion.div
                      key="loading"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="mt-2 flex items-center gap-2"
                      aria-live="polite"
                    >
                      <span className="apple-spinner text-navy" aria-hidden="true" />
                      <p className="text-sm text-slate">Looking up your vehicle&hellip;</p>
                    </motion.div>
                  )}
                  {vinDecodeStatus === "done" && (
                    <motion.p
                      key="done"
                      initial={reduce ? false : { opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="mt-2 font-mono text-sm text-slate"
                      aria-live="polite"
                    >
                      {[form.vehicleYear, form.vehicleMake, form.vehicleModel].filter(Boolean).join(" ")}
                    </motion.p>
                  )}
                </AnimatePresence>
                {vinDecodeStatus === "error" && (
                  <p className="mt-1 text-xs text-danger">
                    Couldn&apos;t look that VIN up. You can try again, or enter the details manually below.
                  </p>
                )}
                {(fieldErrors.vin || fieldErrors.vehicleYear || fieldErrors.vehicleMake || fieldErrors.vehicleModel) && (
                  <p className="mt-1 text-sm text-danger">
                    {fieldErrors.vin ?? "We need a valid VIN, or you can enter the vehicle details manually."}
                  </p>
                )}
                <button
                  type="button"
                  onClick={switchToManual}
                  className="mt-3 text-sm font-semibold text-navy underline underline-offset-4"
                >
                  Don&apos;t have the VIN handy? Enter vehicle details manually
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-sm text-slate">
                  No VIN needed to get your quote — we&apos;ll just need it before your vehicle ships.
                </p>
                {/* Year always shows here. Type also lived in this same grid
                    pre-session -- restored desktop-only (sm+) below, since
                    <640px now uses the wheel picker further down instead. */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="max-w-xs sm:max-w-none">
                    <label htmlFor="vehicleYear" className="field-label">Year</label>
                    <div className="relative">
                      <select
                        id="vehicleYear"
                        value={form.vehicleYear}
                        onChange={(e) => update("vehicleYear", e.target.value)}
                        className={vehicleSelectClass(!!fieldErrors.vehicleYear)}
                      >
                        <option value="">Select year&hellip;</option>
                        {VEHICLE_YEARS.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                    {fieldErrors.vehicleYear && <p className="mt-1 text-sm text-danger">{fieldErrors.vehicleYear}</p>}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="vehicleMake" className="field-label">Make</label>
                    {makeIsOther ? (
                      <input
                        id="vehicleMake"
                        value={form.vehicleMake}
                        onChange={(e) => update("vehicleMake", e.target.value)}
                        placeholder="Type the make"
                        className={vehicleFieldClass(!!fieldErrors.vehicleMake)}
                      />
                    ) : (
                      <div className="relative">
                        <select
                          id="vehicleMake"
                          value={form.vehicleMake}
                          onChange={(e) => {
                            if (e.target.value === OTHER_MAKE) {
                              setMakeIsOther(true);
                              update("vehicleMake", "");
                            } else {
                              update("vehicleMake", e.target.value);
                            }
                          }}
                          className={vehicleSelectClass(!!fieldErrors.vehicleMake)}
                        >
                          <option value="">Select make&hellip;</option>
                          {COMMON_MAKES.map((make) => (
                            <option key={make} value={make}>{make}</option>
                          ))}
                          <option value={OTHER_MAKE}>Other&hellip;</option>
                        </select>
                        <SelectChevron />
                      </div>
                    )}
                    {fieldErrors.vehicleMake && <p className="mt-1 text-sm text-danger">{fieldErrors.vehicleMake}</p>}
                  </div>
                  <div>
                    <label htmlFor="vehicleModel" className="field-label">Model</label>
                    <input
                      id="vehicleModel"
                      value={form.vehicleModel}
                      onChange={(e) => update("vehicleModel", e.target.value)}
                      className={vehicleFieldClass(!!fieldErrors.vehicleModel)}
                    />
                    {fieldErrors.vehicleModel && <p className="mt-1 text-sm text-danger">{fieldErrors.vehicleModel}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={switchToVin}
                  className="mt-3 text-sm font-semibold text-navy underline underline-offset-4"
                >
                  Have the VIN? Enter it instead
                </button>
              </div>
            )}

            <div>
              <span className="field-label">Vehicle type</span>

              {/* Mobile (<640px): horizontal scroll-snap row, same icons/data as the grid below. */}
              <div
                role="radiogroup"
                aria-label="Vehicle type"
                className="mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto py-1 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {VEHICLE_TYPES.map((type) => {
                  const selected = form.vehicleType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={(e) => {
                        update("vehicleType", type);
                        e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                      }}
                      className={[
                        "choice flex w-[5rem] shrink-0 snap-center flex-col items-center gap-1 px-2 py-2.5",
                        selected ? "choice-on" : "",
                      ].join(" ")}
                    >
                      <VehicleIcon type={type} active={selected} />
                      <span
                        className={[
                          "w-full text-center text-xs font-semibold leading-tight [overflow-wrap:anywhere]",
                          selected ? "text-navy" : "text-ink",
                        ].join(" ")}
                      >
                        {VEHICLE_TYPE_LABELS[type]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* sm+: unchanged icon grid. */}
              <div className="hidden gap-3 sm:mt-2 sm:grid sm:grid-cols-3">
                {VEHICLE_TYPES.map((type) => {
                  const selected = form.vehicleType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("vehicleType", type)}
                      aria-pressed={selected}
                      className={[
                        "choice flex flex-col items-center gap-1 px-3 py-3",
                        selected ? "choice-on" : "",
                      ].join(" ")}
                    >
                      <VehicleIcon type={type} active={selected} />
                      <span
                        className={[
                          "text-sm font-semibold",
                          selected ? "text-navy" : "text-ink",
                        ].join(" ")}
                      >
                        {VEHICLE_TYPE_LABELS[type]}
                      </span>
                    </button>
                  );
                })}
              </div>
              {fieldErrors.vehicleType && <p className="mt-1 text-sm text-danger">{fieldErrors.vehicleType}</p>}
            </div>

            <div>
              <span className="field-label">Does it run and drive?</span>
              <div className="mt-2 flex flex-wrap gap-3">
                {(["running", "not_running"] as const).map((val) => (
                  <OptionButton key={val} selected={form.isRunning === val} onClick={() => update("isRunning", val)}>
                    {val === "running" ? "Running" : "Not running"}
                  </OptionButton>
                ))}
              </div>
              {fieldErrors.isRunning && <p className="mt-1 text-sm text-danger">{fieldErrors.isRunning}</p>}
            </div>

            {form.serviceType === "carrier" && (
              <div>
                <span className="field-label">Transport type</span>
                <div className="mt-2 flex flex-wrap gap-3">
                  {(["open", "enclosed"] as const).map((val) => (
                    <OptionButton key={val} selected={form.enclosed === val} onClick={() => update("enclosed", val)}>
                      <span className="capitalize">{val}</span>
                    </OptionButton>
                  ))}
                </div>
                {fieldErrors.enclosed && <p className="mt-1 text-sm text-danger">{fieldErrors.enclosed}</p>}
              </div>
            )}
          </div>
        )}

        {step === "Route" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pickupZip" className="field-label">Pickup ZIP code</label>
                <input
                  id="pickupZip"
                  inputMode="numeric"
                  value={form.pickupZip}
                  onChange={(e) => update("pickupZip", e.target.value)}
                  className={`${inputClass(!!fieldErrors.pickupZip)} font-mono`}
                />
                {fieldErrors.pickupZip && <p className="mt-1 text-sm text-danger">{fieldErrors.pickupZip}</p>}
              </div>
              <div>
                <label htmlFor="dropoffZip" className="field-label">Dropoff ZIP code</label>
                <input
                  id="dropoffZip"
                  inputMode="numeric"
                  value={form.dropoffZip}
                  onChange={(e) => update("dropoffZip", e.target.value)}
                  className={`${inputClass(!!fieldErrors.dropoffZip)} font-mono`}
                />
                {fieldErrors.dropoffZip && <p className="mt-1 text-sm text-danger">{fieldErrors.dropoffZip}</p>}
              </div>
            </div>

            <div>
              <OptionButton selected={form.roundTrip} onClick={() => update("roundTrip", !form.roundTrip)}>
                Round trip (we bring it back too)
              </OptionButton>
            </div>

            {estimateStatus === "loading" && (
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center gap-2 rounded-lg border border-line bg-paper p-4"
                aria-live="polite"
              >
                <span className="apple-spinner text-navy" aria-hidden="true" />
                <p className="text-sm text-slate">Estimating cost&hellip;</p>
              </motion.div>
            )}
            {estimateStatus === "done" && estimate && (
              <div className="rounded-lg border border-line bg-paper p-4 text-ink">
                <span className="font-mono text-lg font-semibold text-navy">
                  ${(estimate.lowCents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  {"-"}
                  ${(estimate.highCents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>{" "}
                estimated cost{form.roundTrip ? " for the round trip" : ""}. We&apos;ll email you your exact quote after you submit.
                {form.serviceType === "personal_driver" && (
                  <p className="mt-2 text-sm text-slate">Doesn&apos;t include gas or tolls.</p>
                )}
                <p className="mt-2 text-sm text-slate">
                  A quick note on pricing: Shorter travel distances don&apos;t always mean a lower
                  fare. Fixed operational costs still apply, which can make short trips a bit more
                  expensive relative to longer ones.
                </p>
              </div>
            )}
            {estimateStatus === "error" && (
              <p className="rounded-lg border border-danger/40 bg-danger/5 p-4 text-sm text-danger">
                Couldn&apos;t estimate a cost for those ZIP codes right now. Double-check
                they&apos;re valid, five-digit ZIPs -- you can still submit and we&apos;ll
                email you a priced quote either way.
              </p>
            )}
          </div>
        )}

        {step === "Timing" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="preferredPickupDate" className="field-label">Preferred pickup date</label>
              <DatePicker
                id="preferredPickupDate"
                value={form.preferredPickupDate}
                onChange={(v) => update("preferredPickupDate", v)}
                hasError={!!fieldErrors.preferredPickupDate}
              />
              {fieldErrors.preferredPickupDate && (
                <p className="mt-1 text-sm text-danger">{fieldErrors.preferredPickupDate}</p>
              )}
            </div>
            <div>
              <span className="field-label">How flexible is that date?</span>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {(Object.keys(FLEXIBILITY_LABELS) as (keyof typeof FLEXIBILITY_LABELS)[]).map((key) => (
                  <OptionButton
                    key={key}
                    selected={form.flexibilityWindow === key}
                    onClick={() => update("flexibilityWindow", key)}
                  >
                    {FLEXIBILITY_LABELS[key]}
                  </OptionButton>
                ))}
              </div>
              {fieldErrors.flexibilityWindow && (
                <p className="mt-1 text-sm text-danger">{fieldErrors.flexibilityWindow}</p>
              )}
            </div>
          </div>
        )}

        {step === "Contact" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="contactName" className="field-label">Full name</label>
              <input
                id="contactName"
                autoComplete="name"
                enterKeyHint="next"
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
                className={inputClass(!!fieldErrors.contactName)}
              />
              {fieldErrors.contactName && <p className="mt-1 text-sm text-danger">{fieldErrors.contactName}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contactPhone" className="field-label">Phone</label>
                <input
                  id="contactPhone"
                  type="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  value={form.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  className={inputClass(!!fieldErrors.contactPhone)}
                />
                {fieldErrors.contactPhone && <p className="mt-1 text-sm text-danger">{fieldErrors.contactPhone}</p>}
              </div>
              <div>
                <label htmlFor="contactEmail" className="field-label">Email (your quote is sent here)</label>
                <input
                  id="contactEmail"
                  type="email"
                  autoComplete="email"
                  enterKeyHint="done"
                  value={form.contactEmail}
                  onChange={(e) => update("contactEmail", e.target.value)}
                  className={inputClass(!!fieldErrors.contactEmail)}
                />
                {fieldErrors.contactEmail && <p className="mt-1 text-sm text-danger">{fieldErrors.contactEmail}</p>}
              </div>
            </div>
            <div>
              <label className="flex items-start gap-3 text-ink">
                <input
                  type="checkbox"
                  checked={form.agreedToTerms}
                  onChange={(e) => update("agreedToTerms", e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-navy"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="font-semibold underline underline-offset-4 hover:text-amber-ink">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" target="_blank" className="font-semibold underline underline-offset-4 hover:text-amber-ink">Privacy Policy</Link>.
                </span>
              </label>
              {fieldErrors.agreedToTerms && <p className="mt-1 text-sm text-danger">{fieldErrors.agreedToTerms}</p>}
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>

        {submitState === "error" && (
          <p role="alert" className="rounded-lg border border-danger bg-danger/10 p-4 text-sm text-danger">{submitMessage}</p>
        )}

        <div className="flex items-center justify-between gap-4 pt-4">
          {stepIndex > 0 ? (
            <button type="button" onClick={goBack} className="btn-outline px-6">
              Back
            </button>
          ) : (
            <span />
          )}

          {stepIndex < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!isStepValid(stepIndex)}
              className="btn-amber px-8 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitState === "submitting" || !isStepValid(stepIndex)}
              className="btn-amber px-8 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitState === "submitting" ? "Submitting\u2026" : "Submit request"}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {roundTripPromptOpen && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 p-4"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="round-trip-prompt-heading"
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-sm rounded-2xl border border-line bg-card p-6 shadow-panel-lg"
            >
              <p id="round-trip-prompt-heading" className="text-xl font-extrabold text-ink">
                Just the one-way trip?
              </p>
              <p className="mt-2 text-slate">
                We&apos;ll quote pickup to dropoff only. Say the word if you also need it brought back.
              </p>
              {estimate && roundTripEstimate && (
                <p className="mt-4 rounded-lg border border-line bg-paper p-3 text-ink">
                  Round trip runs about{" "}
                  <span className="font-mono font-semibold text-navy">
                    ${(roundTripEstimate.lowCents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    –$
                    {(roundTripEstimate.highCents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>{" "}
                  total.
                </p>
              )}
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={confirmOneWay}
                  className="btn-outline px-4 py-2.5 text-sm"
                >
                  One-way is right
                </button>
                <button
                  type="button"
                  onClick={switchToRoundTrip}
                  className="btn-amber px-4 py-2.5 text-sm"
                >
                  Add round trip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
