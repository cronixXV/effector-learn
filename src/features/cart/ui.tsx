import { useUnit } from "effector-react";
import {
  $isCartEmpty,
  $totalCount,
  cartCleared,
  productQuantityChanged,
  productRemovedFromCart,
} from "./model";
import { $cartView, $totalPrice } from "./view-model";

export const Cart = () => {
  const {
    cartItems,
    isCartEmpty,
    totalCount,
    totalPrice,
    removeProduct,
    clearCart,
    changeQuantity,
  } = useUnit({
    cartItems: $cartView,
    isCartEmpty: $isCartEmpty,
    totalCount: $totalCount,
    totalPrice: $totalPrice,
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
            {cartItems.map((item) => (
              <li key={item.productId}>
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

                  <button onClick={() => removeProduct(item.productId)}>
                    Remove
                  </button>
                </article>
              </li>
            ))}
          </ul>

          <p>Total items: {totalCount}</p>
          <p>Total price: ${totalPrice}</p>

          <button onClick={() => clearCart()}>Clear cart</button>
        </>
      )}
    </section>
  );
};
