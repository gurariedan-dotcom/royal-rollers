"use client";

import { useEffect, useState } from "react";
import RouteProgress from "./RouteProgress";
import { quoteRequestSchema, FLEXIBILITY_LABELS } from "@/lib/validation";

const STEPS = ["Service", "Vehicle", "Route", "Timing", "Contact"];

type FormState = {
  serviceType: "carrier" | "personal_driver" | "";
  vin: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  isRunning: "running" | "not_running" | "";
  enclosed: "open" | "enclosed" | "";
  pickupZip: string;
  dropoffZip: string;
  preferredPickupDate: string;
  flexibilityWindow: keyof typeof FLEXIBILITY_LABELS | "";
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

const EMPTY_FORM: FormState = {
  serviceType: "",
  vin: "",
  vehicleYear: "",
  vehicleMake: "",
  vehicleModel: "",
  isRunning: "",
  enclosed: "",
  pickupZip: "",
  dropoffZip: "",
  preferredPickupDate: "",
  flexibilityWindow: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
};

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-sm border bg-paper px-3 py-2 text-ink placeholder:text-slate-light",
    "focus:outline-none",
    hasError ? "border-rust" : "border-slate-light/60",
  ].join(" ");
}

export default function QuoteForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [stepIndex, setStepIndex] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [vinDecodeStatus, setVinDecodeStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [estimate, setEstimate] = useState<{ lowCents: number; highCents: number } | null>(null);
  const [estimateStatus, setEstimateStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
  }, [form.pickupZip, form.dropoffZip, form.serviceType, form.enclosed, form.isRunning]);

  function fieldsForStep(index: number): (keyof FormState)[] {
    switch (STEPS[index]) {
      case "Service":
        return ["serviceType"];
      case "Vehicle":
        return form.serviceType === "carrier"
          ? ["vin", "vehicleYear", "vehicleMake", "vehicleModel", "isRunning", "enclosed"]
          : ["vin", "vehicleYear", "vehicleMake", "vehicleModel", "isRunning"];
      case "Route":
        return ["pickupZip", "dropoffZip"];
      case "Timing":
        return ["preferredPickupDate", "flexibilityWindow"];
      case "Contact":
        return ["contactName", "contactPhone", "contactEmail"];
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

  function goNext() {
    if (!validateStep(stepIndex)) return;
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
      <div className="rounded-sm border border-highway bg-highway/10 p-8 text-center">
        <p className="font-display text-xl uppercase tracking-signage text-highway">
          Request received
        </p>
        <p className="mt-3 text-ink/80">
          Check your email for a confirmation. We&apos;ll follow up by email with a
          priced quote.
        </p>
      </div>
    );
  }

  const step = STEPS[stepIndex];

  return (
    <div>
      <RouteProgress steps={STEPS} currentIndex={stepIndex} />

      <div className="mt-10 space-y-5">
        {step === "Service" && (
          <fieldset>
            <legend className="font-display text-lg uppercase tracking-wideish text-ink">
              How should your car get there?
            </legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => update("serviceType", "carrier")}
                className={[
                  "rounded-sm border-2 p-5 text-left transition-colors",
                  form.serviceType === "carrier" ? "border-highway bg-highway/10" : "border-slate-light/50",
                ].join(" ")}
              >
                <p className="font-display uppercase tracking-wideish text-highway">Carrier Transport</p>
                <p className="mt-2 text-sm text-ink/70">
                  Hauled by an insured carrier. No mileage added. 1&ndash;4 days.
                </p>
              </button>
              <button
                type="button"
                onClick={() => update("serviceType", "personal_driver")}
                className={[
                  "rounded-sm border-2 p-5 text-left transition-colors",
                  form.serviceType === "personal_driver" ? "border-rust bg-rust/10" : "border-slate-light/50",
                ].join(" ")}
              >
                <p className="font-display uppercase tracking-wideish text-rust">Personal Driver</p>
                <p className="mt-2 text-sm text-ink/70">
                  A driver takes it directly. Faster, 24&ndash;30 hours. Adds mileage to the vehicle.
                </p>
              </button>
            </div>
            {fieldErrors.serviceType && <p className="mt-2 text-sm text-rust">{fieldErrors.serviceType}</p>}
          </fieldset>
        )}

        {step === "Vehicle" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="vin" className="manifest-label">VIN</label>
              <input
                id="vin"
                value={form.vin}
                onChange={(e) => update("vin", e.target.value.toUpperCase())}
                maxLength={17}
                placeholder="17-character Vehicle ID Number"
                className={`${inputClass(!!fieldErrors.vin)} font-mono uppercase`}
              />
              <p className="mt-1 text-xs text-slate">
                On your registration, insurance card, or the dashboard on the driver&apos;s side.
              </p>
              {vinDecodeStatus === "loading" && (
                <p className="mt-1 text-xs text-slate">Looking up your vehicle&hellip;</p>
              )}
              {vinDecodeStatus === "done" && (
                <p className="mt-1 text-xs text-highway">
                  Filled in below from your VIN &mdash; double-check it and edit anything that&apos;s off.
                </p>
              )}
              {fieldErrors.vin && <p className="mt-1 text-sm text-rust">{fieldErrors.vin}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="vehicleYear" className="manifest-label">Year</label>
                <input
                  id="vehicleYear"
                  inputMode="numeric"
                  value={form.vehicleYear}
                  onChange={(e) => update("vehicleYear", e.target.value)}
                  className={inputClass(!!fieldErrors.vehicleYear)}
                />
                {fieldErrors.vehicleYear && <p className="mt-1 text-sm text-rust">{fieldErrors.vehicleYear}</p>}
              </div>
              <div>
                <label htmlFor="vehicleMake" className="manifest-label">Make</label>
                <input
                  id="vehicleMake"
                  value={form.vehicleMake}
                  onChange={(e) => update("vehicleMake", e.target.value)}
                  className={inputClass(!!fieldErrors.vehicleMake)}
                />
                {fieldErrors.vehicleMake && <p className="mt-1 text-sm text-rust">{fieldErrors.vehicleMake}</p>}
              </div>
              <div>
                <label htmlFor="vehicleModel" className="manifest-label">Model</label>
                <input
                  id="vehicleModel"
                  value={form.vehicleModel}
                  onChange={(e) => update("vehicleModel", e.target.value)}
                  className={inputClass(!!fieldErrors.vehicleModel)}
                />
                {fieldErrors.vehicleModel && <p className="mt-1 text-sm text-rust">{fieldErrors.vehicleModel}</p>}
              </div>
            </div>

            <div>
              <span className="manifest-label">Condition</span>
              <div className="mt-2 flex gap-4">
                {(["running", "not_running"] as const).map((val) => (
                  <label key={val} className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="radio"
                      name="isRunning"
                      checked={form.isRunning === val}
                      onChange={() => update("isRunning", val)}
                    />
                    {val === "running" ? "Running" : "Not running"}
                  </label>
                ))}
              </div>
              {fieldErrors.isRunning && <p className="mt-1 text-sm text-rust">{fieldErrors.isRunning}</p>}
            </div>

            {form.serviceType === "carrier" && (
              <div>
                <span className="manifest-label">Transport type</span>
                <div className="mt-2 flex gap-4">
                  {(["open", "enclosed"] as const).map((val) => (
                    <label key={val} className="flex items-center gap-2 text-sm text-ink capitalize">
                      <input
                        type="radio"
                        name="enclosed"
                        checked={form.enclosed === val}
                        onChange={() => update("enclosed", val)}
                      />
                      {val}
                    </label>
                  ))}
                </div>
                {fieldErrors.enclosed && <p className="mt-1 text-sm text-rust">{fieldErrors.enclosed}</p>}
              </div>
            )}
          </div>
        )}

        {step === "Route" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pickupZip" className="manifest-label">Pickup ZIP</label>
                <input
                  id="pickupZip"
                  inputMode="numeric"
                  value={form.pickupZip}
                  onChange={(e) => update("pickupZip", e.target.value)}
                  className={`${inputClass(!!fieldErrors.pickupZip)} font-mono`}
                />
                {fieldErrors.pickupZip && <p className="mt-1 text-sm text-rust">{fieldErrors.pickupZip}</p>}
              </div>
              <div>
                <label htmlFor="dropoffZip" className="manifest-label">Dropoff ZIP</label>
                <input
                  id="dropoffZip"
                  inputMode="numeric"
                  value={form.dropoffZip}
                  onChange={(e) => update("dropoffZip", e.target.value)}
                  className={`${inputClass(!!fieldErrors.dropoffZip)} font-mono`}
                />
                {fieldErrors.dropoffZip && <p className="mt-1 text-sm text-rust">{fieldErrors.dropoffZip}</p>}
              </div>
            </div>

            {estimateStatus === "loading" && (
              <p className="text-sm text-slate">Estimating cost&hellip;</p>
            )}
            {estimateStatus === "done" && estimate && (
              <div className="rounded-sm border border-brass/40 bg-brass/5 p-3 text-sm text-ink/80">
                <span className="font-mono text-ink">
                  ${(estimate.lowCents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  {"–"}
                  ${(estimate.highCents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>{" "}
                estimated &mdash; not a quote. Your real, priced quote will be emailed after you submit.
              </div>
            )}
          </div>
        )}

        {step === "Timing" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="preferredPickupDate" className="manifest-label">Preferred pickup date</label>
              <input
                id="preferredPickupDate"
                type="date"
                value={form.preferredPickupDate}
                onChange={(e) => update("preferredPickupDate", e.target.value)}
                className={inputClass(!!fieldErrors.preferredPickupDate)}
              />
              {fieldErrors.preferredPickupDate && (
                <p className="mt-1 text-sm text-rust">{fieldErrors.preferredPickupDate}</p>
              )}
            </div>
            <div>
              <span className="manifest-label">Flexibility</span>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(Object.keys(FLEXIBILITY_LABELS) as (keyof typeof FLEXIBILITY_LABELS)[]).map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="radio"
                      name="flexibilityWindow"
                      checked={form.flexibilityWindow === key}
                      onChange={() => update("flexibilityWindow", key)}
                    />
                    {FLEXIBILITY_LABELS[key]}
                  </label>
                ))}
              </div>
              {fieldErrors.flexibilityWindow && (
                <p className="mt-1 text-sm text-rust">{fieldErrors.flexibilityWindow}</p>
              )}
            </div>
          </div>
        )}

        {step === "Contact" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="contactName" className="manifest-label">Full name</label>
              <input
                id="contactName"
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
                className={inputClass(!!fieldErrors.contactName)}
              />
              {fieldErrors.contactName && <p className="mt-1 text-sm text-rust">{fieldErrors.contactName}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contactPhone" className="manifest-label">Phone</label>
                <input
                  id="contactPhone"
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  className={inputClass(!!fieldErrors.contactPhone)}
                />
                {fieldErrors.contactPhone && <p className="mt-1 text-sm text-rust">{fieldErrors.contactPhone}</p>}
              </div>
              <div>
                <label htmlFor="contactEmail" className="manifest-label">Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => update("contactEmail", e.target.value)}
                  className={inputClass(!!fieldErrors.contactEmail)}
                />
                {fieldErrors.contactEmail && <p className="mt-1 text-sm text-rust">{fieldErrors.contactEmail}</p>}
              </div>
            </div>
          </div>
        )}

        {submitState === "error" && (
          <p className="rounded-sm border border-rust bg-rust/10 p-3 text-sm text-rust">{submitMessage}</p>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="font-display text-sm uppercase tracking-wideish text-ink/60 disabled:opacity-0"
          >
            &larr; Back
          </button>

          {stepIndex < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-sm bg-brass px-6 py-2.5 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitState === "submitting"}
              className="rounded-sm bg-brass px-6 py-2.5 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark disabled:opacity-60"
            >
              {submitState === "submitting" ? "Submitting\u2026" : "Submit Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
