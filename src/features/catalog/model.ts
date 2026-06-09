import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import type { TProduct } from "../../shared/types/product";
import { getProducts } from "../../shared/api/products";

// Здесь событие searchChanged говорит: пользователь изменил строку поиска.
export const searchChanged = createEvent<string>();

// Здесь событие categorySelected говорит: пользователь выбрал категорию.
export const categorySelected = createEvent<string>();

// Событие productsLoaded говорит: пора загрузить товары.
// Само событие ничего не загружает.
// Оно только сообщает модели, что загрузку нужно запустить.
export const productsLoaded = createEvent();

// Effect описывает асинхронную операцию.
// В нашем случае это mock API-запрос за товарами.
export const loadProductsFx = createEffect(getProducts);

// Основной store с товарами.
// На уроке 10 он больше не стартует с productsMock.
// Сначала товаров нет, поэтому начальное значение — пустой массив.
// Потом товары попадут сюда через loadProductsFx.doneData.
export const $products = createStore<TProduct[]>([]);

// Когда произошло событие productsLoaded,
// запускаем effect загрузки товаров.
sample({
  clock: productsLoaded,
  target: loadProductsFx,
});

// Когда effect успешно завершился,
// берём данные из doneData и записываем их в $products.
sample({
  clock: loadProductsFx.doneData,
  target: $products,
});

// Store ошибки загрузки товаров.
// Если loadProductsFx завершился ошибкой,
// кладём текст ошибки в $productsError.
// При новой попытке загрузки или успешной загрузке
// старую ошибку сбрасываем.
export const $productsError = createStore<string | null>(null)
  .on(loadProductsFx.failData, (_, error) => error.message)
  .reset(productsLoaded, loadProductsFx.done);

// Derived store loading-состояния.
// pending автоматически равен true,
// пока loadProductsFx выполняется.
export const $isProductsLoading = loadProductsFx.pending;

// Store $search хранит текущее значение строки поиска.
export const $search = createStore("").on(searchChanged, (_, search) => search);

// Store $selectedCategory хранит выбранную категорию.
export const $selectedCategory = createStore("all").on(
  categorySelected,
  (_, category) => category
);

// Это derived store.
// Он автоматически пересчитывается, когда меняется $products.
// Категории не хардкодим в UI.
// Мы берём их из списка товаров.
export const $categories = $products.map((products) => {
  const categories = products.map((product) => product.category);
  const uniqueCategories = Array.from(new Set(categories));

  return ["all", ...uniqueCategories];
});

// Это главный derived store каталога.
// Он зависит сразу от трёх stores:
// - $products
// - $search
// - $selectedCategory
// Когда меняется любой из них,
// $filteredProducts пересчитывается.
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

// Derived store с количеством найденных товаров.
export const $productsCount = $filteredProducts.map(
  (products) => products.length
);

// Derived store, который говорит: каталог пустой или нет.
// Здесь достаточно .map(), потому что зависимость только от одного store.
export const $isCatalogEmpty = $filteredProducts.map(
  (products) => products.length === 0
);
