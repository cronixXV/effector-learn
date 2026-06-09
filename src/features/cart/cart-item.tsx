import { useStoreMap, useUnit } from "effector-react";
import { $cartView } from "./view-model";
import { productQuantityChanged, productRemovedFromCart } from "./model";

type CartItemProps = {
  productId: string;
};

export function CartItem({ productId }: CartItemProps) {
  const item = useStoreMap({
    // store — это большой store, из которого мы хотим взять не всё значение,
    // а только один конкретный элемент.
    // В нашем случае $cartView хранит весь список товаров в корзине:
    // [
    //   { productId: "keyboard", product: ..., quantity: 2, total: 160 },
    //   { productId: "mouse", product: ..., quantity: 1, total: 40 }
    // ]
    store: $cartView,

    // keys — это внешние параметры, от которых зависит выборка из store.
    // Здесь нам нужен productId из props компонента CartItem.
    // Если productId изменится, useStoreMap пересчитает selector.
    keys: [productId],

    // fn — это selector-функция.
    // Она получает:
    // 1. текущее значение store, то есть items из $cartView;
    // 2. keys, которые мы передали выше.
    // Задача fn — найти и вернуть только тот item,
    // который нужен этому конкретному CartItem-компоненту.
    fn: (items, [productId]) => {
      // Ищем в $cartView элемент корзины с нужным productId.
      // Если нашли — компонент получит конкретный товар корзины.
      // Если не нашли — вернём null.
      return items.find((item) => item.productId === productId) ?? null;
    },
  });

  const { removeProduct, changeQuantity } = useUnit({
    removeProduct: productRemovedFromCart,
    changeQuantity: productQuantityChanged,
  });

  if (!item) {
    return null;
  }

  return (
    <li>
      <article>
        <h3>{item.product.title}</h3>

        <p>Category: {item.product.category}</p>

        <p>Price: ${item.product.price}</p>

        <label>
          Quantity:
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(event) =>
              changeQuantity({
                productId: item.productId,
                quantity: event.currentTarget.valueAsNumber,
              })
            }
          />
        </label>

        <p>Subtotal: ${item.total}</p>

        <button onClick={() => removeProduct(item.productId)}>Remove</button>
      </article>
    </li>
  );
}
