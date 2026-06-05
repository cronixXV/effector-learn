import { createEvent, createStore } from "effector";

// Событие описывает факт: пользователь нажал на кнопку.То есть не “увеличь counter”, а именно: кликнули на increment
export const incrementClicked = createEvent();
export const decrementClicked = createEvent();
export const incrementByAmountClicked = createEvent<number>();
export const resetClicked = createEvent();

// Store хранит состояние, по соглашению stores часто называют с $ в начале.
export const $counter = createStore(0)
  //.on(...) Store реагирует на событие: когда случился incrementClicked, то пересчитай counter
  //reducer внутри .on(...) должен быть чистой функцией. То есть без fetch, localStorage, мутаций и случайных side effects.
  .on(incrementClicked, (counter) => counter + 1)
  .on(decrementClicked, (counter) => counter - 1)
  .on(incrementByAmountClicked, (counter, amount) => counter + amount)
  //Сброс store к начальному значению:
  .on(resetClicked, () => 0);

// Derived Store - это стор только для чтения, который создается из других сторов и автоматически обновляется при изменении исходных сторов
export const $isNegative = $counter.map((counter) => counter < 0);
export const $counterLabel = $counter.map((counter) => {
  if (counter > 0) return "Positive";
  if (counter < 0) return "Negative";
  return "Zero";
});
