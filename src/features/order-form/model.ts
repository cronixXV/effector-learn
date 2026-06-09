import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { $cart, $isCartEmpty, cartCleared } from "../cart/model";
import type { TOrder } from "../../shared/types/order";
import { createOrder } from "../../shared/api/orders";

export const nameChanged = createEvent<string>();
export const phoneChanged = createEvent<string>();
export const addressChanged = createEvent<string>();
export const orderSubmitted = createEvent(); // попытка отправки
export const validOrderSubmitted = createEvent<TOrder>(); // подтверждённый валидный заказ
export const submitOrderFx = createEffect(createOrder); // заказ отправляется во внешний мир / mock API

// $name, $phone, $address — это обычные stores для полей формы.
export const $name = createStore("").on(nameChanged, (_, name) => name);
export const $phone = createStore("").on(phoneChanged, (_, phone) => phone);
export const $address = createStore("").on(
  addressChanged,
  (_, address) => address
);
export const $orderError = createStore<string | null>(null)
  // submitOrderFx.failData → effect завершился ошибкой → error.message попадает в $orderError
  .on(submitOrderFx.failData, (_, error) => error.message)
  // orderSubmitted → пользователь начал новую попытку → старая ошибка очищается
  .reset(orderSubmitted);

// derived store, он автоматически собирает объект с полями формы
export const $orderForm = combine({
  name: $name,
  phone: $phone,
  address: $address,
});

// $isOrderFormValid тоже derived store. Он пересчитывается каждый раз, когда меняется любое поле формы.
// один store → .map(), несколько stores → combine()
export const $isOrderFormValid = $orderForm.map(({ name, phone, address }) => {
  return (
    name.trim().length > 1 &&
    phone.trim().length >= 6 &&
    address.trim().length > 5
  );
});

// export const $isOrderFormValid = combine(
//   $orderForm,
//   ({ name, phone, address }) => {
//     return (
//       name.trim().length > 1 &&
//       phone.trim().length >= 6 &&
//       address.trim().length > 5
//     );
//   }
// );

// $canSubmitOrder зависит уже от двух вещей: форма валидна, корзина не пустая
export const $canSubmitOrder = combine(
  {
    isFormValid: $isOrderFormValid,
    isCartEmpty: $isCartEmpty,
    isOrderSubmitting: submitOrderFx.pending, // уже “началась асинхронная отправка заказа”
  },
  ({ isFormValid, isCartEmpty, isOrderSubmitting }) =>
    isFormValid && !isCartEmpty && !isOrderSubmitting
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

export const $isOrderSubmitting = submitOrderFx.pending;

export const $orderSuccess = createStore(false)
  .on(submitOrderFx.done, () => true)
  // новая попытка → success сбрасывается
  // ошибка → success тоже должен быть false
  .reset(orderSubmitted, submitOrderFx.fail);

// Метод sample это оператор для связи между юнитами,
// с его помощью можно вызывать события или эффекты,
// а также записывать в сторы новые значения.
sample({
  //clock отвечает на вопрос: Когда запускать цепочку?
  clock: orderSubmitted, // цепочка запускается, когда пользователь нажал submit

  // source отвечает на вопрос: Какие данные взять в этот момент?
  source: {
    form: $orderForm,
    cart: $cart,
    canSubmitOrder: $canSubmitOrder,
  },

  // filter отвечает на вопрос: Можно ли пропустить событие дальше?
  // Если: canSubmitOrder === false, то validOrderSubmitted не вызовется
  filter: ({ canSubmitOrder }) => canSubmitOrder,

  // fn отвечает на вопрос: Какой payload собрать для target?
  // Мы превращаем форму и корзину в объект заказа
  //{
  //name: "...",
  // phone: "...",
  // address: "...",
  // items: [...]
  // }
  fn: ({ form, cart }) => ({
    ...form,
    items: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  }),

  //target отвечает на вопрос: Куда отправить результат?
  target: validOrderSubmitted,
});

// Как читать этот sample
// Когда сработал orderSubmitted,
// возьми текущие form/cart/canSubmit,
// если canSubmit === true,
// собери payload заказа,
// передай его в validOrderSubmitted.

//В Effector правильнее описать связь декларативно:
// когда произошло orderSubmitted
// возьми данные из source
// проверь filter
// собери payload через fn
// отправь в target

// Именно это делает sample.

//Когда появился валидный заказ,
// передай его в асинхронный effect.
sample({
  clock: validOrderSubmitted,
  target: submitOrderFx,
});

// после успешной отправки очищаем корзину
sample({
  clock: submitOrderFx.done,
  target: cartCleared,
});

// validOrderSubmitted.watch((order) => {
//   console.log("Valid order submitted:", order);
// });
