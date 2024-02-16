import {Box} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {capitalize, reportErrors} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import HeaderDisplay from "../../components/HeaderDisplay";


export function AddDepartment(props) {
    const alert = useRef();
    const form = useRef();

    const nameInput = useRef();
    const [name, setName] = useState(props?.data?.name || undefined);
    const [canSubmit, setCanSubmit] = useState(true);

    const ModalForm = () => {
        let data = {
            name,
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.departmentId) {
                window.axios
                    .put(`${BASE_URL}api/setup/department/${props.data?.departmentId}`, data)
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
                    .post(`${BASE_URL}api/setup/department`, data)
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
                    ref={nameInput}
                    label={"Name"}
                    required={true}
                    value={name}
                    onChange={(value) => setName(value)}
                />
                <ActionButtonField
                    disabled={!canSubmit}
                    color={"secondary"}
                    label={props?.data?.departmentId ? "Update" : "Save"}
                    onClick={() => ModalForm()}/>
            </Form>
        </Box>
    );
}

export default function Department(props) {
    const alert = useRef();
    const modal = useRef();
    const [params, setParams] = useState({
        refresh: true
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }
    const DepartmentModal = (data = {}) => {
        let component = <AddDepartment modal={modal} refresh={refresh} data={data}/>;
        modal.current.show("Department", component, "60%")
    }
    return (
        <Box>
            <HeaderDisplay
                title={"Departments"}
                actionButton={true}
                label={"Department"}
                onClick={() => DepartmentModal()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/department"}
                params={params}
                columns={[
                    {
                        id: 'name',
                        label: 'Name',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.name),
                    },
                ]}
                onRawClick={(item) => DepartmentModal(item)}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}