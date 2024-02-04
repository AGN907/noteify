import { createBrowserRouter } from "react-router-dom";
import Notes from "./Notes";
import Root from "./Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Notes />,
      },
    ],
  },
]);

export { router };
