import { productsMock } from "../types/data/products";
import type { TProduct } from "../types/product";

let shouldFail = true;

export async function getProducts(): Promise<TProduct[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (shouldFail) {
    shouldFail = false;
    throw new Error("Failed to load products.");
  }

  return productsMock;
}
