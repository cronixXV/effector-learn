import { useUnit } from "effector-react";
import {
  $counter,
  $counterLabel,
  $isNegative,
  decrementClicked,
  incrementByAmountClicked,
  incrementClicked,
  resetClicked,
} from "./model";

//Компонент читает store, показывает значение, вызывает events
export const Counter = () => {
  const {
    counter,
    increment,
    decrement,
    incrementByAmount,
    isNegative,
    counterLabel,
    reset,
  } = useUnit({
    counter: $counter,
    increment: incrementClicked,
    decrement: decrementClicked,
    incrementByAmount: incrementByAmountClicked,
    isNegative: $isNegative,
    counterLabel: $counterLabel,
    reset: resetClicked,
  });

  return (
    <section>
      <h2>Counter</h2>

      <div>
        <button type="button" onClick={decrement}>
          -
        </button>

        <span>{counter}</span>

        <button type="button" onClick={increment}>
          +
        </button>
      </div>

      <button type="button" onClick={() => incrementByAmount(5)}>
        +5
      </button>

      <button type="button" onClick={reset}>
        Reset
      </button>

      {isNegative && <p>Counter is negative</p>}

      <p>Status: {counterLabel}</p>
    </section>
  );
};
