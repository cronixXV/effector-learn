import { sample } from "effector";
import { createGate } from "effector-react";
import {
  $isProductsLoading,
  $products,
  productsLoaded,
} from "../../features/catalog/model";

// Gate описывает lifecycle страницы.
// Когда React-компонент страницы появится на экране,
// Gate сгенерирует событие ShopPageGate.open.
// Когда компонент страницы исчезнет,
// Gate сгенерирует событие ShopPageGate.close.
export const ShopPageGate = createGate();

// Когда страница открылась,
// пробуем запустить загрузку товаров.
// Здесь мы дополнительно проверяем:
// - товары ещё не загружены;
// - загрузка прямо сейчас не идёт.
// Это защищает нас от лишних повторных запросов.
sample({
  clock: ShopPageGate.open,
  source: {
    products: $products,
    isProductsLoading: $isProductsLoading,
  },
  filter: ({ products, isProductsLoading }) => {
    return products.length === 0 && !isProductsLoading;
  },
  fn: () => undefined,
  target: productsLoaded,
});
