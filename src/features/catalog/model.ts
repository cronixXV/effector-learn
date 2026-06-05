import { combine, createEvent, createStore } from "effector";
import type { TProduct } from "../../shared/types/product";
import { productsMock } from "../../shared/types/data/products";

// Здесь событие searchChanged говорит: пользователь изменил строку поиска.
export const searchChanged = createEvent<string>();
export const categorySelected = createEvent<string>();

// Это основной store с товарами, пока он статический
export const $products = createStore<TProduct[]>(productsMock);

// Store $search хранит текущее значение.
export const $search = createStore("").on(searchChanged, (_, search) => search);

export const $selectedCategory = createStore("all").on(
  categorySelected,
  (_, category) => category
);

// Это derived store.
// Он не хранится отдельно руками. Он автоматически пересчитывается на основе $products.
export const $categories = $products.map((products) => {
  const categories = products.map((product) => product.category);
  const uniqueCategories = Array.from(new Set(categories));
  return ["all", ...uniqueCategories];
});

// Это главный store урока.
// Он зависит сразу от трёх stores: $search, $products и $selectedCategory
// Когда меняется любой из них, $filteredProducts пересчитывается.
export const $filteredProducts = combine(
  {
    products: $products,
    search: $search,
    selectedCategory: $selectedCategory,
  },
  ({ products, search, selectedCategory }) => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }
);

// derived store
export const $productsCount = $filteredProducts.map(
  (products) => products.length
);

export const $isCatalogEmpty = combine(
  $filteredProducts,
  (products) => products.length === 0
);
