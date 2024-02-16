import {Box, Typography} from "@mui/material";
import SelectInputField from "../../components/SelectInputField";
import Table from "../../components/Tables";
import DateTimeField from "../../components/DateTimeField";
import TextInputField from "../../components/TextInputField";
import ActionButtonField from "../../components/ActionButtonField";
import AlertBar from "../../components/AlertBar";
import {useRef} from "react";
import ModalPage from "../../components/ModalPage";
import Form from "../../components/Form";
import {capitalize} from "../../helpers";

export default function Programs(props) {
    const alert = useRef();
    const modal = useRef();
    const form = useRef();

    const nameInput = useRef();
    const ageInput = useRef();
    const genderInput = useRef();

    const ModalForm = () => {
        if (form.current.validate()) {
            let component = <Typography>Hellos</Typography>;
            modal.current.show('Test', component)
        }
    }
    return (
        <Box>
            <Box>
                <AlertBar ref={alert}/>
                <Form ref={form}>
                    <TextInputField ref={nameInput} label={"Full Name"} required={true}/>
                    <DateTimeField ref={ageInput} label={"DOB"} required={true}/>
                    <SelectInputField ref={genderInput} label={"Gender"} required={true} options={[]}/>
                    <ActionButtonField color={"secondary"} label={"Save"}
                                       onClick={() => ModalForm()}/>
                </Form>
            </Box>
            <Table
                url={"api/setup/department"}
                columns={[
                    {
                        id: 'name',
                        label: 'Name',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.name),
                    },
                ]}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}