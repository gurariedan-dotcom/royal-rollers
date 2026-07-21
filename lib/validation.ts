import { z } from "zod";

export const VEHICLE_TYPES = [
  "sedan",
  "suv",
  "truck",
  "van",
  "coupe",
  "wagon",
  "convertible",
  "motorcycle",
  "other",
] as const;

export const VEHICLE_TYPE_LABELS: Record<(typeof VEHICLE_TYPES)[number], string> = {
  sedan: "Sedan",
  suv: "SUV",
  truck: "Truck",
  van: "Van / Minivan",
  coupe: "Coupe",
  wagon: "Wagon",
  convertible: "Convertible",
  motorcycle: "Motorcycle",
  other: "Other",
};

// Mirrors the fields Central Dispatch requires when the owner posts a load,
// per the handoff doc (Section 4.2) -- the point is that this form should be
// operationally complete, not just marketing-complete.
//
// VIN is optional: customers who don't have it handy can enter vehicle info
// manually instead (year/make/model/type), and the owner confirms the VIN
// later when following up on the quote.
export const quoteRequestSchema = z
  .object({
    serviceType: z.enum(["carrier", "personal_driver"], {
      required_error: "Choose Carrier Transport or Personal Driver.",
    }),
    vin: z
      .string()
      .trim()
      .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "That doesn't look like a valid VIN (VINs skip the letters I, O, and Q).")
      .optional()
      .or(z.literal("")),
    vehicleYear: z.coerce
      .number()
      .int()
      .min(1980, "Year looks too old.")
      .max(new Date().getFullYear() + 1, "Year looks too far in the future."),
    vehicleMake: z.string().trim().min(1, "Make is required."),
    vehicleModel: z.string().trim().min(1, "Model is required."),
    vehicleType: z.enum(VEHICLE_TYPES).optional(),
    isRunning: z.enum(["running", "not_running"]),
    // Only meaningful for carrier transport -- enforced below via superRefine,
    // not just hidden in the UI, so a direct API call can't skip the rule.
    enclosed: z.enum(["open", "enclosed"]).optional(),
    pickupZip: z.string().trim().regex(/^\d{5}$/, "Enter a 5-digit ZIP code."),
    dropoffZip: z.string().trim().regex(/^\d{5}$/, "Enter a 5-digit ZIP code."),
    roundTrip: z.boolean().optional(),
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
