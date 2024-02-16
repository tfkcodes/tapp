import {Box, CardMedia, Stack} from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";
import Description from "../../components/Description";
import TabLayout from "../../components/TabLayout";
import Qualification from "../employee/Qualification";
import EmployeeDetails from "../employee/EmployeeDetails";
import {useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {
    capitalize,
    convertISODateToDate,
} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import React, {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import UpdateEmployeeInformation from "../employee/UpdateEmployeeInformation";
import StudentCourses from "./StudentCourses";
import StudentNotification from "./StudentNotification";

export default function StudentDetails(props) {
    const {id} = useParams();
    const modal = useRef();
    const [params, setParams] = useState({
        refresh: true,
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const {data: employee} = useFetch(`api/employee/employee/${id}`, params, true, {}, (response) => response.data);

    const UpdateInformation = () => {
        let component = <UpdateEmployeeInformation data={employee} refresh={refresh} modal={modal}/>;
        modal.current.show("Update Information", component, "70%");
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Student Details"}
                actionButton={false}
            />
            <Box sx={{display: "flex", padding: 1}}>
                <Stack spacing={0}>
                    <Box sx={{border: 1, borderColor: "divider"}}>
                        <CardMedia
                            component="img"
                            sx={{width: 240, height: 290, objectFit: "contain"}}
                            image="../../../../assets/img/person.png"
                            alt="Profile Image"
                        />
                    </Box>
                    <Description label={"Student Number"} value={"2024-01-999"}/>
                    <Description label={"Full Name"} value={capitalize(employee?.name || "")}/>
                    <Description label={"Gender"} value={employee?.gender}/>
                    <Description label={"DoB"} value={convertISODateToDate(employee?.dob)}/>
                    <Description label={"Phone"} value={employee?.phone}/>
                    <Description label={"Email"} value={employee?.email}/>
                    <ActionButtonField label={"Update"} onClick={() => UpdateInformation()}/>
                </Stack>
                <Box sx={{flexGrow: 1, padding: 0.5}}>
                    <TabLayout component={[
                        {
                            label: "Program / Class",
                            component: <StudentCourses employeeId={id}/>,
                            path: `/private/students/details/${id}/teaching-courses`
                        },
                        {
                            label: "Assessment",
                            component: <Qualification employeeId={id}/>,
                            path: `/private/students/details/${id}/qualification`
                        },
                        {
                            label: "Contact Details",
                            component: <EmployeeDetails employeeId={id}/>,
                            path: `/private/students/details/${id}/contact-details`
                        },
                        {
                            label: "Fees",
                            component: <EmployeeDetails employeeId={id}/>,
                            path: `/private/students/details/${id}/fees`
                        },
                        {
                            label: "Notification",
                            component: <StudentNotification employeeId={id}/>,
                            path: `/private/students/details/${id}/notification`
                        },
                    ]}/>
                </Box>
            </Box>
            <ModalPage ref={modal}/>
        </Box>
    );
}