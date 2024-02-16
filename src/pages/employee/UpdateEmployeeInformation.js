import {Box, CardMedia, Grid, Stack} from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";
import Description from "../../components/Description";
import TabLayout from "../../components/TabLayout";
import EmployeeDepartment from "./EmployeeDepartment";
import TeachingCourses from "./TeachingCourses";
import Qualification from "./Qualification";
import EmployeeDetails from "./EmployeeDetails";
import {useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {
    capitalize,
    convertISODateToDate,
    formatDateForDb,
    formatDateToISODateToDate,
    reportErrors
} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import React, {useRef, useState} from "react";
import {BASE_URL} from "../../constants";
import AlertBar from "../../components/AlertBar";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import DateTimeField from "../../components/DateTimeField";
import SelectInputField from "../../components/SelectInputField";

const genders = [
    {label: "Male", value: "Male"},
    {label: "Female", value: "Female"}
];

export default function UpdateEmployeeInformation(props) {
    const alert = useRef();
    const form = useRef();

    const nameInput = useRef();
    const genderInput = useRef();
    const dobInput = useRef();
    const phoneInput = useRef();
    const emailInput = useRef();

    const [name, setName] = useState(props.data?.name || undefined);
    const [gender, setGender] = useState(props.data?.gender || undefined);
    const [dob, setDob] = useState(props.data?.dob && new Date(props.data?.dob));
    const [phone, setPhone] = useState(props.data?.phone || undefined);
    const [email, setEmail] = useState(props.data?.email || undefined);
    const [canSubmit, setCanSubmit] = useState(true);

    const ModalForm = () => {
        let data = {
            name,
            gender,
            phone,
            email,
            dob: dob && formatDateToISODateToDate(formatDateForDb(dob)),
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.employeeId) {
                window.axios
                    .put(`${BASE_URL}api/employee/employee/${props.data?.employeeId}`, data)
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
                    .post(`${BASE_URL}api/employee/employee`, data)
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
                <Grid container>
                    <Grid item xs={4}>
                        <TextInputField
                            ref={nameInput}
                            label={"Full Name"}
                            required={true}
                            value={name}
                            onChange={(value) => setName(value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <SelectInputField
                            ref={genderInput}
                            required={true}
                            label={"Gender"}
                            options={genders}
                            value={gender}
                            onChange={(value) => setGender(value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <DateTimeField
                            ref={dobInput}
                            label={"Date of Birth"}
                            required={true}
                            value={dob}
                            onChange={(value) => setDob(value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextInputField
                            ref={phoneInput}
                            label={"Phone"}
                            required={true}
                            value={phone}
                            onChange={(value) => setPhone(value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextInputField
                            ref={emailInput}
                            label={"Email"}
                            required={true}
                            value={email}
                            onChange={(value) => setEmail(value)}
                        />
                    </Grid>
                </Grid>
                <ActionButtonField
                    disabled={!canSubmit}
                    color={"secondary"}
                    label={props?.data?.employeeId ? "Update" : "Save"}
                    onClick={() => ModalForm()}/>
            </Form>
        </Box>
    );
}