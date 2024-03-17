import { Route, Routes, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Layout from "../components/Layout";
import TabLayout from "../components/TabLayout";
import { ConfigurationRoutes } from "../routes/ConfigurationRoutes";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";
import AcademicTerm from "./setup/AcademicTerm";
import Employee from "./employee/Employee";
import EditEmployee from "./employee/EditEmployee";
import { AssessmentRoutes } from "../routes/AssessmentRoutes";
import { LibraryRoutes } from "../routes/LibraryRoutes";

export default function Protected() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    window.axios
      .get(`${BASE_URL}api/auth/user`)
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
    <Box>
      <Layout user={user}>
        <Routes>
          <Route
            exact={true}
            path={"assessment/*"}
            element={<TabLayout component={AssessmentRoutes} />}
          />
          <Route exact={true} path={"employee"} element={<Employee />} />
          <Route
            exact={true}
            path={"employee/details/:id/*"}
            element={<EditEmployee />}
          />
          <Route
            exact={true}
            path={"configuration/*"}
            element={<TabLayout component={ConfigurationRoutes} />}
          />
          <Route
            exact={true}
            path={"library/*"}
            element={<TabLayout component={LibraryRoutes} />}
          />
          <Route
            exact={true}
            path={"configuration/academic-terms/:id"}
            element={<AcademicTerm />}
          />
        </Routes>
      </Layout>
    </Box>
  );
}
