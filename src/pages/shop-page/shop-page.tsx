import { useGate, useUnit } from "effector-react";
import { Cart } from "../../features/cart/ui";
import { Catalog } from "../../features/catalog/ui";
import { OrderForm } from "../../features/order-form/ui";
import { ShopPageGate } from "./model";

export function ShopPage() {
  useGate(ShopPageGate);

  const isShopPageOpened = useUnit(ShopPageGate.status);

  return (
    <main>
      <p>Shop page opened: {isShopPageOpened ? "yes" : "no"}</p>

      <Catalog />
      <Cart />
      <OrderForm />
    </main>
  );
}
