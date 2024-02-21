import OtherLayout from "../OtherLayout";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../constants";
import TabLayout from "../../components/TabLayout";
import { AssessmentRoutes } from "../../routes/AssessmentRoutes";
import TeachingCourses from "../teacher/TeachingCourses";
import Payments from "../teacher/Payments";
import TeacherProfile from "../teacher/TeacherProfile";
import TeachingCourseDetails from "../teacher/TeachingCourseDetails";
import { ConfigurationRoutes } from "../../routes/ConfigurationRoutes";
import Employee from "../employee/Employee";
import EditEmployee from "../employee/EditEmployee";
import Students from "../students/Students";
import StudentDetails from "../students/StudentDetails";
import { FeesRoutes } from "../../routes/FeesRoutes";
import Notification from "../setup/Notification";
import Library from "../library/Library";
import { LibraryRoutes } from "../../routes/LibraryRoutes";

export default function Private(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    window.axios
      .get(`${BASE_URL}api/authentication/user`)
      .then((response) => {
        if (!response.data) {
          navigate("/");
        }
        window.$user = response.data;
        setUser(window.$user);
      })
      .catch((error) => {
        navigate("/");
      });
  };

  return (
    <OtherLayout user={user}>
      <Routes>
        <Route exact={true} path={"/courses"} element={<TeachingCourses />} />
        <Route
          exact={true}
          path={"/courses-details/:courseId"}
          element={<TeachingCourseDetails />}
        />
        <Route exact={true} path={"/payments"} element={<Payments />} />
        <Route exact={true} path={"/notification"} element={<Notification />} />
        <Route exact={true} path={"/profile"} element={<TeacherProfile />} />
        <Route
          exact={true}
          path={"fees/*"}
          element={<TabLayout component={FeesRoutes} />}
        />
        <Route
          exact={true}
          path={"assessment/*"}
          element={<TabLayout component={AssessmentRoutes} />}
        />
        <Route exact={true} path={"/students"} element={<Students />} />
        <Route
          exact={true}
          path={"students/details/:id/*"}
          element={<StudentDetails />}
        />
        <Route exact={true} path={"employee"} element={<Employee />} />
        <Route
          exact={true}
          path={"employee/details/:id/*"}
          element={<EditEmployee />}
        />
        <Route
          exact={true}
          path={"library"}
          element={<TabLayout component={LibraryRoutes} />}
        />
        <Route
          exact={true}
          path={"/configuration/*"}
          element={<TabLayout component={ConfigurationRoutes} />}
        />
      </Routes>
    </OtherLayout>
  );
}
