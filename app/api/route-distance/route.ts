import { NextRequest, NextResponse } from "next/server";
import { computeEstimate } from "@/lib/pricing";

const ZIP_REGEX = /^\d{5}$/;

// Straight-line (great-circle) distance tends to undercount actual driving
// distance -- roads aren't straight lines. This multiplier is a standard
// rough correction (commonly cited in the 1.2-1.3x range for US road
// networks) to turn "as the crow flies" into a closer approximation of
// "as you'd actually drive it." This is an estimate feeding a non-binding
// estimate, not a precision instrument.
const ROAD_DISTANCE_FACTOR = 1.25;
const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ZIP -> {lat, lon} via Zippopotam.us -- free, no signup, no API key.
async function geocodeZip(zip: string): Promise<{ lat: number; lon: number } | null> {
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
  return { lat: Number(place.latitude), lon: Number(place.longitude) };
}

// Turns two ZIPs into an approximate driving-mile figure (free, no signup --
// see geocodeZip above), then computes the non-binding on-screen estimate
// range server-side (see lib/pricing.ts) so the pricing constants never
// need to be exposed to the client. This route never touches the DB and
// never affects the real, manually-set quote price.
export async function GET(req: NextRequest) {
  const pickupZip = req.nextUrl.searchParams.get("pickupZip") ?? "";
  const dropoffZip = req.nextUrl.searchParams.get("dropoffZip") ?? "";
  const serviceType = req.nextUrl.searchParams.get("serviceType");
  const isRunning = req.nextUrl.searchParams.get("isRunning");
  const enclosed = req.nextUrl.searchParams.get("enclosed") ?? undefined;

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

  const [pickup, dropoff] = await Promise.all([geocodeZip(pickupZip), geocodeZip(dropoffZip)]);

  if (!pickup || !dropoff) {
    return NextResponse.json({ error: "Could not locate one of those ZIP codes." }, { status: 422 });
  }

  const miles = haversineMiles(pickup.lat, pickup.lon, dropoff.lat, dropoff.lon) * ROAD_DISTANCE_FACTOR;
  const { lowCents, highCents } = computeEstimate({
    miles,
    serviceType,
    enclosed: enclosed as "open" | "enclosed" | undefined,
    isRunning,
  });

  return NextResponse.json({
    miles: Math.round(miles),
    estimateLowCents: lowCents,
    estimateHighCents: highCents,
  });
}
