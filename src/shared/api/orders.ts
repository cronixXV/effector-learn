import type { TCreatedOrder, TOrder } from "../types/order";

export async function createOrder(order: TOrder): Promise<TCreatedOrder> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    id: crypto.randomUUID(),
    ...order,
  };
}
