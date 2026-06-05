import { Cart } from "../features/cart/ui";
import { Catalog } from "../features/catalog/ui";
import { Counter } from "../features/counter/ui";

function App() {
  return (
    <main>
      <h1>LearnShop</h1>

      <Counter />

      <hr />

      <Catalog />

      <hr />

      <Cart />
    </main>
  );
}

export default App;
