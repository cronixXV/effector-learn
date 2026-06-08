import type { TCartItem } from "./cart";

export type TOrderForm = {
  name: string;
  phone: string;
  address: string;
};

export type TOrder = TOrderForm & {
  items: TCartItem[];
};
