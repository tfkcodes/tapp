import { StudentAttendance } from "../pages/attendance/StudentAttendance";
import { TeacherAttendance } from "../pages/attendance/TeacherAttendance";

export const AttendanceRoutes = [
  {
    label: "Teacher Attendance",
    component: <TeacherAttendance />,
    path: "/private/attendance",
  },
  {
    label: "Student Attendance",
    component: <StudentAttendance />,
    path: "/private/attendance",
  },
];
