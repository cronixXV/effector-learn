import { useUnit } from "effector-react";
import {
  $address,
  $canSubmitOrder,
  $isOrderSubmitting,
  $name,
  $orderFormError,
  $orderSuccess,
  $phone,
  addressChanged,
  nameChanged,
  orderSubmitted,
  phoneChanged,
} from "./model";

export const OrderForm = () => {
  const {
    name,
    phone,
    address,
    canSubmitOrder,
    isOrderSubmitting,
    orderFormError,
    orderSuccess,
    changeName,
    changePhone,
    changeAddress,
    submitOrder,
  } = useUnit({
    name: $name,
    phone: $phone,
    address: $address,
    canSubmitOrder: $canSubmitOrder,
    isOrderSubmitting: $isOrderSubmitting,
    orderFormError: $orderFormError,
    orderSuccess: $orderSuccess,
    changeName: nameChanged,
    changePhone: phoneChanged,
    changeAddress: addressChanged,
    submitOrder: orderSubmitted,
  });

  return (
    <section>
      <h2>Order form</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitOrder();
        }}
      >
        <label>
          Name:
          <input
            value={name}
            onChange={(event) => changeName(event.currentTarget.value)}
            disabled={isOrderSubmitting}
          />
        </label>

        <label>
          Phone:
          <input
            value={phone}
            onChange={(event) => changePhone(event.currentTarget.value)}
            disabled={isOrderSubmitting}
          />
        </label>

        <label>
          Address:
          <textarea
            value={address}
            onChange={(event) => changeAddress(event.currentTarget.value)}
            disabled={isOrderSubmitting}
          />
        </label>

        {orderFormError && <p>{orderFormError}</p>}

        {orderSuccess && <p>Order created successfully.</p>}

        <button type="submit" disabled={!canSubmitOrder}>
          {isOrderSubmitting ? "Submitting..." : "Submit order"}
        </button>
      </form>
    </section>
  );
};
