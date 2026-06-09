import { useList, useUnit } from "effector-react";
import { productAddedToCart } from "../cart/model";
import { $filteredProducts } from "./model";
import { ProductCard } from "./ui";

export function ProductList() {
  // useList уже работает со списком и сам возвращает React elements.
  // Поэтому в Catalog его нужно использовать так:
  //   <ul>
  //   <ProductList />
  // </ul>
  const addToCart = useUnit(productAddedToCart);

  return useList($filteredProducts, (product) => (
    <li key={product.id}>
      <ProductCard product={product} onAddToCart={addToCart} />
    </li>
  ));
}
