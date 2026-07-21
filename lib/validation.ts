import { z } from "zod";

// Mirrors the fields Central Dispatch requires when the owner posts a load,
// per the handoff doc (Section 4.2) -- the point is that this form should be
// operationally complete, not just marketing-complete.
export const quoteRequestSchema = z
  .object({
    serviceType: z.enum(["carrier", "personal_driver"], {
      required_error: "Choose Carrier Transport or Personal Driver.",
    }),
    vin: z
      .string()
      .trim()
      .length(17, "A VIN is 17 characters.")
      .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "That doesn't look like a valid VIN (VINs skip the letters I, O, and Q)."),
    vehicleYear: z.coerce
      .number()
      .int()
      .min(1980, "Year looks too old.")
      .max(new Date().getFullYear() + 1, "Year looks too far in the future."),
    vehicleMake: z.string().trim().min(1, "Make is required."),
    vehicleModel: z.string().trim().min(1, "Model is required."),
    isRunning: z.enum(["running", "not_running"]),
    // Only meaningful for carrier transport -- enforced below via superRefine,
    // not just hidden in the UI, so a direct API call can't skip the rule.
    enclosed: z.enum(["open", "enclosed"]).optional(),
    pickupZip: z.string().trim().regex(/^\d{5}$/, "Enter a 5-digit ZIP code."),
    dropoffZip: z.string().trim().regex(/^\d{5}$/, "Enter a 5-digit ZIP code."),
    preferredPickupDate: z.string().trim().min(1, "Pick a preferred date."),
    flexibilityWindow: z.enum(["exact", "plus_minus_2", "plus_minus_5", "flexible"]),
    contactName: z.string().trim().min(1, "Name is required."),
    contactPhone: z
      .string()
      .trim()
      .regex(/^[\d\s()+-]{7,20}$/, "Enter a valid phone number."),
    contactEmail: z.string().trim().email("Enter a valid email address."),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType === "carrier" && !data.enclosed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose open or enclosed transport.",
        path: ["enclosed"],
      });
    }
  });

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const FLEXIBILITY_LABELS: Record<QuoteRequestInput["flexibilityWindow"], string> = {
  exact: "Exact date only",
  plus_minus_2: "\u00B1 2 days",
  plus_minus_5: "\u00B1 5 days",
  flexible: "Flexible / no rush",
};
