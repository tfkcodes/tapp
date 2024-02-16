import LessonsRoutes from "../pages/assessment/LessonsRoutes";
import Fees from "../pages/fees/Fees";
import FeesAssigment from "../pages/fees/FeesAssigment";

export const FeesRoutes = [
    {
        label: "School Fees",
        component: <Fees/>,
        path: "/private/fees/charges"
    },
    {
        label: "Fees Assigment",
        component: <FeesAssigment/>,
        path: "/private/fees/fees-assigment"
    },
    {
        label: "Payments History",
        component: <LessonsRoutes/>,
        path: "/private/fees/payment-history"
    },
];