import { Box } from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";
import { useRef, useState } from "react";
import AlertBar from "../../components/AlertBar";
import Table from "../../components/Tables";
import { capitalize, numberFormat } from "../../helpers";
import ModalPage from "../../components/ModalPage";
import AddCourseModal from "./AddCourseModal";
import { useNavigate } from "react-router-dom";

export default function TeachingNotifications(props) {
  const alert = useRef();
  const modal = useRef();
  const navigate = useNavigate();
  const [params, setParams] = useState({
    name: undefined,
    phone: undefined,
    email: undefined,
    refresh: true,
  });

  const refresh = () => {
    setParams({ ...params, refresh: !params.refresh });
  };

  const CourseModal = () => {
    let component = <AddCourseModal modal={modal} refresh={refresh} />;
    modal.current.show("Course", component, "50%");
  };

  return (
    <Box>
      <HeaderDisplay
        title={"School Notifications"}
        actionButton={true}
        label={"Course"}
        onClick={() => CourseModal()}
      />
      <AlertBar ref={alert} />
      <Table
        title={""}
        url={"api/notification"}
        params={params}
        columns={[
          {
            id: "title",
            label: "Title",
            customRender: true,
            valueGetter: (item) => capitalize(item?.title || ""),
          },
          {
            id: "message",
            label: "Message",
            customRender: true,
            valueGetter: (item) => item?.message,
          },
        ]}
        onRawClick={(item) => navigate(`/private/courses-details/${item.id}`)}
      />
      <ModalPage ref={modal} />
    </Box>
  );
}
