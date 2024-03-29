import {Box, IconButton} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {numberFormat, reportErrors} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import {Edit} from "@mui/icons-material";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import HeaderDisplay from "../../components/HeaderDisplay";
import useFetch from "../../hooks/useFetch";
import SelectInputField from "../../components/SelectInputField";

export function FeesAssigmentPageMadal(props) {
    const alert = useRef();
    const form = useRef();

    const amountInput = useRef();
    const yearInput = useRef();
    const programInput = useRef();
    const feesInput = useRef();

    const [amount, setAmount] = useState(props?.data?.amount || undefined);
    const [yearId, setYearId] = useState(props?.data?.academicYearId);
    const [programId, setProgramId] = useState(props?.data?.programId);
    const [feeId, setFeeId] = useState(props?.data?.feeId);
    const [feeName, setFeeName] = useState();
    const [canSubmit, setCanSubmit] = useState(true);

    const {data: years} = useFetch("api/setup/academic-year", {
        page: 1,
        limit: 25,
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.id, label: e.description, ...e};
    }));


    const {data: programs} = useFetch("api/setup/program", {
        page: 1,
        limit: 25,
        name: ""
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.programId, label: e.name, ...e};
    }));

    const {data: fees} = useFetch("api/setup/fees", {
        page: 1,
        limit: 25,
        name: feeName
    }, true, [], (response) => response.data.data.map(e => {
        return {value: e.feeId, label: e.name, ...e};
    }));

    const ModalForm = () => {
        let data = {
            feeId,
            academicYearId: yearId,
            programId,
            amount,
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.feeId) {
                window.axios
                    .put(`${BASE_URL}api/setup/fees-assigment/${props.data?.feeId}`, data)
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
                    .post(`${BASE_URL}api/setup/fees-assigment`, data)
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
                    ref={yearInput}
                    required={true}
                    label={"Academic Year"}
                    options={years}
                    value={yearId}
                    onChange={(value) => setYearId(value)}
                />
                <SelectInputField
                    ref={programInput}
                    required={true}
                    label={"Program"}
                    options={programs}
                    value={programId}
                    onChange={(value) => setProgramId(value)}
                />
                <SelectInputField
                    ref={feesInput}
                    required={true}
                    label={"Fee"}
                    options={fees}
                    value={feeId}
                    onKeyDown={(value) => setFeeName(value)}
                    onChange={(value) => setFeeId(value)}
                />
                <TextInputField
                    ref={amountInput}
                    label={"Amount"}
                    type={"number"}
                    required={true}
                    value={amount}
                    onChange={(value) => setAmount(value)}
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

export default function FeesAssigment(props) {
    const alert = useRef();
    const modal = useRef();
    const [params, setParams] = useState({
        refresh: true,
        departmentId: undefined
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const FeeAssigmentModal = (data = {}) => {
        let component = <FeesAssigmentPageMadal modal={modal} refresh={refresh} data={data}/>;
        modal.current.show("Fees Assigment", component, "50%")
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Fees Assigment"}
                actionButton={true}
                label={"Assign"}
                onClick={() => FeeAssigmentModal()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/fees-assigment"}
                params={params}
                columns={[
                    {
                        id: 'name',
                        label: 'Fee Description',
                        customRender: true,
                        valueGetter: (item) => (item?.fees?.name),
                    },
                    {
                        id: 'amount',
                        label: 'Amount',
                        customRender: true,
                        valueGetter: (item) => numberFormat(item?.amount || 0),
                    },
                    {
                        id: 'program',
                        label: 'Program',
                        customRender: true,
                        valueGetter: (item) => (item?.program?.name),
                    },
                    {
                        id: 'academicYear',
                        label: 'Academic Year',
                        customRender: true,
                        valueGetter: (item) => (item?.academicYear?.description),
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => FeeAssigmentModal(item)}><Edit/></IconButton>),
                    },
                ]}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}