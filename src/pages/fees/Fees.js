import {Box, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {reportErrors} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import {Edit} from "@mui/icons-material";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import HeaderDisplay from "../../components/HeaderDisplay";

export function FeesMadal(props) {
    const alert = useRef();
    const form = useRef();

    const nameInput = useRef();

    const [name, setName] = useState(props?.data?.name || undefined);
    const [canSubmit, setCanSubmit] = useState(true);

    const ModalForm = () => {
        let data = {
            name,
            status: "Active",
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.feeId) {
                window.axios
                    .put(`${BASE_URL}api/setup/fees/${props.data?.feeId}`, data)
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
                    .post(`${BASE_URL}api/setup/fees`, data)
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
                    label={"Description"}
                    required={true}
                    value={name}
                    onChange={(value) => setName(value)}
                />
                <ActionButtonField
                    disabled={!canSubmit}
                    color={"primary"}
                    label={props?.data?.feeId ? "Update" : "Save"}
                    onClick={() => ModalForm()}/>
            </Form>
        </Box>
    );
}

export default function Fees(props) {
    const alert = useRef();
    const modal = useRef();
    const [params, setParams] = useState({
        refresh: true,
        departmentId: undefined
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const FeeModal = (data = {}) => {
        let component = <FeesMadal modal={modal} refresh={refresh} data={data}/>;
        modal.current.show("Fees", component, "50%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Fees"}
                actionButton={true}
                label={"Fee"}
                onClick={() => FeeModal()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/fees"}
                params={params}
                columns={[
                    {
                        id: 'name',
                        label: 'Fee Description',
                        customRender: true,
                        valueGetter: (item) => (item?.name),
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => FeeModal(item)}><Edit/></IconButton>),
                    },
                ]}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}