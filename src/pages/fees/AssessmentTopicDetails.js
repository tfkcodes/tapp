import {Box} from "@mui/material";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import useFetch from "../../hooks/useFetch";
import HeaderDisplay from "../../components/HeaderDisplay";
import {useParams} from "react-router-dom";
import Description from "../../components/Description";
import Editor from "../../components/Editor";
import Confirmation from "../../components/Confirmation";
import {BASE_URL} from "../../constants";
import {reportErrors} from "../../helpers";

export default function AssessmentTopicDetails(props) {
    const {topicId} = useParams();
    const alert = useRef();
    const modal = useRef();
    const [notes, setNotes] = useState();

    const [params, setParams] = useState({
        refresh: true,
        courseId: topicId
    });

    const {data: topic} = useFetch(`api/setup/topic/${topicId}`, {}, true, {}, (response) => response.data);
    const {data: notesDetails} = useFetch(`api/setup/notes-details`, {topicId: topicId && parseInt(topicId)}, true, {}, (response) => response.data);

    const ConfirmSubmit = () => {
        let component = <Confirmation
            message={"Are you sure you want to submit?"}
            handleOk={() => {
                submit();
                modal.current.hide();
            }}
            handleClose={() => modal.current.hide()}
        />
        modal.current.show("Confirmation", component, "30%")
    }

    const submit = () => {
        let data = {
            topicId: topicId && parseInt(topicId),
            description: notes,
            status: "Active"
        }

        if (notes) {
            window.axios
                .post(`${BASE_URL}api/setup/notes`, data)
                .then(response => {
                    alert.current.showSuccess("Saved Successfully.");
                })
                .catch(error => {
                    reportErrors(alert.current, error);
                });
        }
    }

    return (
        <Box>
            <Description label={"Lesson / Topic Name"} value={topic?.name}/>
            <HeaderDisplay
                title={"Notes"}
                actionButton={true}
                label={"Save Notes"}
                onClick={() => ConfirmSubmit()}
            />
            <AlertBar ref={alert}/>
            <Box>
                <Editor value={notes || notesDetails?.description} onChange={(value) => setNotes(value)}/>
            </Box>
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}