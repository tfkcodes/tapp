import {Box, Grid, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {capitalize, reportErrors} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import {ListAltOutlined} from "@mui/icons-material";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import useFetch from "../../hooks/useFetch";
import SelectInputField from "../../components/SelectInputField";
import HeaderDisplay from "../../components/HeaderDisplay";
import {useNavigate, useParams} from "react-router-dom";

export function TopicTestModalPage(props) {
    const alert = useRef();
    const form = useRef();

    const codeInput = useRef();
    const nameInput = useRef();

    const [code, setCode] = useState(props?.data?.code || undefined);
    const [name, setName] = useState(props?.data?.name || undefined);
    const [canSubmit, setCanSubmit] = useState(true);

    const ModalForm = () => {
        let data = {
            code,
            name,
            courseId: props.courseId && parseInt(props.courseId),
            status: "Active",
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.topicId) {
                window.axios
                    .put(`${BASE_URL}api/setup/topic/${props.data?.topicId}`, data)
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
                    .post(`${BASE_URL}api/setup/topic`, data)
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
        </Box>
    );
}

export default function AssessmentTopics(props) {
    const {courseId} = useParams();
    const alert = useRef();
    const modal = useRef();
    const navigate = useNavigate();

    const [courseName, setCourseName] = useState();
    const [params, setParams] = useState({
        refresh: true,
        courseId: courseId
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const {data: courses} = useFetch("api/employee/assign-courses", {
        page: 1,
        limit: 25,
        name: courseName,
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.courseId, label: e?.course?.name, ...e};
    }));

    const TestModal = (data = {}) => {
        let component = <TopicTestModalPage modal={modal} refresh={refresh} courseId={courseId} data={data}/>;
        modal.current.show("Test/Quiz", component, "80%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Lessons / Topics"}
                actionButton={false}
            />
            <Grid sx={{display: "flex"}}>
                <Box sx={{flexGrow: 1}}>
                    <SelectInputField
                        placeholder={"Courses"}
                        options={courses}
                        onKeyDown={(value) => setCourseName(value)}
                        onChange={(value) => setParams({...params, courseId: value})}
                    />
                </Box>
            </Grid>
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/topic"}
                params={params}
                columns={[
                    {
                        id: 'code',
                        label: 'Code',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.code),
                    },
                    {
                        id: 'name',
                        label: 'Name',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.name),
                    },
                    {
                        id: 'choices',
                        label: 'Test/Quiz',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton
                                onClick={() => TestModal(item)}><ListAltOutlined/></IconButton>),
                    },
                ]}
                onRawClick={(item) => navigate(`/private/assessment/topics/${item?.topicId}`)}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}