import EmployeeDepartment from "../pages/employee/EmployeeDepartment";
import TeachingCourses from "../pages/employee/TeachingCourses";
import Qualification from "../pages/employee/Qualification";
import EmployeeDetails from "../pages/employee/EmployeeDetails";

export const EmployeeRoutes = [
    {
        label: "Assign Departments",
        component: <EmployeeDepartment/>,
        path: "/private/employee/details/:id/department"
    },
    {
        label: "Teaching Courses",
        component: <TeachingCourses/>,
        path: "/private/employee/details/:id/teaching-courses"
    },
    {
        label: "Qualification",
        component: <Qualification/>,
        path: "/private/employee/details/:id/qualification"
    },
    {
        label: "Contact Details",
        component: <EmployeeDetails/>,
        path: "/private/employee/details/:id/contact-details"
    },
];