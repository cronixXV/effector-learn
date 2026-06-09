import { useUnit } from "effector-react";
import { $cartProductIds } from "./view-model";
import { CartItem } from "./cart-item";

export function CartList() {
  const productIds = useUnit($cartProductIds);

  return (
    <ul>
      {productIds.map((productId) => (
        <CartItem key={productId} productId={productId} />
      ))}
    </ul>
  );
}
