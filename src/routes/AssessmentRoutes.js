import Assessment from "../pages/setup/Assessment";
import AssessmentCourseRoute from "../pages/assessment/AssessmentCourseRoute";
import LessonsRoutes from "../pages/assessment/LessonsRoutes";
import QuizAssessmentRoute from "../pages/assessment/QuizAssessmentRoute";

export const AssessmentRoutes = [
    {
        label: "Assessment",
        component: <Assessment/>,
        path: "/private/assessment"
    },
    {
        label: "Courses",
        component: <AssessmentCourseRoute/>,
        path: "/private/assessment/course"
    },
    {
        label: "Lessons / Topics",
        component: <LessonsRoutes/>,
        path: "/private/assessment/topics"
    },
    {
        label: "Test / Quiz",
        component: <QuizAssessmentRoute/>,
        path: "/private/assessment/test-quiz"
    },
];