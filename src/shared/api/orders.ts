import type { TCreatedOrder, TOrder } from "../types/order";

export async function createOrder(order: TOrder): Promise<TCreatedOrder> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (order.name.trim().toLowerCase() === "error") {
    throw new Error("Failed to create order.");
  }

  return {
    id: crypto.randomUUID(),
    ...order,
  };
}
