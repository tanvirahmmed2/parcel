export function calculateDeliveryCharge(district, weightStr) {
  let base = (district || "").toLowerCase().includes("dhaka") ? 60 : 120;
  let weight = Number(weightStr) || 1;
  let extra = weight > 1 ? (Math.ceil(weight) - 1) * 20 : 0;
  return base + extra;
}
