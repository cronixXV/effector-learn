import { Cart } from "../features/cart/ui";
import { Catalog } from "../features/catalog/ui";
import { Counter } from "../features/counter/ui";
import { OrderForm } from "../features/order-form/ui";

function App() {
  return (
    <main>
      <h1>LearnShop</h1>

      <Counter />

      <hr />

      <Catalog />

      <hr />

      <Cart />

      <hr />

      <OrderForm />
    </main>
  );
}

export default App;
