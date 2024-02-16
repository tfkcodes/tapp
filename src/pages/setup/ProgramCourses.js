import {Box, Grid, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {capitalize, reportErrors} from "../../helpers";
import {Delete} from "@mui/icons-material";
import {BASE_URL} from "../../constants";
import useFetch from "../../hooks/useFetch";
import SelectInputField from "../../components/SelectInputField";
import HeaderDisplay from "../../components/HeaderDisplay";
import {useParams} from "react-router-dom";
import Description from "../../components/Description";
import Confirmation from "../../components/Confirmation";

export default function ProgramCourses(props) {
    const {programId} = useParams();
    const alert = useRef();
    const modal = useRef();

    const [courseName, setCourseName] = useState();
    const [params, setParams] = useState({
        refresh: true,
        programId: programId
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const {data: program} = useFetch(`api/setup/program/${programId}`, {}, true, {}, (response) => response.data);

    const {data: courses} = useFetch("api/setup/course", {
        page: 1,
        limit: 25,
        name: courseName
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.courseId, label: e.code + " - " + e.name, ...e};
    }));


    const ConfirmationDialogue = (item) => {
        let component = <Confirmation
            message={"Are you sure you want to remove this course?"}
            handleOk={() => {
                remove(item?.courseId);
                modal.current.hide();
            }}
            handleClose={() => modal.current.hide()}
        />;
        modal.current.show("Confirmation", component, "40%")
    }
    const submit = (courseId) => {
        let data = {
            programId: programId && parseInt(programId),
            courseId: programId && parseInt(courseId),
            status: "Active",
            schoolId: window.$user.schoolId
        };
        if (courseId) {
            window.axios
                .post(`${BASE_URL}api/setup/program-course`, data)
                .then(response => {
                    alert.current.showSuccess("Assigned Successfully.");
                    setTimeout(() => {
                        refresh();
                    }, 1000)
                })
                .catch(error => {
                    reportErrors(alert.current, error);
                });
        }
    }


    const remove = (courseId) => {
        let data = {
            status: "Inactive",
            schoolId: window.$user.schoolId
        };
        if (courseId) {
            window.axios
                .put(`${BASE_URL}api/setup/program-course/${courseId}`, data)
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

    return (
        <Box>
            <Description label={"Program Name"} value={program?.name}/>
            <HeaderDisplay
                title={"Assign Courses"}
                actionButton={false}
            />
            <Grid sx={{display: "flex"}}>
                <Box sx={{flexGrow: 1}}>
                    <SelectInputField
                        placeholder={"Courses"}
                        options={courses}
                        onKeyDown={(value) => setCourseName(value)}
                        onChange={(value) => {
                            if (value) {
                                submit(value)
                            }
                        }}
                    />
                </Box>
            </Grid>
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/program-course"}
                params={params}
                columns={[
                    {
                        id: 'code',
                        label: 'Code',
                        customRender: true,
                        valueGetter: (item) => (item.course?.code),
                    },
                    {
                        id: 'name',
                        label: 'Name',
                        customRender: true,
                        valueGetter: (item) => capitalize(item.course?.name),
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => ConfirmationDialogue(item)}><Delete/></IconButton>),
                    },
                ]}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}