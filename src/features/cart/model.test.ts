import { describe, expect, it } from "vitest";
import { allSettled, fork } from "effector";
import {
  $cart,
  $isCartEmpty,
  $totalCount,
  cartCleared,
  productAddedToCart,
  productQuantityChanged,
  productRemovedFromCart,
} from "./model";

describe("cart model", () => {
  it("adds product to cart", async () => {
    // fork() создаёт изолированный экземпляр модели.
    // Официально fork создаёт isolated scope, который удобно использовать для тестов, SSR и случаев,
    // когда нужна безопасная копия логики без изменения глобальных units.

    // у каждого теста своя отдельная корзина, если один тест добавил keyboard, другой тест этого не увидит
    const scope = fork();

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    expect(scope.getState($cart)).toEqual([
      {
        productId: "keyboard",
        quantity: 1,
      },
    ]);
  });

  it("increases quantity when same product is added twice", async () => {
    const scope = fork();

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    expect(scope.getState($cart)).toEqual([
      {
        productId: "keyboard",
        quantity: 2,
      },
    ]);
  });

  it("removes product from cart", async () => {
    const scope = fork();

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    await allSettled(productRemovedFromCart, {
      scope,
      params: "keyboard",
    });

    expect(scope.getState($cart)).toEqual([]);
  });

  it("changes product quantity", async () => {
    const scope = fork();

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    await allSettled(productQuantityChanged, {
      scope,
      params: {
        productId: "keyboard",
        quantity: 5,
      },
    });

    expect(scope.getState($cart)).toEqual([
      {
        productId: "keyboard",
        quantity: 5,
      },
    ]);
  });

  it("normalizes invalid quantity to 1", async () => {
    const scope = fork();

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    await allSettled(productQuantityChanged, {
      scope,
      params: {
        productId: "keyboard",
        quantity: -10,
      },
    });

    expect(scope.getState($cart)).toEqual([
      {
        productId: "keyboard",
        quantity: 1,
      },
    ]);
  });

  it("clears cart", async () => {
    const scope = fork();

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    await allSettled(productAddedToCart, {
      scope,
      params: "mouse",
    });

    await allSettled(cartCleared, {
      scope,
    });

    expect(scope.getState($cart)).toEqual([]);
  });

  it("calculates total count", async () => {
    const scope = fork();

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    await allSettled(productAddedToCart, {
      scope,
      params: "mouse",
    });

    expect(scope.getState($totalCount)).toBe(3);
  });

  it("detects empty cart", async () => {
    const scope = fork();

    expect(scope.getState($isCartEmpty)).toBe(true);

    await allSettled(productAddedToCart, {
      scope,
      params: "keyboard",
    });

    expect(scope.getState($isCartEmpty)).toBe(false);
  });
});
