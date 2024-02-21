import { Box, Divider } from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";
import AlertBar from "../../components/AlertBar";
import Editor from "../../components/Editor";
import ModalPage from "../../components/ModalPage";
import { useRef, useState } from "react";
import SelectInputField from "../../components/SelectInputField";
import ActionButtonField from "../../components/ActionButtonField";
import { NotificationsOutlined } from "@mui/icons-material";
import * as React from "react";
import Confirmation from "../../components/Confirmation";
import { BASE_URL } from "../../constants";
import { reportErrors } from "../../helpers";
import MessageModal from "../../components/MessageModal";
import TextInputField from "../../components/TextInputField";

const options = [
  { label: "Student", value: "Student" },
  { label: "Employee", value: "Employee" },
];

export function NotificationMessage(props) {
  const [params, setParams] = useState({
    receiver: undefined,
  });

  return (
    <Box>
      <SelectInputField
        label={"To"}
        options={options}
        onChange={(value) => setParams({ ...params, receiver: value })}
      />
      <Divider sx={{ padding: 1 }} />
      <MessageModal url={"api/notification"} params={params} />
    </Box>
  );
}

export default function Notification(props) {
  const modal = useRef();
  const alert = useRef();
  const [receiver, setReceiver] = useState();
  const [title, setTitle] = useState();
  const [message, setMessage] = useState();
  const [canSubmit, setCanSubmit] = useState(true);

  const NotificationDisplay = () => {
    let component = <NotificationMessage />;
    modal.current.show("Notifications", component, "60%");
  };
  const SendConfirmation = () => {
    let component = (
      <Confirmation
        message={"Are you sure you want to send this message.?"}
        handleClose={() => modal.current.hide()}
        handleOk={() => {
          submit();
          modal.current.hide();
        }}
      />
    );
    modal.current.show("Confirmation", component, "40%");
  };

  const submit = () => {
    let data = {
      title,
      message,
      receiver,
    };
    if (data.receiver === "" || data.message === "" || data.title === "") {
      alert.current && alert.current.showError("Please fill all field..");
      return;
    }
    if (canSubmit) {
      setCanSubmit(false);
      window.axios
        .post(`${BASE_URL}api/notification`, data)
        .then((response) => {
          alert.current.showSuccess("Message Send Successfully.");
          setCanSubmit(true);
          setTimeout(() => {
            setMessage("");
            setReceiver("");
          }, 1000);
          console.log(response);
        })
        .catch((error) => {
          setCanSubmit(true);
          reportErrors(alert.current, error);
        });
    }
  };
  return (
    <Box>
      <HeaderDisplay title={"Notification"} actionButton={false} />
      <SelectInputField
        label={"To"}
        required={true}
        options={options}
        value={receiver}
        onChange={(value) => setReceiver(value)}
      />
      <TextInputField
        label={"Title"}
        required={true}
        onChange={(value) => setTitle(value)}
      />
      <HeaderDisplay
        title={"Message"}
        actionButton={true}
        label={"Notification"}
        startIcon={<NotificationsOutlined />}
        onClick={(value) => NotificationDisplay()}
      />
      <AlertBar ref={alert} />
      <Box>
        <Editor value={message} onChange={(value) => setMessage(value)} />
      </Box>
      <ActionButtonField
        label={"Send Notification"}
        onClick={() => SendConfirmation()}
      />
      <ModalPage ref={modal} />
    </Box>
  );
}
