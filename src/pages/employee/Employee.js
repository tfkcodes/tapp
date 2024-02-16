import {Box, Grid, Typography} from "@mui/material";
import AlertBar from "../../components/AlertBar";
import Table from "../../components/Tables";
import {capitalize, convertISODateToDate} from "../../helpers";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import TextInputField from "../../components/TextInputField";
import HeaderDisplay from "../../components/HeaderDisplay";
import UpdateEmployeeInformation from "./UpdateEmployeeInformation";
import ModalPage from "../../components/ModalPage";

export default function Employee(props) {
    const alert = useRef();
    const navigate = useNavigate();
    const modal = useRef();
    const [params, setParams] = useState({
        name: undefined,
        phone: undefined,
        email: undefined,
        refresh: true,
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const EmployeeModal = (data = {}) => {
        let component = <UpdateEmployeeInformation modal={modal} data={data} refresh={refresh}/>;
        modal.current.show("Employee", component, "70%");
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Employees"}
                actionButton={true}
                label={"Employee"}
                onClick={() => EmployeeModal()}
            />
            <Grid container>
                <Grid item xs={4}>
                    <TextInputField
                        placeholder={"Name"}
                        onChange={(value) => setParams({...params, name: value})}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextInputField
                        placeholder={"Phone"}
                        onChange={(value) => setParams({...params, phone: value})}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextInputField
                        placeholder={"Email"}
                        onChange={(value) => setParams({...params, email: value})}
                    />
                </Grid>
                <Grid item xs={2}/>
            </Grid>
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/employee/employee"}
                params={params}
                columns={[
                    {
                        id: 'name',
                        label: 'Full Name',
                        customRender: true,
                        valueGetter: (item) => capitalize(item?.name),
                    },
                    {
                        id: 'gender',
                        label: 'Gender',
                        customRender: true,
                        valueGetter: (item) => (item?.gender),
                    },
                    {
                        id: 'email',
                        label: 'Email',
                        customRender: true,
                        valueGetter: (item) => (item?.email),
                    },
                    {
                        id: 'phone',
                        label: 'Phone',
                        customRender: true,
                        valueGetter: (item) => (item?.phone),
                    },
                    {
                        id: 'dob',
                        label: 'Date of Birth',
                        customRender: true,
                        valueGetter: (item) => convertISODateToDate(item?.dob),
                    },
                ]}
                onRawClick={(item) => navigate(`details/${item?.userId}`)}
            />
            <ModalPage ref={modal}/>
        </Box>
    );
}