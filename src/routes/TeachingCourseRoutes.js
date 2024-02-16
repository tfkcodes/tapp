import EmployeeDetails from "../pages/employee/EmployeeDetails";
import Assessment from "../pages/setup/Assessment";
import AssessmentCourse from "../pages/assessment/AssessmentCourse";
import AssessmentTopics from "../pages/assessment/AssessmentTopics";

export const TeachingCourseRoutes = [
    {
        label: "Lessons",
        component: <Assessment/>,
        path: "/private/courses-details/lessons"
    },
    {
        label: "Test / Quiz",
        component: <EmployeeDetails/>,
        path: "/private/courses-details/test-quiz"
    },
    {
        label: "Test Results",
        component: <AssessmentTopics/>,
        path: "/private/courses-details/test-results"
    },
    {
        label: "Subscription",
        component: <AssessmentTopics/>,
        path: "/private/courses-details/subscription"
    },
];