import { createBrowserRouter } from "react-router-dom";
import Favourite from "./Favourite";
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
      {
        path: "favourites",
        element: <Favourite />,
      },
    ],
  },
]);

export { router };
