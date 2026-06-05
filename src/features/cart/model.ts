import { createEvent, createStore } from "effector";
import type { TCartItem } from "../../shared/types/cart";

// Событие говорит: пользователь добавил товар в корзину.
// Payload события — string.
// В нашем случае это productId.
export const productAddedToCart = createEvent<string>();

// Событие говорит: пользователь удалил товар из корзины.
// Payload тоже productId.
// По этому id мы поймём, какой товар нужно убрать.
export const productRemovedFromCart = createEvent<string>();

// Событие говорит: пользователь очистил всю корзину.
// Payload не нужен, потому что действие не зависит от конкретного товара.
export const cartCleared = createEvent();

// Событие говорит: пользователь изменил количество товара.
// Здесь payload уже не простой string, а объект.
// Нам нужно знать:
// - у какого товара меняется количество;
// - какое новое quantity поставить.
export const productQuantityChanged = createEvent<{
  productId: string;
  quantity: number;
}>();

// Главный store корзины.
// Он хранит массив CartItem.
// Каждый элемент массива — это товар в корзине:
// {
//   productId: "keyboard",
//   quantity: 2
// }
// Важно:
// store нельзя мутировать напрямую.
// Поэтому мы не делаем cart.push(...)
// и не меняем item.quantity = ...
// Вместо этого каждый handler возвращает новый массив.
export const $cart = createStore<TCartItem[]>([])
  // Обрабатываем событие "товар добавлен в корзину".
  // Первый аргумент handler — текущее состояние store.
  // Второй аргумент — payload события, то есть productId.
  .on(productAddedToCart, (cart, productId) => {
    // Проверяем, есть ли уже такой товар в корзине.
    const existingItem = cart.find((item) => item.productId === productId);

    // Если товар уже есть, не добавляем новую строку.
    // Вместо этого увеличиваем quantity у существующего товара.
    if (existingItem) {
      return cart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    }

    // Если товара ещё нет в корзине, добавляем новый элемент с quantity: 1.
    return [
      ...cart,
      {
        productId,
        quantity: 1,
      },
    ];
  })

  // Обрабатываем событие "товар удалён из корзины".
  // filter возвращает новый массив без товара, productId которого совпадает с payload события.
  .on(productRemovedFromCart, (cart, productId) =>
    cart.filter((item) => item.productId !== productId)
  )

  // Обрабатываем событие "количество товара изменилось".
  // Payload здесь объект:
  // {
  //   productId: "...",
  //   quantity: ...
  // }
  .on(productQuantityChanged, (cart, { productId, quantity }) => {
    // Защищаем модель от некорректного значения.
    // Даже если пользователь введёт 0 или отрицательное число,
    // в store попадёт минимум 1.
    // Важно:
    // эта проверка лежит в модели, а не в React,  потому что это бизнес-правило корзины.
    const safeQuantity = Math.max(1, quantity);

    return cart.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: safeQuantity,
          }
        : item
    );
  })

  // reset — удобный способ сбросить store к начальному значению.
  // Начальное значение $cart — [].
  // Поэтому при cartCleared корзина снова станет пустым массивом.
  .reset(cartCleared);

// Derived store.
// Он не хранится руками.
// Он автоматически пересчитывается каждый раз, когда меняется $cart.
// Здесь мы считаем общее количество товаров, учитывая quantity.
// Например:
// [
//   { productId: "keyboard", quantity: 2 },
//   { productId: "mouse", quantity: 1 }
// ]
// totalCount будет 3.
export const $totalCount = $cart.map((cart) =>
  cart.reduce((sum, item) => sum + item.quantity, 0)
);

// Ещё один derived store.
// Он отвечает на вопрос:
// "Корзина пустая или нет?"
// Это лучше держать в модели, чтобы React не писал cart.length === 0 прямо в JSX.
export const $isCartEmpty = $cart.map((cart) => cart.length === 0);
