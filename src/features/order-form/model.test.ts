import { allSettled, fork } from "effector";
import { describe, expect, it, vi } from "vitest";
import { productAddedToCart } from "../cart/model";
import {
  $canSubmitOrder,
  $isOrderFormValid,
  $orderForm,
  addressChanged,
  nameChanged,
  orderSubmitted,
  phoneChanged,
  submitOrderFx,
} from "./model";
import type { TCreatedOrder, TOrder } from "../../shared/types/order";

describe("order form model", () => {
  it("has empty form by default", () => {
    const scope = fork();

    expect(scope.getState($orderForm)).toEqual({
      name: "",
      phone: "",
      address: "",
    });
  });

  it("is invalid by default", () => {
    const scope = fork();

    expect(scope.getState($isOrderFormValid)).toBe(false);
  });

  it("becomes valid after filling fields", async () => {
    const scope = fork();

    await allSettled(nameChanged, {
      scope,
      params: "Egor",
    });

    await allSettled(phoneChanged, {
      scope,
      params: "123456",
    });

    await allSettled(addressChanged, {
      scope,
      params: "Main street 1",
    });

    expect(scope.getState($isOrderFormValid)).toBe(true);
  });

  it("cannot submit when cart is empty", async () => {
    const scope = fork();

    await allSettled(nameChanged, {
      scope,
      params: "Egor",
    });

    await allSettled(phoneChanged, {
      scope,
      params: "123456",
    });

    await allSettled(addressChanged, {
      scope,
      params: "Main street 1",
    });

    expect(scope.getState($canSubmitOrder)).toBe(false);
  });

  it("can submit when form is valid and cart is not empty", async () => {
    const scope = fork();

    // Вызываем событие из другой модели, но в том же scope
    // $canSubmitOrder зависит от $isCartEmpty, а $isCartEmpty зависит от $cart.
    // Поэтому, чтобы проверить форму с непустой корзиной,
    // мы должны добавить товар в корзину внутри того же scope
    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    await allSettled(nameChanged, {
      scope,
      params: "Egor",
    });

    await allSettled(phoneChanged, {
      scope,
      params: "123456",
    });

    await allSettled(addressChanged, {
      scope,
      params: "Main street 1",
    });

    expect(scope.getState($canSubmitOrder)).toBe(true);
  });
});

it("submits order when form is valid and cart is not empty", async () => {
  const submitOrderMock = vi.fn(
    async (order: TOrder): Promise<TCreatedOrder> => {
      return {
        id: "order-1",
        ...order,
      };
    }
  );

  const scope = fork({
    handlers: [[submitOrderFx, submitOrderMock]],
  });

  // Официальная документация описывает allSettled(unit, { scope, params })
  // как вызов unit внутри указанного scope с ожиданием завершения запущенных эффектов.
  await allSettled(productAddedToCart, {
    scope,
    params: "keyboard",
  });

  await allSettled(nameChanged, {
    scope,
    params: "Egor",
  });

  await allSettled(phoneChanged, {
    scope,
    params: "123456",
  });

  await allSettled(addressChanged, {
    scope,
    params: "Main street 1",
  });

  await allSettled(orderSubmitted, {
    scope,
  });

  expect(submitOrderMock).toHaveBeenCalledTimes(1);

  expect(submitOrderMock).toHaveBeenCalledWith({
    name: "Egor",
    phone: "123456",
    address: "Main street 1",
    items: [
      {
        productId: "keyboard",
        quantity: 1,
      },
    ],
  });
});

it("does not submit order when form is invalid", async () => {
  const submitOrderMock = vi.fn(
    async (order: TOrder): Promise<TCreatedOrder> => {
      return {
        id: "order-1",
        ...order,
      };
    }
  );

  const scope = fork({
    handlers: [[submitOrderFx, submitOrderMock]],
  });

  await allSettled(productAddedToCart, {
    scope,
    params: "keyboard",
  });

  await allSettled(orderSubmitted, {
    scope,
  });

  expect(submitOrderMock).not.toHaveBeenCalled();
});

it("does not submit order when cart is empty", async () => {
  const submitOrderMock = vi.fn(
    async (order: TOrder): Promise<TCreatedOrder> => {
      return {
        id: "order-1",
        ...order,
      };
    }
  );

  const scope = fork({
    handlers: [[submitOrderFx, submitOrderMock]],
  });

  await allSettled(nameChanged, {
    scope,
    params: "Egor",
  });

  await allSettled(phoneChanged, {
    scope,
    params: "123456",
  });

  await allSettled(addressChanged, {
    scope,
    params: "Main street 1",
  });

  await allSettled(orderSubmitted, {
    scope,
  });

  expect(submitOrderMock).not.toHaveBeenCalled();
});
