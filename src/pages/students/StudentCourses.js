import {Box, Grid, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {capitalize, convertISODateToDate, formatDateForDb, reportErrors} from "../../helpers";
import {Delete} from "@mui/icons-material";
import {BASE_URL} from "../../constants";
import useFetch from "../../hooks/useFetch";
import SelectInputField from "../../components/SelectInputField";
import HeaderDisplay from "../../components/HeaderDisplay";
import Confirmation from "../../components/Confirmation";

export default function StudentCourses(props) {
    const alert = useRef();
    const modal = useRef();
    const [departmentName, setDepartmentName] = useState();
    const [courseName, setCourseName] = useState();
    const [departmentId, setDepartmentId] = useState();
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

    const {data: courses} = useFetch("api/setup/course", {
        page: 1,
        limit: 25,
        name: courseName,
        departmentId: departmentId || 0,
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.courseId, label: e.name, ...e};
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
                .put(`${BASE_URL}api/employee/assign-courses/${item?.id}`, data)
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

    const submit = (courseId) => {
        let data = {
            courseId: courseId && parseInt(courseId),
            employeeId: props?.employeeId && parseInt(props?.employeeId),
            status: "Active",
            schoolId: window.$user.schoolId
        };
        if (courseId) {
            window.axios
                .post(`${BASE_URL}api/employee/assign-courses`, data)
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
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/employee/assign-courses"}
                params={params}
                columns={[
                    {
                        id: 'code',
                        label: 'Code',
                        customRender: true,
                        valueGetter: (item) => (item?.course?.code || ""),
                    },
                    {
                        id: 'name',
                        label: 'Name',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.course?.name || ""),
                    },
                ]}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}