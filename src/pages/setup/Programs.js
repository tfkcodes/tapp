import {Box, IconButton} from "@mui/material";
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
import {useNavigate} from "react-router-dom";

const educationLeveles = [
    {label: "Nursery", value: "Nursery"},
    {label: "Primary", value: "Primary"},
    {label: "Secondary", value: "Secondary"},
    {label: "A Level", value: "Advanced"},
    {label: "Collage / University", value: "Collage"},
];

export function AddProgram(props) {
    const alert = useRef();
    const form = useRef();
    const levelInput = useRef();

    const departmentInput = useRef();
    const codeInput = useRef();
    const nameInput = useRef();

    const [departmentId, setDepartmentId] = useState(props?.data?.departmentId || undefined);
    const [code, setCode] = useState(props?.data?.code || undefined);
    const [name, setName] = useState(props?.data?.name || undefined);
    const [level, setLevel] = useState(props.data?.level || undefined);
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
            level,
            status: "Active",
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.programId) {
                window.axios
                    .put(`${BASE_URL}api/setup/program/${props.data?.programId}`, data)
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
                    .post(`${BASE_URL}api/setup/program`, data)
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
                <SelectInputField
                    ref={departmentInput}
                    label={"Department"}
                    required={true}
                    options={departments}
                    value={departmentId}
                    onKeyDown={(value) => setDepartmentName(value)}
                    onChange={(value) => setDepartmentId(value)}
                />
                <SelectInputField
                    ref={levelInput}
                    label={"Level"}
                    required={true}
                    options={educationLeveles}
                    value={level}
                    onChange={(value) => setLevel(value)}
                />
                <TextInputField
                    ref={codeInput}
                    label={"Program Code"}
                    required={true}
                    value={code}
                    onChange={(value) => setCode(value)}
                />
                <TextInputField
                    ref={nameInput}
                    label={"Program Name"}
                    required={true}
                    value={name}
                    onChange={(value) => setName(value)}
                />
                <ActionButtonField
                    disabled={!canSubmit}
                    color={"secondary"}
                    label={props?.data?.programId ? "Update" : "Save"}
                    onClick={() => ModalForm()}/>
            </Form>
        </Box>
    );
}

export default function Programs(props) {
    const alert = useRef();
    const modal = useRef();
    const navigate = useNavigate();

    const [departmentName, setDepartmentName] = useState();
    const [params, setParams] = useState({
        refresh: true,
        departmentId: undefined
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
    const ProgramModal = (data = {}) => {
        let component = <AddProgram modal={modal} refresh={refresh} data={data}/>;
        modal.current.show("Program", component, "60%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Program"}
                actionButton={true}
                label={"Program"}
                onClick={() => ProgramModal()}
            />
            <Box sx={{display: "flex"}}>
                <Box sx={{flexGrow: 1}}>
                    <SelectInputField
                        placeholder={"Department"}
                        options={departments}
                        onKeyDown={(value) => setDepartmentName(value)}
                        onChange={(value) => setParams({...params, departmentId: value})}
                    />
                </Box>
            </Box>
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/program"}
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
                        id: 'level',
                        label: 'Level',
                        customRender: true,
                        valueGetter: (item) => (item?.level),
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => ProgramModal(item)}><Edit/></IconButton>),
                    },
                ]}
                onRawClick={(item) => navigate(`/private/configuration/programs/${item?.programId}`)}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}