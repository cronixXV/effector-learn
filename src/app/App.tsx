import { Catalog } from "../features/catalog/ui";
import { Counter } from "../features/counter/ui";

function App() {
  return (
    <main>
      <h1>LearnShop</h1>

      <Counter />

      <hr />

      <Catalog />
    </main>
  );
}

export default App;
