import {Box, Grid, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {
    capitalize,
    convertISODateToDate,
    formatDateForDb,
    formatDateToISODateToDate,
    reportErrors
} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import {Edit} from "@mui/icons-material";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import useFetch from "../../hooks/useFetch";
import DateTimeField from "../../components/DateTimeField";
import {useNavigate} from "react-router-dom";
import HeaderDisplay from "../../components/HeaderDisplay";

export function EmployeeDetailModal(props) {
    const alert = useRef();
    const form = useRef();

    const titleInput = useRef();
    const descriptionInput = useRef();

    const [title, setTitle] = useState(props.data?.title || undefined);
    const [description, setDescription] = useState(props.data?.description || undefined);
    const [canSubmit, setCanSubmit] = useState(true);

    const ModalForm = () => {
        let data = {
            title,
            description,
            userId: props?.employeeId && parseInt(props?.employeeId),
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.id) {
                window.axios
                    .put(`${BASE_URL}api/employee/contact/${props.data?.id}`, data)
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
                    .post(`${BASE_URL}api/employee/contact`, data)
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
                <TextInputField
                    ref={titleInput}
                    label={"Title"}
                    required={true}
                    value={title}
                    onChange={(value) => setTitle(value)}
                />
                <TextInputField
                    ref={descriptionInput}
                    label={"Program"}
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

export default function EmployeeDetails(props) {
    const alert = useRef();
    const modal = useRef();

    const [params, setParams] = useState({
        refresh: true,
        departmentId: undefined,
        userId: props?.employeeId
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const ContactModal = (data = {}) => {
        let component = <EmployeeDetailModal modal={modal} refresh={refresh} data={data}
                                             employeeId={props?.employeeId}/>;
        modal.current.show("Contact", component, "60%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Contacts"}
                actionButton={true}
                label={"contact"}
                onClick={() => ContactModal()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/employee/contact"}
                params={params}
                columns={[
                    {
                        id: 'title',
                        label: 'Title',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.title || ""),
                    },
                    {
                        id: 'description',
                        label: 'Description',
                        customRender: true,
                        valueGetter: (item) => (item?.description || ""),
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
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}