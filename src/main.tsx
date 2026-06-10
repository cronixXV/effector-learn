import { fork } from "effector";
import { Provider } from "effector-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
// import { $selectedCategory } from "./features/catalog/model";

// Создаёт изолированный scope приложения.
const appScope = fork();
//   {
//   values: [[$selectedCategory, "electronics"]],
//

//fork() → создаёт изолированный Scope

// Provider → передаёт Scope в React-дерево

// useUnit→ читает stores и вызывает events/effects внутри текущего Scope

// Scope полезен для: тестов, SSR, изоляции состояния, начальной гидратации
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Передаёт этот scope всем Effector hooks внутри React-дерева. Provider — это
    React Context Provider из effector-react, который принимает Scope в value и
    заставляет hooks внутри поддерева работать с этим scope. */}
    <Provider value={appScope}>
      <App />
    </Provider>
  </StrictMode>
);
