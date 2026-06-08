import { useUnit } from "effector-react";
import {
  $address,
  $canSubmitOrder,
  $name,
  $orderFormError,
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
    orderFormError,
    changeName,
    changePhone,
    changeAddress,
    submitOrder,
  } = useUnit({
    name: $name,
    phone: $phone,
    address: $address,
    canSubmitOrder: $canSubmitOrder,
    orderFormError: $orderFormError,
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
          />
        </label>

        <label>
          Phone:
          <input
            value={phone}
            onChange={(event) => changePhone(event.currentTarget.value)}
          />
        </label>

        <label>
          Address:
          <textarea
            value={address}
            onChange={(event) => changeAddress(event.currentTarget.value)}
          />
        </label>

        {orderFormError && <p>{orderFormError}</p>}

        <button type="submit" disabled={!canSubmitOrder}>
          Submit order
        </button>
      </form>
    </section>
  );
};
