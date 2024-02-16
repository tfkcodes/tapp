import {Box, Grid, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {capitalize, convertISODateToDate, formatDateForDb, reportErrors} from "../../helpers";
import { Delete} from "@mui/icons-material";
import {BASE_URL} from "../../constants";
import useFetch from "../../hooks/useFetch";
import SelectInputField from "../../components/SelectInputField";
import HeaderDisplay from "../../components/HeaderDisplay";
import Confirmation from "../../components/Confirmation";

export default function EmployeeDepartment(props) {
    const alert = useRef();
    const modal = useRef();
    const [departmentName, setDepartmentName] = useState();
    const [params, setParams] = useState({
        refresh: true,
        employeeId: props?.employeeId && parseInt(props?.employeeId)
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const {data: departments} = useFetch("api/setup/department", {
        page: 1,
        limit: 25,
        name: departmentName
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.departmentId, label: e.name, ...e};
    }));

    const ConfirmRemove = (item) => {
        let component = <Confirmation
            message={"Are you sure you want to remove this department?"}
            handleOk={() => {
                remove(item);
                modal.current.hide();
            }}
            handleClose={() => modal.current.hide()}
        />
        modal.current.show("Confirmation", component, "30%")
    }


    const remove = (item) => {
        let data = {
            status: "Inactive",
            schoolId: window.$user.schoolId
        };
        if (item) {
            window.axios
                .put(`${BASE_URL}api/employee/assign-department/${item?.id}`, data)
                .then(response => {
                    alert.current.showSuccess("Removed Successfully.");
                    setTimeout(() => {
                        refresh();
                    }, 1000)
                })
                .catch(error => {
                    reportErrors(alert.current, error);
                });
        }
    }

    const submit = (departmentId) => {
        let data = {
            departmentId: departmentId && parseInt(departmentId),
            employeeId: props?.employeeId && parseInt(props?.employeeId),
            assignedDate: formatDateForDb(new Date()),
            status: "Active",
            schoolId: window.$user.schoolId
        };
        if (departmentId) {
            window.axios
                .post(`${BASE_URL}api/employee/assign-department`, data)
                .then(response => {
                    alert.current.showSuccess("Assign Successfully.");
                    setTimeout(() => {
                        refresh();
                    }, 1000)
                })
                .catch(error => {
                    reportErrors(alert.current, error);
                });
        }
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Department"}
                actionButton={false}
            />
            <Grid sx={{display: "flex"}}>
                <Box sx={{flexGrow: 1}}>
                    <SelectInputField
                        placeholder={"Department"}
                        options={departments}
                        onKeyDown={(value) => setDepartmentName(value)}
                        onChange={(value) => submit(value)}
                    />
                </Box>
            </Grid>
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/employee/assign-department"}
                params={params}
                columns={[
                    {
                        id: 'name',
                        label: 'Name',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.department?.name || ""),
                    },
                    {
                        id: 'assignedDate',
                        label: 'Assigned Date',
                        customRender: true,
                        valueGetter: (item) => convertISODateToDate(item.assignedDate),
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => ConfirmRemove(item)}><Delete/></IconButton>),
                    },
                ]}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}