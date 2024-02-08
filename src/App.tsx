import { Provider as StoreProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import store from "./app/store";
import { Toaster } from "./components/ui/sonner";
import { router } from "./pages";
import { ThemeProvider } from "./providers/ThemeProvider";

function App() {
  return (
    <StoreProvider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors />
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
