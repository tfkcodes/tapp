import {Box} from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";
import AlertBar from "../../components/AlertBar";
import Editor from "../../components/Editor";
import ModalPage from "../../components/ModalPage";
import {useRef, useState} from "react";
import ActionButtonField from "../../components/ActionButtonField";
import {NotificationsOutlined} from "@mui/icons-material";
import * as React from "react";

const options = [
    {label: "Students", value: "Students"},
    {label: "Employee", value: "Employee"}
];
export default function StudentNotification(props) {
    const modal = useRef();
    const alert = useRef();
    const [message, setMessage] = useState();

    return (
        <Box>
            <HeaderDisplay
                title={"Notification"}
                actionButton={true}
                label={"Notification"}
                startIcon={<NotificationsOutlined/>}
                onClick={() => {
                }}
            />
            <AlertBar ref={alert}/>
            <Box>
                <Editor value={message} onChange={(value) => setMessage(value)}/>
            </Box>
            <ActionButtonField label={"Send Notification"}/>
            <ModalPage ref={modal}/>
        </Box>
    );
}