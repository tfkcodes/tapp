import { Box } from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";
import { useRef, useState, useEffect } from "react";
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    name: undefined,
    capacity: undefined,
    level: undefined,
    location: undefined,
    copies: undefined,
    refresh: true,
  });

  const refresh = () => {
    setParams({ ...params, refresh: !params.refresh });
  };

  return (
    <Box>
      <HeaderDisplay
        title={"Teacher Notifications"}
        actionButton={true}
        label={"New Notification"}
        onClick={() => {}}
      />
      <AlertBar ref={alert} />
      <Table
        title={""}
        url={"api/notification/employee"}
        loading={loading}
        params={params}
        columns={[
          {
            id: "title",
            label: "Title",
            customRender: true,
            valueGetter: (item) => capitalize(item?.data.title || ""),
          },
          {
            id: "message",
            label: "Message",
            customRender: true,
            valueGetter: (item) => item?.data.message,
          },
        ]}
        onRowClick={(item) =>
          navigate(`/private/notification-details/${item.id}`)
        }
      />
      <ModalPage ref={modal} />
    </Box>
  );
}
