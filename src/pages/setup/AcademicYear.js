import {Box, Grid, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {capitalize, convertISODateToDate, formatDateForDb, reportErrors} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import {Edit} from "@mui/icons-material";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import useFetch from "../../hooks/useFetch";
import DateTimeField from "../../components/DateTimeField";
import {useNavigate} from "react-router-dom";
import HeaderDisplay from "../../components/HeaderDisplay";


export function AcademicYearTermModalPage(props) {
    const alert = useRef();
    const form = useRef();

    const codeInput = useRef();

    const [departmentId, setDepartmentId] = useState(props?.data?.departmentId || undefined);
    const [code, setCode] = useState(props?.data?.code || undefined);
    const [name, setName] = useState(props?.data?.name || undefined);
    const [departmentName, setDepartmentName] = useState();
    const [canSubmit, setCanSubmit] = useState(true);

    const {data: departments} = useFetch("api/setup/department", {
        page: 1,
        limit: 25,
        name: departmentName
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.departmentId, label: e.name, ...e};
    }));

    const ModalForm = () => {
        let data = {
            departmentId,
            code,
            name,
            status: "Active",
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.courseId) {
                window.axios
                    .put(`${BASE_URL}api/setup/course/${props.data?.courseId}`, data)
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
                    .post(`${BASE_URL}api/setup/course`, data)
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
                <Grid container>
                    <Grid item xs={11}>
                        <TextInputField
                            ref={codeInput}
                            placeholder={"Description"}
                            required={true}
                            value={code}
                            onChange={(value) => setCode(value)}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <ActionButtonField
                            disabled={!canSubmit}
                            color={"secondary"}
                            label={props?.data?.courseId ? "Update" : "Save"}
                            onClick={() => ModalForm()}/>
                    </Grid>
                </Grid>
            </Form>
            <Table
                title={"Terms"}
                url={"api/setup/course"}
                params={{}}
                columns={[
                    {
                        id: 'description',
                        label: 'Description',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.code),
                    },
                    {
                        id: 'code',
                        label: 'Start Date',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.code),
                    },
                    {
                        id: 'name',
                        label: 'End Date',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.name),
                    },
                    {
                        id: "status",
                        label: "Status",
                        minWidth: 20,
                    },

                ]}
            />
        </Box>
    );
}


export function AcademicYearModalPage(props) {
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
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.id) {
                window.axios
                    .put(`${BASE_URL}api/setup/academic-year/${props.data?.id}`, data)
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
                    .post(`${BASE_URL}api/setup/academic-year`, data)
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

export default function AcademicYear(props) {
    const alert = useRef();
    const modal = useRef();
    const navigation = useNavigate();

    const [params, setParams] = useState({
        refresh: true,
        departmentId: undefined
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const AcademicYearModal = (data = {}) => {
        let component = <AcademicYearModalPage modal={modal} refresh={refresh} data={data}/>;
        modal.current.show("Academic Year", component, "60%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Academic Year"}
                actionButton={true}
                label={"Academic"}
                onClick={() => AcademicYearModal()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/academic-year"}
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
                            <IconButton onClick={() => AcademicYearModal(item)}><Edit/></IconButton>),
                    },
                ]}
                onRawClick={(item) => {
                    navigation(`/private/configuration/academic-year/${item.id}`)
                }}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}