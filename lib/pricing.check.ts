import { strict as assert } from "node:assert";
import { computeEstimate, type EstimateInput } from "./pricing.ts";

const base: EstimateInput = { miles: 0, serviceType: "carrier", isRunning: "running", vehicleType: "sedan" };

// One-way 1200mi exactly: no discount (threshold is exclusive, ">" not ">=")
const atThreshold = computeEstimate({ ...base, miles: 1200 });
assert.strictEqual(atThreshold.lowCents, Math.round((1200 * 100 * 0.95) / 1000) * 1000);

// One-way 1201mi: 5% long-haul discount applies
const overThreshold = computeEstimate({ ...base, miles: 1201 });
const expectedMid = 1201 * 100 * 0.95;
assert.strictEqual(overThreshold.lowCents, Math.round((expectedMid - expectedMid * 0.05) / 1000) * 1000);

// Round trip of a 700mi (one-way) leg sums to 1400mi total but must NOT
// trigger the discount, since it checks one-way distance only.
const roundTripUnderOneWay = computeEstimate({ ...base, miles: 700, roundTrip: true });
const totalMiles = 700 * 2;
const midpointNoDiscount = totalMiles * 100;
assert.strictEqual(
  roundTripUnderOneWay.lowCents,
  Math.round((midpointNoDiscount - midpointNoDiscount * 0.05) / 1000) * 1000,
);

// Enclosed surcharge is 30%
const enclosed = computeEstimate({ ...base, miles: 100, enclosed: "enclosed" });
const midEnclosed = 100 * 100 * 1.3;
assert.strictEqual(enclosed.lowCents, Math.round((midEnclosed - midEnclosed * 0.05) / 1000) * 1000);

// Not-running flat add is $100 (10000 cents) per leg
const notRunning = computeEstimate({ ...base, miles: 100, isRunning: "not_running" });
const midNotRunning = 100 * 100 + 10000;
assert.strictEqual(notRunning.lowCents, Math.round((midNotRunning - midNotRunning * 0.05) / 1000) * 1000);

console.log("pricing.check.ts: all assertions passed");
