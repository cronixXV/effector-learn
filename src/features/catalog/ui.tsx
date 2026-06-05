import { useUnit } from "effector-react";
import {
  $categories,
  $filteredProducts,
  $isCatalogEmpty,
  $productsCount,
  $search,
  $selectedCategory,
  categorySelected,
  searchChanged,
} from "./model";
import type { TProduct } from "../../shared/types/product";

function formatCategory(category: string) {
  if (category === "all") return "All";

  return category[0].toUpperCase() + category.slice(1);
}

type ProductCardProps = {
  product: TProduct;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <article>
      <strong>{product.title}</strong> — ${product.price}
      <span> / {formatCategory(product.category)}</span>
    </article>
  );
}

export const Catalog = () => {
  const {
    products,
    categories,
    search,
    selectedCategory,
    changeSearch,
    selectCategory,
    productsCount,
    isCatalogEmpty,
  } = useUnit({
    products: $filteredProducts,
    categories: $categories,
    search: $search,
    selectedCategory: $selectedCategory,
    changeSearch: searchChanged,
    selectCategory: categorySelected,
    productsCount: $productsCount,
    isCatalogEmpty: $isCatalogEmpty,
  });

  return (
    <section>
      <h2>Catalog</h2>

      <div>
        <input
          value={search}
          placeholder="Search products..."
          onChange={(event) => changeSearch(event.currentTarget.value)}
        />

        <select
          value={selectedCategory}
          onChange={(event) => selectCategory(event.currentTarget.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {formatCategory(category)}
            </option>
          ))}
        </select>
      </div>

      <p>Found: {productsCount}</p>

      {isCatalogEmpty ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
