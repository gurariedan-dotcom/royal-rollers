import { NextRequest, NextResponse } from "next/server";
import { computeEstimate } from "@/lib/pricing";
import { VEHICLE_TYPES, toPricingVehicleType } from "@/lib/validation";
import { rateLimit } from "@/lib/http";
import { roadMiles } from "@/lib/distance";

const ZIP_REGEX = /^\d{5}$/;

// ZIP -> {lat, lon} via Zippopotam.us -- free, no signup, no API key.
async function geocodeZip(zip: string): Promise<{ lat: number; lon: number; place: string } | null> {
  let res: Response;
  try {
    res = await fetch(`http://api.zippopotam.us/us/${zip}`, { signal: AbortSignal.timeout(5000) });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const data = await res.json();
  const place = data?.places?.[0];
  if (!place?.latitude || !place?.longitude) return null;
  return {
    lat: Number(place.latitude),
    lon: Number(place.longitude),
    place: [place["place name"], place["state abbreviation"]].filter(Boolean).join(", "),
  };
}

// Turns two ZIPs into an approximate driving-mile figure (free, no signup --
// see geocodeZip above), then computes the non-binding on-screen estimate
// range server-side (see lib/pricing.ts) so the pricing constants never
// need to be exposed to the client. This route never touches the DB and
// never affects the real, manually-set quote price.
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, "route-distance", 30, 5 * 60_000);
  if (limited) return limited;

  const pickupZip = req.nextUrl.searchParams.get("pickupZip") ?? "";
  const dropoffZip = req.nextUrl.searchParams.get("dropoffZip") ?? "";
  const serviceType = req.nextUrl.searchParams.get("serviceType");
  const isRunning = req.nextUrl.searchParams.get("isRunning");
  const enclosed = req.nextUrl.searchParams.get("enclosed") ?? undefined;
  const roundTrip = req.nextUrl.searchParams.get("roundTrip") === "true";
  const vehicleType = req.nextUrl.searchParams.get("vehicleType");

  if (!ZIP_REGEX.test(pickupZip) || !ZIP_REGEX.test(dropoffZip)) {
    return NextResponse.json({ error: "Enter two valid 5-digit ZIP codes." }, { status: 400 });
  }
  if (serviceType !== "carrier" && serviceType !== "personal_driver") {
    return NextResponse.json({ error: "Missing or invalid serviceType." }, { status: 400 });
  }
  if (isRunning !== "running" && isRunning !== "not_running") {
    return NextResponse.json({ error: "Missing or invalid isRunning." }, { status: 400 });
  }
  if (enclosed !== undefined && enclosed !== "open" && enclosed !== "enclosed") {
    return NextResponse.json({ error: "Invalid enclosed value." }, { status: 400 });
  }
  if (!vehicleType || !(VEHICLE_TYPES as readonly string[]).includes(vehicleType)) {
    return NextResponse.json({ error: "Missing or invalid vehicleType." }, { status: 400 });
  }

  const [pickup, dropoff] = await Promise.all([geocodeZip(pickupZip), geocodeZip(dropoffZip)]);

  if (!pickup || !dropoff) {
    return NextResponse.json({ error: "Could not locate one of those ZIP codes." }, { status: 422 });
  }

  const miles = roadMiles(pickup, dropoff);
  const { lowCents, highCents } = computeEstimate({
    miles,
    serviceType,
    enclosed: enclosed as "open" | "enclosed" | undefined,
    isRunning,
    vehicleType: toPricingVehicleType(vehicleType as (typeof VEHICLE_TYPES)[number]),
    roundTrip,
  });

  return NextResponse.json({
    miles: Math.round(miles),
    // Display-only labels for the homepage estimate card, e.g. "New York, NY".
    pickupPlace: pickup.place,
    dropoffPlace: dropoff.place,
    estimateLowCents: lowCents,
    estimateHighCents: highCents,
  });
}
