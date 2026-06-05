import { useUnit } from "effector-react";
import {
  $cart,
  $isCartEmpty,
  $totalCount,
  cartCleared,
  productQuantityChanged,
  productRemovedFromCart,
} from "./model";

export const Cart = () => {
  const {
    cart,
    isCartEmpty,
    totalCount,
    removeProduct,
    clearCart,
    changeQuantity,
  } = useUnit({
    cart: $cart,
    isCartEmpty: $isCartEmpty,
    totalCount: $totalCount,
    removeProduct: productRemovedFromCart,
    clearCart: cartCleared,
    changeQuantity: productQuantityChanged,
  });
  return (
    <section>
      <h2>Cart</h2>

      {isCartEmpty ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.productId}>
                <span>Product ID: {item.productId}</span>

                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    changeQuantity({
                      productId: item.productId,
                      quantity: Number(event.currentTarget.value),
                    })
                  }
                />

                <button onClick={() => removeProduct(item.productId)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <p>Total items: {totalCount}</p>

          <button onClick={clearCart}>Clear cart</button>
        </>
      )}
    </section>
  );
};
