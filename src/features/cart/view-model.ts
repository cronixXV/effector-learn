import { combine } from "effector";
import type { TCartItem } from "../../shared/types/cart";
import type { TProduct } from "../../shared/types/product";
import { $cart } from "./model";
import { $products } from "../catalog/model";

export type TCartViewItem = TCartItem & {
  product: TProduct;
  total: number;
};

// derived store для UI
// берём productId из корзины
// ищем настоящий product в каталоге
// добавляем total
// получаем удобные данные для отображения
export const $cartView = combine(
  {
    cart: $cart,
    products: $products,
  },
  ({ cart, products }): TCartViewItem[] => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);

        if (!product) return null;
        return {
          ...item,
          product,
          total: product.price * item.quantity,
        };
      })
      .filter((item): item is TCartViewItem => item !== null);
  }
);

export const $totalPrice = $cartView.map((items) =>
  items.reduce((sum, item) => sum + item.total, 0)
);
