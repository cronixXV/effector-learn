import { useUnit } from "effector-react";
import {
  $categories,
  $filteredProducts,
  $isCatalogEmpty,
  $isProductsLoading,
  $productsCount,
  $productsError,
  $search,
  $selectedCategory,
  categorySelected,
  productsLoaded,
  searchChanged,
} from "./model";
import type { TProduct } from "../../shared/types/product";
import { productAddedToCart } from "../cart/model";

function formatCategory(category: string) {
  if (category === "all") return "All";

  return category[0].toUpperCase() + category.slice(1);
}

type ProductCardProps = {
  product: TProduct;
  onAddToCart: (productId: string) => void;
};

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article>
      <strong>{product.title}</strong> — ${product.price}
      <span> / {formatCategory(product.category)}</span>
      <button onClick={() => onAddToCart(product.id)}>Add to cart</button>
    </article>
  );
}

export const Catalog = () => {
  const {
    products,
    categories,
    search,
    selectedCategory,
    productsCount,
    isCatalogEmpty,
    isProductsLoading,
    productsError,
    changeSearch,
    selectCategory,
    loadProducts,
    addToCart,
  } = useUnit({
    products: $filteredProducts,
    categories: $categories,
    search: $search,
    selectedCategory: $selectedCategory,
    productsCount: $productsCount,
    isCatalogEmpty: $isCatalogEmpty,
    isProductsLoading: $isProductsLoading,
    productsError: $productsError,
    changeSearch: searchChanged,
    selectCategory: categorySelected,
    loadProducts: productsLoaded,
    addToCart: productAddedToCart,
  });

  return (
    <section>
      <h2>Catalog</h2>

      <button onClick={() => loadProducts()} disabled={isProductsLoading}>
        {isProductsLoading ? "Loading products..." : "Load products"}
      </button>

      {productsError && (
        <div>
          <p>{productsError}</p>

          <button onClick={() => loadProducts()} disabled={isProductsLoading}>
            Retry
          </button>
        </div>
      )}

      <div>
        <input
          value={search}
          placeholder="Search products..."
          onChange={(event) => changeSearch(event.currentTarget.value)}
          disabled={isProductsLoading}
        />

        <select
          value={selectedCategory}
          onChange={(event) => selectCategory(event.currentTarget.value)}
          disabled={isProductsLoading}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {formatCategory(category)}
            </option>
          ))}
        </select>
      </div>

      <p>Found: {productsCount}</p>

      {isProductsLoading ? (
        <p>Loading catalog...</p>
      ) : isCatalogEmpty ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} onAddToCart={addToCart} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
