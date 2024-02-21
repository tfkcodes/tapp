import EmployeeDepartment from "../pages/employee/EmployeeDepartment";
import Qualification from "../pages/employee/Qualification";
import { LibraryBooks } from "../pages/library/Library";
import { LibraryUsers } from "../pages/library/LibraryUsers";
export const LibraryRoutes = [
  {
    label: "Library Users",
    component: <LibraryUsers />,
    path: "/private/library/",
  },
  {
    label: "Library Books",
    component: <LibraryBooks />,
    path: "/private/library",
  },
];
