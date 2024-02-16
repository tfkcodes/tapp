import {Box} from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";
import AlertBar from "../../components/AlertBar";
import Table from "../../components/Tables";
import {capitalize, convertISODateToDate} from "../../helpers";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import ModalPage from "../../components/ModalPage";
import CheckBoxInput from "../../components/CheckBoxInput";

export default function Students(props) {
    const alert = useRef();
    const navigate = useNavigate();
    const modal = useRef();
    const [checked, setChecked] = useState();
    const [params, setParams] = useState({
        name: undefined,
        phone: undefined,
        email: undefined,
        refresh: true,
    });

    const handleChange = (event) => {
        setChecked(event.target.checked);
    }

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    return (
        <Box>
            <HeaderDisplay
                title={"Students"}
                actionButton={true}
                label={"Student"}
                onClick={() => {
                }}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/student/student"}
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
                    {
                        id: 'studentNumber',
                        label: 'Student Number',
                        customRender: true,
                        valueGetter: (item) => (item?.studentNumber),
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <CheckBoxInput checked={checked} handleChange={(event) => handleChange(event)}/>),
                    },
                ]}
                onRawClick={(item) => navigate(`details/${item?.userId}`)}
            />
            <ModalPage ref={modal}/>
        </Box>
    );
}