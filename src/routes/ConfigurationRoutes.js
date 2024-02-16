import Department from "../pages/setup/Department";
import CourseRoute from "../pages/setup/CourseRoute";
import AcademicYearRoutes from "../pages/setup/AcademicYearRoutes";
import ProgramRoutes from "../pages/setup/ProgramRoutes";
import Assessment from "../pages/setup/Assessment";

export const ConfigurationRoutes = [
    {
        label: "Academic Year",
        component: <AcademicYearRoutes/>,
        path: "/private/configuration/academic-year"
    },
    {
        label: "Departments/Collage",
        component: <Department/>,
        path: "/private/configuration/departments"
    },
    {
        label: "Programs/Class",
        component: <ProgramRoutes/>,
        path: "/private/configuration/programs"
    },
    {
        label: "Courses",
        component: <CourseRoute/>,
        path: "/private/configuration/courses"
    },
    {
        label: "Assessment",
        component: <Assessment/>,
        path: "/private/configuration/assessment"
    },
];