import { combine, createEvent, createStore } from "effector";
import { $cart, $isCartEmpty } from "../cart/model";

export const nameChanged = createEvent<string>();
export const phoneChanged = createEvent<string>();
export const addressChanged = createEvent<string>();
export const orderSubmitted = createEvent();

// $name, $phone, $address — это обычные stores для полей формы.
export const $name = createStore("").on(nameChanged, (_, name) => name);
export const $phone = createStore("").on(phoneChanged, (_, phone) => phone);
export const $address = createStore("").on(
  addressChanged,
  (_, address) => address
);

// derived store, он автоматически собирает объект с полями формы
export const $orderForm = combine({
  name: $name,
  phone: $phone,
  address: $address,
});

// $isOrderFormValid тоже derived store. Он пересчитывается каждый раз, когда меняется любое поле формы.
export const $isOrderFormValid = combine(
  $orderForm,
  ({ name, phone, address }) => {
    return (
      name.trim().length > 1 &&
      phone.trim().length >= 6 &&
      address.trim().length > 5
    );
  }
);

// $canSubmitOrder зависит уже от двух вещей: форма валидна, корзина не пустая
export const $canSubmitOrder = combine(
  {
    isFormValid: $isOrderFormValid,
    cart: $cart,
  },
  ({ isFormValid, cart }) => isFormValid && cart.length > 0
);

export const $orderFormError = combine(
  {
    isFormValid: $isOrderFormValid,
    isCartEmpty: $isCartEmpty,
  },
  ({ isFormValid, isCartEmpty }) => {
    if (isCartEmpty) {
      return "Add at least one product to cart.";
    }

    if (!isFormValid) {
      return "Fill in name, phone and address.";
    }

    return null;
  }
);
