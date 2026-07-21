import { NextRequest, NextResponse } from "next/server";

// Proxies NHTSA's free vPIC VIN-decode API (no key, no signup -- see
// https://vpic.nhtsa.dot.gov/api/) rather than calling it from the browser,
// so a flaky/slow third-party host can't leak into client code and errors
// can be normalized into just what the quote form needs.
export async function GET(req: NextRequest) {
  const vin = req.nextUrl.searchParams.get("vin") ?? "";
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return NextResponse.json({ error: "Invalid VIN." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`,
      { signal: AbortSignal.timeout(5000) }
    );
  } catch {
    return NextResponse.json({ error: "VIN decode service unavailable." }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: "VIN decode service unavailable." }, { status: 502 });
  }

  const data = await upstream.json();
  const result = data?.Results?.[0];

  // NHTSA returns a 200 with an empty-ish record for VINs it can't decode
  // (rather than an error status) -- treat missing core fields as a miss.
  if (!result?.Make || !result?.Model || !result?.ModelYear) {
    return NextResponse.json({ error: "Could not decode this VIN." }, { status: 422 });
  }

  return NextResponse.json({
    year: result.ModelYear,
    make: result.Make,
    model: result.Model,
  });
}
