import { strict as assert } from "node:assert";
import { DEPOSIT_CENTS, DEPOSIT_DISPLAY, depositFor } from "./deposit.ts";

// Default is a flat $500 when DEPOSIT_CENTS is unset.
assert.strictEqual(DEPOSIT_CENTS, 50000);
assert.strictEqual(DEPOSIT_DISPLAY, "$500");

// Normal quote: flat deposit, rest is balance.
assert.strictEqual(depositFor(180000), 50000);

// Quote under the deposit: charge the quote, never more (balance is $0).
assert.strictEqual(depositFor(30000), 30000);

// Exactly the deposit: paid in full.
assert.strictEqual(depositFor(50000), 50000);

console.log("deposit checks passed");
