// Approximate driving miles between two points, shared by the instant
// estimate API (app/api/route-distance) and the static route pages
// (app/routes/[slug]) so both show the same number for the same ZIPs.
//
// Straight-line (great-circle) distance undercounts driving distance --
// roads aren't straight lines. 1.25x is a standard rough correction for US
// road networks. This feeds a non-binding estimate, not a precision tool.
const ROAD_DISTANCE_FACTOR = 1.25;
const EARTH_RADIUS_MILES = 3958.8;

export type LatLon = { lat: number; lon: number };

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function roadMiles(a: LatLon, b: LatLon): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * ROAD_DISTANCE_FACTOR;
}
