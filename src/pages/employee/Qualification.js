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

export function QualificationModalPage(props) {
    const alert = useRef();
    const form = useRef();

    const startDateInput = useRef();
    const endDateInput = useRef();
    const institutionInput = useRef();
    const programInput = useRef();

    const [institution, setInstitution] = useState(props.data?.institution || undefined);
    const [program, setProgram] = useState(props.data?.program || undefined);
    const [startDate, setStartDate] = useState(props.data?.startDate && new Date(props.data?.startDate));
    const [endDate, setEndDate] = useState(props.data?.endDate && new Date(props.data?.endDate));
    const [canSubmit, setCanSubmit] = useState(true);

    const ModalForm = () => {
        let data = {
            institution,
            program,
            startDate: startDate && formatDateToISODateToDate(formatDateForDb(startDate)),
            endDate: endDate && formatDateToISODateToDate(formatDateForDb(endDate)),
            userId: props?.employeeId && parseInt(props?.employeeId),
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.id) {
                window.axios
                    .put(`${BASE_URL}api/employee/qualification/${props.data?.id}`, data)
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
                    .post(`${BASE_URL}api/employee/qualification`, data)
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
                    ref={institutionInput}
                    label={"Institution"}
                    required={true}
                    value={institution}
                    onChange={(value) => setInstitution(value)}
                />
                <TextInputField
                    ref={programInput}
                    label={"Program"}
                    required={true}
                    value={program}
                    onChange={(value) => setProgram(value)}
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

export default function Qualification(props) {
    const alert = useRef();
    const modal = useRef();

    const [params, setParams] = useState({
        refresh: true,
        departmentId: undefined
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const AcademicYearModal = (data = {}) => {
        let component = <QualificationModalPage modal={modal} refresh={refresh} data={data}
                                                employeeId={props?.employeeId}/>;
        modal.current.show("Qualification", component, "60%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Qualifications"}
                actionButton={true}
                label={"Qualification"}
                onClick={() => AcademicYearModal()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/employee/qualification"}
                params={params}
                columns={[
                    {
                        id: 'institution',
                        label: 'Institution',
                        customRender: true,
                        valueGetter: (item) => (item?.institution),
                    },
                    {
                        id: 'program',
                        label: 'Program',
                        customRender: true,
                        valueGetter: (item) => (item?.program),
                    },
                    {
                        id: 'startDate',
                        label: 'Start Date',
                        customRender: true,
                        valueGetter: (item) => (convertISODateToDate(item?.startDate)),
                    },
                    {
                        id: 'endDate',
                        label: 'End Date',
                        customRender: true,
                        valueGetter: (item) => convertISODateToDate(item?.endDate),
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => AcademicYearModal(item)}><Edit/></IconButton>),
                    },
                ]}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}