import {Box, Grid, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {capitalize, reportErrors} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import {AddOutlined, Edit} from "@mui/icons-material";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import useFetch from "../../hooks/useFetch";
import SelectInputField from "../../components/SelectInputField";
import HeaderDisplay from "../../components/HeaderDisplay";
import {useNavigate, useParams} from "react-router-dom";
import Description from "../../components/Description";


export function TopicModalPage(props) {
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
            <Form ref={form}>
                <TextInputField
                    ref={codeInput}
                    label={"Code"}
                    required={true}
                    value={code}
                    onChange={(value) => setCode(value)}
                />
                <TextInputField
                    ref={nameInput}
                    label={"Name"}
                    required={true}
                    value={name}
                    onChange={(value) => setName(value)}
                />
                <ActionButtonField
                    disabled={!canSubmit}
                    color={"secondary"}
                    label={props?.data?.topicId ? "Update" : "Save"}
                    onClick={() => ModalForm()}/>
            </Form>
        </Box>
    );
}

export default function Topic(props) {
    const {courseId} = useParams();
    const alert = useRef();
    const modal = useRef();

    const [params, setParams] = useState({
        refresh: true,
        courseId: courseId
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const {data: course} = useFetch(`api/setup/course/${courseId}`, {}, true, {}, (response) => response.data);

    const TopicModal = (data = {}) => {
        let component = <TopicModalPage modal={modal} refresh={refresh} courseId={courseId} data={data}/>;
        modal.current.show("Topic", component, "50%")
    }

    return (
        <Box>
            <Description label={"Course Name"} value={course?.name}/>
            <HeaderDisplay
                title={"Lessons / Topics"}
                actionButton={true}
                label={"Topic"}
                onClick={() => TopicModal()}
            />
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
                ]}
                onRawClick={(item) => TopicModal(item)}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}