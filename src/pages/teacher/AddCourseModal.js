import {Box, Grid} from "@mui/material";
import React, {useRef, useState} from "react";
import AlertBar from "../../components/AlertBar";
import {BASE_URL} from "../../constants";
import {reportErrors} from "../../helpers";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import ActionButtonField from "../../components/ActionButtonField";
import SelectInputField from "../../components/SelectInputField";
import useFetch from "../../hooks/useFetch";

const educations = [
    {label: "Nursery", value: "Nursery"},
    {label: "Primary", value: "Primary"},
    {label: "Secondary", value: "Secondary"},
    {label: "A Level", value: "Advanced"},
    {label: "Collage / University", value: "Collage"},
];
export default function AddCourseModal(props) {
    const alert = useRef();
    const form = useRef();

    const educationLevelInput = useRef();
    const subjectInput = useRef();
    const titleInput = useRef();
    const descriptionInput = useRef();
    const priceInput = useRef();

    const [educationLevel, setEducationLevel] = useState(props.data?.level);
    const [subject, setSubject] = useState(props.data?.subjectId);
    const [title, setTitle] = useState(props.data?.title);
    const [description, setDescription] = useState(props.data?.description);
    const [price, setPrice] = useState(props.data?.price);
    const [canSubmit, setCanSubmit] = useState(true);

    const {data: levels} = useFetch("api/setup/subjects", {
        page: 1,
        limit: 25,
        level: educationLevel
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.id, label: e.name, ...e};
    }));

    const ModalForm = () => {
        let data = {
            title,
            description,
            level: educationLevel,
            subjectId: subject,
            price: price && parseFloat(price),
            status: "Active",
            employeeId: window.$user.employeeId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.id) {
                window.axios
                    .put(`${BASE_URL}api/teaching/courses/${props.data?.id}`, data)
                    .then(response => {
                        alert.current.showSuccess("Update Successfully.");
                        setCanSubmit(true);
                        setTimeout(() => {
                            props.modal.current.hide();
                            props.refresh();
                        }, 1000)
                    })
                    .catch(error => {
                        setCanSubmit(true);
                        reportErrors(alert.current, error);
                    });
            } else {
                window.axios
                    .post(`${BASE_URL}api/teaching/courses`, data)
                    .then(response => {
                        alert.current.showSuccess("Create Successfully.");
                        setCanSubmit(true);
                        setTimeout(() => {
                            props.modal.current.hide();
                            props.refresh();
                        }, 1000)
                    })
                    .catch(error => {
                        setCanSubmit(true);
                        reportErrors(alert.current, error);
                    });
            }
        }
    }

    return (
        <Box>
            <AlertBar ref={alert}/>
            <Form ref={form}>
                <SelectInputField
                    ref={educationLevelInput}
                    label={"Education Level"}
                    required={true}
                    options={educations}
                    value={educationLevel}
                    onChange={(value) => setEducationLevel(value)}
                />
                <SelectInputField
                    ref={subjectInput}
                    label={"Subject"}
                    required={true}
                    options={levels}
                    value={subject}
                    onChange={(value) => setSubject(value)}
                />
                <TextInputField
                    ref={titleInput}
                    label={"Title"}
                    required={true}
                    value={title}
                    onChange={(value) => setTitle(value)}
                />
                <TextInputField
                    ref={descriptionInput}
                    label={"Description"}
                    required={true}
                    multiline={true}
                    value={description}
                    onChange={(value) => setDescription(value)}
                />
                <TextInputField
                    ref={priceInput}
                    label={"Price"}
                    type={"number"}
                    value={price}
                    required={true}
                    onChange={(value) => setPrice(value)}
                />
                <ActionButtonField
                    disabled={!canSubmit}
                    color={"secondary"}
                    label={props?.data?.id ? "Update" : "Save"}
                    onClick={() => ModalForm()}/>
            </Form>
        </Box>
    );
}