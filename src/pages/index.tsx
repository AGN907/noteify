import { createBrowserRouter } from "react-router-dom";
import Favourite from "./Favourite";
import FolderContent, { loader as folderLoader } from "./Folders/FolderContent";
import Folders from "./Folders/FoldersList";
import Notes from "./Notes";
import Root from "./Root";
import TagsList from "./Tags/TagsList";
import Trash from "./Trash";

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
      {
        path: "trash",
        element: <Trash />,
      },
      {
        path: "folders",
        element: <Folders />,
      },
      {
        path: "folders/:folderId",
        element: <FolderContent />,
        loader: folderLoader,
      },
      {
        path: "tags",
        element: <TagsList />,
      },
    ],
  },
]);

export { router };
