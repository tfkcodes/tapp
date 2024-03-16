import LessonsRoutes from "../pages/assessment/LessonsRoutes";
import Fees from "../pages/fees/Fees";
import FeesAssigment from "../pages/fees/FeesAssigment";
import PaymentHistory from "../pages/fees/PaymentsHistory";

export const FeesRoutes = [
  {
    label: "School Fees",
    component: <Fees />,
    path: "/private/fees/charges",
  },
  {
    label: "Fees Assigment",
    component: <FeesAssigment />,
    path: "/private/fees/fees-assigment",
  },
  {
    label: "Payments History",
    component: <PaymentHistory />,
    path: "/private/fees/payment-history",
  },
];
