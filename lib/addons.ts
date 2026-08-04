// Add-ons & fees from the official ES World 2026 price lists (VAT-inclusive where applicable).
// These feed the Quotation Designer so a student quote can bundle course + housing + fees.

export type Addon = {
  id: string;
  label: string;
  price: number;
  unit: "one-off" | "per week" | "per level";
  currency: "USD" | "GBP";
  campus: "Dubai" | "London";
  group: "Accommodation" | "Meals" | "Transfer" | "Visa" | "Books" | "Fees" | "Insurance" | "Supplements";
};

export const ADDONS: Addon[] = [
  // ---------- DUBAI (USD) ----------
  { id: "dxb-reg", label: "Course Registration", price: 115, unit: "one-off", currency: "USD", campus: "Dubai", group: "Fees" },
  { id: "dxb-accbook", label: "Accommodation Booking", price: 110, unit: "one-off", currency: "USD", campus: "Dubai", group: "Fees" },
  { id: "dxb-bank", label: "Bank Transfer Charge", price: 50, unit: "one-off", currency: "USD", campus: "Dubai", group: "Fees" },
  { id: "dxb-ins", label: "Student Insurance (6mo/1yr visa)", price: 150, unit: "one-off", currency: "USD", campus: "Dubai", group: "Insurance" },
  { id: "dxb-book", label: "Course Book (per level)", price: 65, unit: "per level", currency: "USD", campus: "Dubai", group: "Books" },
  { id: "dxb-airport1", label: "Airport Transfer (one way)", price: 110, unit: "one-off", currency: "USD", campus: "Dubai", group: "Transfer" },
  { id: "dxb-airport2", label: "Airport Transfer (two ways)", price: 195, unit: "one-off", currency: "USD", campus: "Dubai", group: "Transfer" },
  { id: "dxb-visa-t30", label: "Tourist Visa (30 days)", price: 190, unit: "one-off", currency: "USD", campus: "Dubai", group: "Visa" },
  { id: "dxb-visa-t60", label: "Tourist Visa (60 days)", price: 245, unit: "one-off", currency: "USD", campus: "Dubai", group: "Visa" },
  { id: "dxb-visa-s180", label: "Student Visa (180 days)", price: 500, unit: "one-off", currency: "USD", campus: "Dubai", group: "Visa" },
  { id: "dxb-visa-6m", label: "Student Resident Visa (6 months)", price: 710, unit: "one-off", currency: "USD", campus: "Dubai", group: "Visa" },
  { id: "dxb-visa-1y", label: "Student Resident Visa (1 year)", price: 1365, unit: "one-off", currency: "USD", campus: "Dubai", group: "Visa" },
  { id: "dxb-acc-studio", label: "Studio, Premium Residence (single)", price: 545, unit: "per week", currency: "USD", campus: "Dubai", group: "Accommodation" },
  { id: "dxb-acc-studio-sh", label: "Studio, Premium Residence (shared)", price: 275, unit: "per week", currency: "USD", campus: "Dubai", group: "Accommodation" },
  { id: "dxb-acc-priv", label: "Private Apartment, 4★ hotel (single)", price: 530, unit: "per week", currency: "USD", campus: "Dubai", group: "Accommodation" },
  { id: "dxb-acc-shared", label: "Shared Apartment, 4★ hotel (single)", price: 480, unit: "per week", currency: "USD", campus: "Dubai", group: "Accommodation" },
  { id: "dxb-acc-shared-sh", label: "Shared Apartment, 4★ hotel (shared)", price: 240, unit: "per week", currency: "USD", campus: "Dubai", group: "Accommodation" },
  { id: "dxb-meal-bb", label: "Meal Plan — Breakfast (BB)", price: 85, unit: "per week", currency: "USD", campus: "Dubai", group: "Meals" },
  { id: "dxb-meal-hb", label: "Meal Plan — Half Board (HB)", price: 195, unit: "per week", currency: "USD", campus: "Dubai", group: "Meals" },

  // ---------- LONDON (GBP) ----------
  { id: "ldn-reg", label: "Course Registration", price: 50, unit: "one-off", currency: "GBP", campus: "London", group: "Fees" },
  { id: "ldn-accbook", label: "Accommodation Booking", price: 50, unit: "one-off", currency: "GBP", campus: "London", group: "Fees" },
  { id: "ldn-bank", label: "Bank Charges", price: 50, unit: "one-off", currency: "GBP", campus: "London", group: "Fees" },
  { id: "ldn-deposit", label: "Refundable Accommodation Deposit", price: 150, unit: "one-off", currency: "GBP", campus: "London", group: "Fees" },
  { id: "ldn-bedding", label: "Bedding & Kitchen Supplement", price: 50, unit: "one-off", currency: "GBP", campus: "London", group: "Fees" },
  { id: "ldn-book-ge", label: "General English Book (per level)", price: 45, unit: "per level", currency: "GBP", campus: "London", group: "Books" },
  { id: "ldn-book-ielts", label: "IELTS Book (per level)", price: 55, unit: "per level", currency: "GBP", campus: "London", group: "Books" },
  { id: "ldn-heathrow", label: "Airport Transfer — Heathrow (one way)", price: 155, unit: "one-off", currency: "GBP", campus: "London", group: "Transfer" },
  { id: "ldn-gatwick", label: "Airport Transfer — Gatwick (one way)", price: 165, unit: "one-off", currency: "GBP", campus: "London", group: "Transfer" },
  { id: "ldn-other-airport", label: "Airport Transfer — Luton/City/Stansted", price: 160, unit: "one-off", currency: "GBP", campus: "London", group: "Transfer" },
  { id: "ldn-acc-house-s", label: "Shared House — Single Room", price: 305, unit: "per week", currency: "GBP", campus: "London", group: "Accommodation" },
  { id: "ldn-acc-house-sh", label: "Shared House — Shared Room", price: 225, unit: "per week", currency: "GBP", campus: "London", group: "Accommodation" },
  { id: "ldn-acc-homestay", label: "Homestay — Single (Zone 3)", price: 275, unit: "per week", currency: "GBP", campus: "London", group: "Accommodation" },
  { id: "ldn-acc-res", label: "Student Residence — Single (Zone 3)", price: 355, unit: "per week", currency: "GBP", campus: "London", group: "Accommodation" },
  { id: "ldn-sup-summer", label: "Summer Supplement (Jun–Aug)", price: 25, unit: "per week", currency: "GBP", campus: "London", group: "Supplements" },
  { id: "ldn-sup-junior", label: "Junior Supplement (under 18)", price: 30, unit: "per week", currency: "GBP", campus: "London", group: "Supplements" },
  { id: "ldn-sup-hb", label: "Half Board", price: 50, unit: "per week", currency: "GBP", campus: "London", group: "Supplements" },
  { id: "ldn-sup-halal", label: "Halal Supplement", price: 60, unit: "per week", currency: "GBP", campus: "London", group: "Supplements" },
];

export function addonsByCurrency(currency: string) {
  return ADDONS.filter((a) => a.currency === currency);
}
