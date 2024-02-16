import {Box, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import {capitalize, convertISODateToDate, formatDateForDb, reportErrors} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import {useParams} from "react-router-dom";
import DateTimeField from "../../components/DateTimeField";
import {Edit} from "@mui/icons-material";
import HeaderDisplay from "../../components/HeaderDisplay";
import ModalPage from "../../components/ModalPage";

export function AcademicTermModalPage(props) {
    const alert = useRef();
    const form = useRef();

    const startDateInput = useRef();
    const endDateInput = useRef();
    const descriptionInput = useRef();

    const [description, setDescription] = useState(props.data?.description || undefined);
    const [startDate, setStartDate] = useState(props.data?.startDate && new Date(props.data?.startDate));
    const [endDate, setEndDate] = useState(props.data?.endDate && new Date(props.data?.endDate));
    const [canSubmit, setCanSubmit] = useState(true);

    const ModalForm = () => {
        let data = {
            description,
            startDate: startDate && formatDateForDb(startDate),
            endDate: endDate && formatDateForDb(endDate),
            status: "Active",
            accademicYearId: props?.academicYearId && parseInt(props?.academicYearId),
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.id) {
                window.axios
                    .put(`${BASE_URL}api/setup/academic-term/${props.data?.id}`, data)
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
                    .post(`${BASE_URL}api/setup/academic-term`, data)
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
                    ref={descriptionInput}
                    label={"Description"}
                    required={true}
                    value={description}
                    onChange={(value) => setDescription(value)}
                />
                <DateTimeField
                    ref={startDateInput}
                    label={"Start Date"}
                    required={true}
                    value={startDate}
                    onChange={(value) => setStartDate(value)}
                />
                <DateTimeField
                    ref={endDateInput}
                    label={"End Date"}
                    required={true}
                    value={endDate}
                    onChange={(value) => setEndDate(value)}
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

export default function AcademicTerm(props) {
    const {id} = useParams();
    const alert = useRef();
    const modal = useRef();

    const [params, setParams] = useState({
        refresh: true,
        departmentId: undefined,
        academicYearId: parseInt(id)
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const AcademicTermModal = (data = {}) => {
        let component = <AcademicTermModalPage modal={modal} refresh={refresh} data={data} academicYearId={id}/>;
        modal.current.show("Academic Year Term", component, "60%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Academic Year Term"}
                actionButton={true}
                label={"Term"}
                onClick={() => AcademicTermModal()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/academic-term"}
                params={params}
                columns={[
                    {
                        id: 'description',
                        label: 'Description',
                        customRender: true,
                        valueGetter: (item) => (item?.description),
                    },
                    {
                        id: 'startDate',
                        label: 'Start Date',
                        customRender: true,
                        valueGetter: (item) => (convertISODateToDate(item?.startDate)),
                    },
                    {
                        id: 'name',
                        label: 'End Date',
                        customRender: true,
                        valueGetter: (item) => convertISODateToDate(item?.endDate),
                    },
                    {
                        id: "status",
                        label: "Status",
                        minWidth: 20,
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => AcademicTermModal(item)}><Edit/></IconButton>),
                    },

                ]}
            />
            <ModalPage ref={modal}/>
        </Box>
    );
}