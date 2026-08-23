export const WHATSAPP_NUMBER = "918639876898"; // Official WhatsApp: +91 86398 76898
export const WHATSAPP_DISPLAY = "+91 86398 76898";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(
  orderId: string,
  items: { slug?: string; name: string; quantity: number; price: number; itemCode?: string; image?: string; baseSlug?: string }[],
  subtotal: number,
  customer?: { name?: string; phone?: string; address?: string; city?: string; pincode?: string; instruction?: string },
  discountInfo?: { code: string; amount: number; finalTotal: number }
) {
  let baseUrl = typeof window !== "undefined" ? window.location.origin : "https://lscollections.in";
  if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
    baseUrl = "https://lscollections.in";
  }

  const lines: string[] = [];
  lines.push("Hello, I want to purchase:");
  lines.push("");

  items.forEach((item) => {
    lines.push(`*${item.name}*`);
    const code = item.itemCode;
    if (code) {
      lines.push(`*Item Code:* ${code}`);
    }
    let priceText = `*Price:* ₹${(item.price * item.quantity).toLocaleString("en-IN")}`;
    if (item.quantity > 1) {
      priceText += ` (Qty: ${item.quantity})`;
    }
    lines.push(priceText);
    if (item.slug || item.baseSlug) {
      lines.push(`*URL:* ${baseUrl}/product/${item.baseSlug || item.slug}`);
    }
    lines.push("");
  });

  lines.push(`*Subtotal:* ₹${subtotal.toLocaleString("en-IN")}`);
  if (discountInfo) {
    lines.push(`*Discount (${discountInfo.code}):* -₹${discountInfo.amount.toLocaleString("en-IN")}`);
    lines.push(`*Final Total:* ₹${discountInfo.finalTotal.toLocaleString("en-IN")}`);
  } else {
    lines.push(`*Final Total:* ₹${subtotal.toLocaleString("en-IN")}`);
  }
  lines.push(`*Order ID:* ${orderId}`);
  lines.push("");

  lines.push("*My Details:*");
  lines.push(`Name: ${customer?.name || ""}`);
  lines.push(`Phone: ${customer?.phone || ""}`);
  const fullAddr = [customer?.address, customer?.city, customer?.pincode].filter(Boolean).join(", ");
  lines.push(`Address: ${fullAddr || ""}`);
  if (customer?.instruction) {
    lines.push(`Instruction: ${customer.instruction}`);
  }
  lines.push("");

  lines.push("Thank you!");
  return lines.join("\n");
}
