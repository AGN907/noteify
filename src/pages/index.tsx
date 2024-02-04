import { createBrowserRouter } from "react-router-dom";
import Notes from "./Notes";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Notes />
  }
])


export { router }

