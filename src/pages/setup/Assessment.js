import {Box, Typography} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {capitalize, reportErrors} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import {AddOutlined} from "@mui/icons-material";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import HeaderDisplay from "../../components/HeaderDisplay";


export function AssessmentModal(props) {
    const alert = useRef();
    const form = useRef();

    const nameInput = useRef();
    const weightInput = useRef();

    const [name, setName] = useState(props?.data?.name || undefined);
    const [weight, setWeight] = useState(props?.data?.weight || undefined);
    const [canSubmit, setCanSubmit] = useState(true);

    const ModalForm = () => {
        let data = {
            name,
            weight: weight && parseInt(weight),
            status: "Active",
            schoolId: window.$user.schoolId
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.id) {
                window.axios
                    .put(`${BASE_URL}api/setup/assessment/${props.data?.id}`, data)
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
                    .post(`${BASE_URL}api/setup/assessment`, data)
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
                <TextInputField
                    ref={weightInput}
                    label={"Weight (%)"}
                    required={true}
                    type={"number"}
                    value={weight}
                    onChange={(value) => setWeight(value)}
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

export default function Assessment(props) {
    const alert = useRef();
    const modal = useRef();
    const [params, setParams] = useState({
        refresh: true
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }
    const Assessment = (data = {}) => {
        let component = <AssessmentModal modal={modal} refresh={refresh} data={data}/>;
        modal.current.show("Assessment", component, "60%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Assessments"}
                actionButton={true}
                label={"Assessment"}
                onClick={() => Assessment()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/assessment"}
                params={params}
                columns={[
                    {
                        id: 'name',
                        label: 'Name',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.name || ""),
                    },
                    {
                        id: 'weight',
                        label: 'Weight %',
                        customRender: true,
                        valueGetter: (item) => (item?.weight + " %"),
                    },
                ]}
                onRawClick={(item) => Assessment(item)}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}