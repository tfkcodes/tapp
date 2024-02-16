import {Box, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {
    capitalize,
    reportErrors
} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import {Edit} from "@mui/icons-material";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import useFetch from "../../hooks/useFetch";
import HeaderDisplay from "../../components/HeaderDisplay";
import SelectInputField from "../../components/SelectInputField";
import {useNavigate} from "react-router-dom";

const levels = [
    {label: "Nursery", value: "Nursery"},
    {label: "Primary", value: "Primary"},
    {label: "Secondary", value: "Secondary"},
    {label: "A Level", value: "Advanced"},
    {label: "Collage / University", value: "Collage"},
];

export function EmployeeDetailModal(props) {
    const alert = useRef();
    const form = useRef();

    const descriptionInput = useRef();
    const levelInput = useRef();

    const [description, setDescription] = useState(props.data?.name || undefined);
    const [level, setLevel] = useState(props.data?.level || undefined);
    const [canSubmit, setCanSubmit] = useState(true);

    const {data: assessments} = useFetch("api/setup/assessment", {
        page: 1,
        limit: 25,
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.id, label: e.name, ...e};
    }));

    const ModalForm = () => {
        let data = {
            name: description,
            level,
            status: "active",
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.id) {
                window.axios
                    .put(`${BASE_URL}api/setup/quiz/${props.data?.id}`, data)
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
                    .post(`${BASE_URL}api/setup/quiz`, data)
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
                    ref={levelInput}
                    required={true}
                    label={"Education Level"}
                    options={levels}
                    value={level}
                    onChange={(value) => setLevel(value)}
                />
                <TextInputField
                    ref={descriptionInput}
                    label={"Description"}
                    required={true}
                    value={description}
                    onChange={(value) => setDescription(value)}
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

export default function QuizConfiguration(props) {
    const alert = useRef();
    const modal = useRef();
    const navigate = useNavigate();

    const [params, setParams] = useState({
        refresh: true,
        departmentId: undefined,
        userId: props?.employeeId
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const ContactModal = (data = {}) => {
        let component = <EmployeeDetailModal
            modal={modal}
            refresh={refresh}
            data={data}
            employeeId={props?.employeeId}/>;
        modal.current.show("Test / Quiz", component, "60%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Test / Quiz"}
                actionButton={true}
                label={"Test / Quiz"}
                onClick={() => ContactModal()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/quiz"}
                params={params}
                columns={[
                    {
                        id: 'name',
                        label: 'Description',
                        customRender: true,
                        valueGetter: (item) => item.name,
                    },
                    {
                        id: 'level',
                        label: 'Education Level',
                        customRender: true,
                        valueGetter: (item) => item.level,
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => ContactModal(item)}><Edit/></IconButton>),
                    },
                ]}
                onRawClick={(item) => navigate(`/private/assessment/test-quiz/${item?.id}`)}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}