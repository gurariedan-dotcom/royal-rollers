// Marketing copy shared by the homepage sections and their standalone
// pages (/services, /how-it-works, /faq). Edit here, not in the pages.
import { DEPOSIT_DISPLAY } from "@/lib/deposit";

export type FaqItem = { q: string; a: string };

// Original site answers (restored 2026-11-15), plus the old homepage
// "Quick answers". The first five are what the homepage shows.
export const FAQS: FaqItem[] = [
  {
    q: "What's the difference between Carrier Transport and Personal Driver?",
    a: "Carrier Transport means your vehicle rides on an insured, licensed carrier's hauler, no mileage added, typically 1-4 days. Personal Driver means a driver takes your car directly, point to point, typically 24-30 hours, more precise timing, but mileage is added to the vehicle.",
  },
  {
    q: "Do I have to pay anything upfront?",
    a: "No. You submit your route and vehicle details, and we email you a real, priced quote first. Payment only happens if and when you decide to book.",
  },
  {
    q: "How much will it cost?",
    a: "Your instant estimated price appears as you fill in your details. Once reviewed, a member of our team will contact you with your finalized, official quote, free of charge.",
  },
  {
    q: "Is my vehicle insured during transport?",
    a: "Yes. Carrier Transport is covered by our carrier's cargo insurance the whole way. Personal Driver relies on your own full coverage insurance (comprehensive and collision) being active during the drive -- standard protection most vehicles already have.",
  },
  {
    q: "Can you ship a non-running vehicle?",
    a: "Yes. Just mark it as not running when you request your quote, so the right equipment and carrier get assigned.",
  },
  {
    q: "Why do you need my VIN?",
    a: "It's not just for the quote -- the VIN is required information to actually ship your car, since it's what identifies your exact vehicle to the carrier on the industry load board. We collect it upfront so it's already on file, and nothing has to be re-collected later by phone.",
  },
  {
    q: "How will I get my quote?",
    a: "We'll email you a priced quote directly. No phone tag, no callback promise.",
  },
  {
    q: "How does payment work?",
    a: `You pay a ${DEPOSIT_DISPLAY} deposit and securely save a card on file when you book. The remaining balance is charged automatically to that card once your vehicle is delivered, you won't need to do anything at drop-off. You'll explicitly confirm you understand and agree to this at booking.`,
  },
  {
    q: "Is enclosed transport available?",
    a: "Yes, for Carrier Transport. Let us know when requesting your quote and we'll price it accordingly. Enclosed transport isn't applicable to Personal Driver, since there's no hauler involved.",
  },
  {
    q: "Does Personal Driver really add mileage to my car?",
    a: "Yes, since a person is driving your car to its destination rather than hauling it, mileage is added in transit. We'd rather you know that going in than be surprised by it.",
  },
  {
    q: "Do you service my area, or is there a service area limit?",
    a: "No. Royal Rollers arranges transport anywhere in the country, so wherever your car is coming from and wherever it's headed, we can quote the route.",
  },
  {
    q: "Do you ship internationally or only within the U.S.?",
    a: "We service both the United States and Canada.",
  },
  {
    q: "Can I ship a car I just bought at auction or from a dealer?",
    a: "Yes. Just have your auction or dealer paperwork on hand (bill of sale, release authorization) and let us know the pickup location when you request your quote, so we can coordinate directly with the seller.",
  },
  {
    q: "What happens if my car is damaged during transport?",
    a: "For Carrier Transport, your vehicle is covered by the carrier's cargo insurance the entire trip. For Personal Driver, coverage relies on your own active insurance (comprehensive and collision) being in place -- standard protection most vehicles already have. Either way, we'll walk you through next steps if anything ever comes up.",
  },
  {
    q: "Do I need to be present at pickup and delivery?",
    a: "You, or someone you designate, needs to be there for both pickup and delivery to hand off keys and do a quick inspection with the driver.",
  },
  {
    q: "Can I ship personal items inside the vehicle?",
    a: "A small amount of personal items in the trunk is generally fine, but they aren't covered by transport insurance and travel at your own risk -- so keep it light and skip anything valuable or fragile.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking 1-2 weeks ahead of your preferred pickup window to help guarantee availability.",
  },
  {
    q: "What if my vehicle isn't ready on the scheduled pickup day?",
    a: "Just let us know as soon as possible and we'll get you rescheduled. A small rescheduling fee applies to cover the adjustment.",
  },
  {
    q: "What's your cancellation policy?",
    a: `Cancellations are fully refundable, with the exception of your ${DEPOSIT_DISPLAY} deposit, which is non-refundable.`,
  },
];

export type ComparisonRow = { label: string; carrier: string; driver: string };

// Turnaround numbers (1-4 days / 24-30 hours) come from the owner's
// operating experience -- check with him before changing them.
export const COMPARISON: ComparisonRow[] = [
  {
    label: "Insurance",
    carrier: "Fully insured for collision and damage under the carrier's insurance",
    driver: "Covered by your car's personal insurance (full coverage required)",
  },
  {
    label: "Mileage added",
    carrier: "None, it rides on the hauler",
    driver: "Some, it is driven point to point",
  },
  {
    label: "Fees",
    carrier: "No hidden fees",
    driver: "Sometimes cheaper, especially short-notice single-car jobs",
  },
  { label: "Typical turnaround", carrier: "1-4 days", driver: "24-30 hours" },
  {
    label: "Timing",
    carrier: "Standard carrier routing",
    driver: "More precise pickup and dropoff",
  },
  {
    label: "Best for",
    carrier: "Long distance, multi-vehicle, high-value or enclosed",
    driver: "Tight timelines, direct control, fast single-car moves",
  },
];

export const STEPS = [
  {
    title: "Request a quote",
    body: "Share your VIN, year, make and model, pickup and dropoff ZIPs and preferred date. It takes a few minutes.",
  },
  {
    title: "Get a priced quote by email",
    body: "We email you a real number based on your route and vehicle.",
  },
  {
    title: "Book with a deposit",
    body: "Pay a deposit and securely save a card. You confirm you understand the balance is charged automatically on delivery.",
  },
  {
    title: "We arrange the move",
    body: "Carrier: your load is posted to a licensed, insured carrier. Personal driver: a driver is scheduled to take your car directly.",
  },
  {
    title: "Balance charged on delivery",
    body: "When your vehicle arrives, the remaining balance goes to the card on file. No extra step for you.",
  },
];

export const CONTACT = {
  phoneDisplay: "(646) 589-2334",
  phoneHref: "tel:+16465892334",
  email: "support@royal-rollers.com",
};

export const TAGLINE = "Nationwide vehicle transport, by carrier or by a personal driver, your call.";

export const COMPANY_LINE =
  "Royal Rollers LLC · 393 Beach 12th Street, Far Rockaway, NY 11691 · USDOT# 6895738 · MC# 73292138";
