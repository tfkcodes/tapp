import AssessmentCourseRoute from "../pages/assessment/AssessmentCourseRoute";
import StudentDetailRoute from "../pages/students/StudentDetailRoute";

export const StudentRoutes = [
    {
        label: "Students",
        component: <StudentDetailRoute/>,
        path: "/private/students"
    },
    {
        label: "Student Classes",
        component: <AssessmentCourseRoute/>,
        path: "/private/students/classes"
    },
];